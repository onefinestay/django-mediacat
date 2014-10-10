 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');

var constants = require('../constants');
var matrix = require('matrix-utilities')
var uuid = require('uuid-v4');


var getScaleMatrix = function(scale) {
  return [
    [scale, 0, 0], 
    [0, scale, 0], 
    [0, 0, 1]];
};

var getTranslateMatrix = function(x, y) {
  return [
    [1, 0, x], 
    [0, 1, y], 
    [0, 0, 1]]
  ;
};

var matrixFromValues = function(v) {
  return [
    [v.x1, v.x2],
    [v.y1, v.y2],
    [1, 1]
  ];
};

var valuesFromMatrix = function(m) {
  return {
    x1: m[0][0],
    x2: m[0][1],
    y1: m[1][0],
    y2: m[1][1]
  };
};

var scaleCoordinates = function(values, scale, x, y) {
  var m = matrixFromValues(values);
  var preTranslateMatrix = getTranslateMatrix(-x, -y);
  var scaleMatrix = getScaleMatrix(scale);
  var postTranslateMatrix = getTranslateMatrix(x, y);  

  m = matrix.multiply(preTranslateMatrix, m);
  m = matrix.multiply(scaleMatrix, m);
  m = matrix.multiply(postTranslateMatrix, m);

  return valuesFromMatrix(m);
};

var translateCoordinates = function(values, dX, dY) {
  var m = matrixFromValues(values);
  var translateMatrix = getTranslateMatrix(dX, dY);  
  m = matrix.multiply(translateMatrix, m);
  return valuesFromMatrix(m);
};

var getCropOverflow = function(media, anchorX, anchorY, values) {
  // Sometimes we scale too far, so work out the scale necessary to fix it.
  var x1 = values.x1 < 0 ? -values.x1 / (anchorX - values.x1) : 0;
  var y1 = values.y1 < 0 ? -values.y1 / (anchorY - values.y1): 0;
  var x2 = values.x2 > media.get('width') ? (values.x2 - media.get('width')) / (values.x2 - anchorX) : 0;
  var y2 = values.y2 > media.get('height') ? (values.y2 - media.get('height')) / (values.y2 - anchorY) : 0;

  return {x1, y1, x2, y2, reverseScale: 1 - Math.max(x1, y1, x2, y2)};
};


var CropStore = Fluxxor.createStore({
  initialize: function(options) {
    this.bindActions(
      constants.CATEGORY_SELECTED, this.onCategorySelect,
      constants.MEDIA_SELECTED, this.onMediaSelect,
      constants.CROP_GET_START, this.onCropGetStart,
      constants.CROP_GET_SUCCESS, this.onCropGetSuccess,
      constants.CROP_SELECTED, this.onCropSelect,
      constants.CROP_DESELECTED, this.onCropDeselect,
      constants.CROP_MOVE, this.onCropMove,
      constants.CROP_RESIZE, this.onCropResize,
      constants.CROP_ADD, this.onCropAdd,
      constants.CROP_SAVE_START, this.onSaveStart,
      constants.CROP_SAVE_SUCCESS, this.onSaveSuccess,
      constants.CROP_PICK_START, this.onPickStart,
      constants.CROP_PICK_SUCCESS, this.onPickSuccess    
    );
    this.setMaxListeners(0);
    this.state = Immutable.fromJS(options);
  },

  getSelectedCrop: function() {
    var uuid = this.state.get('selectedCrop');

    if (!uuid) {
      return null;
    }
    return this.state.getIn(['crops'], Immutable.fromJS([])).find(c => c.get('uuid') === uuid);
  },

  onCropSelect: function(payload) {
    this.state = this.state.set('selectedCrop', payload.crop.get('uuid'));
    this.emit('change');    
  },

  onCropDeselect: function() {
    this.state = this.state.set('selectedCrop', null);
    this.emit('change');    
  },

  onCropResize: function(payload) {
    var crop = payload.crop;
    var media = payload.media;
    var cropIndex = this.state.get('crops').indexOf(crop);

    var cropData = crop.toJS();
    var cropWidth = cropData.x2 - cropData.x1;
    var cropHeight = cropData.y2 - cropData.y1;

    var dX = payload.dX;
    var dY = payload.dY;

    var scale;

    // What point do we anchor around, and how should we multiply the X and Y deltas;
    var anchor = {
      'center': [['x1', 'x2'], ['y1', 'y2'], 1, 1],
      'left': [['x2', 'x2'], ['y1', 'y2'], -1, 0],
      'right': [['x1', 'x1'], ['y1', 'y2'], 1, 0],
      'bottom': [['x1', 'x2'], ['y1', 'y1'], 0, 1],
      'top': [['x1', 'x2'], ['y2', 'y2'], 0, -1],      
      'top-left': [['x2', 'x2'], ['y2', 'y2'], -1, -1],
      'top-right': [['x1', 'x1'], ['y2', 'y2'], 1, -1],
      'bottom-left': [['x2', 'x2'], ['y1', 'y1'], -1, 1],
      'bottom-right': [['x1', 'x1'], ['y1', 'y1'], 1, 1]
    }[payload.position];        

    if (Math.abs(dX) >= Math.abs(dY)) {
      scale = (cropWidth + (anchor[2] * dX)) / cropWidth;
    } else {
      scale = (cropHeight + (anchor[3] * dY)) / cropHeight;
    }

    var x = (cropData[anchor[0][0]] + cropData[anchor[0][1]]) / 2;
    var y = (cropData[anchor[1][0]] + cropData[anchor[1][1]]) / 2;  
    var transformedData = scaleCoordinates(cropData, scale, x, y);

    x = (transformedData[anchor[0][0]] + transformedData[anchor[0][1]]) / 2;
    y = (transformedData[anchor[1][0]] + transformedData[anchor[1][1]]) / 2;
    var overflow = getCropOverflow(media, x, y, transformedData);

    if (overflow.reverseScale !== 1) {
      transformedData = scaleCoordinates(transformedData, overflow.reverseScale, x, y);
    }

    this.updateCrop(cropIndex, crop, transformedData);
  },

  onCropMove: function(payload) {
    var crop = payload.crop;
    var media = payload.media;
    var cropIndex = this.state.get('crops').indexOf(crop);
    var transformedData = translateCoordinates(crop.toJS(), payload.dX, payload.dY);

    var dX = 0;
    var dY = 0;

    if (transformedData.x1 < 0) {
      dX = -transformedData.x1;
    } else if (transformedData.x2 > media.get('width')) {
      dX = media.get('width') - transformedData.x2;
    }

    if (transformedData.y1 < 0) {
      dY = -transformedData.y1;
    } else if (transformedData.y2 > media.get('height')) {
      dY = media.get('height') - transformedData.y2;
    }

    if (dX || dY) {
      transformedData = translateCoordinates(transformedData, dX, dY);
    }

    this.updateCrop(cropIndex, crop, transformedData);
  },

  updateCrop: function(index, crop, data) {
    var values = {
      x1: Math.round(data.x1),
      x2: Math.round(data.x2),
      y1: Math.round(data.y1),
      y2: Math.round(data.y2)
    };

    this.state = this.state.updateIn(['crops', index], function(crop) {
      for (var k in values) {
        crop = crop.set(k, Math.round(values[k]));
      }
      crop = crop.set('changed', true);
      return crop;
    }); 
    this.emit('change');
  },

  onCropAdd: function(payload) {
    var cropType = payload.cropType;
    var media = payload.media;

    var width = media.get('width');
    var height = media.get('height');
    var ratio = width / height;

    var cropRatio = this.state.getIn(['availableCrops', cropType, 1]);
    var cropWidth;
    var cropHeight;

    var x1;
    var x2;
    var y1;
    var y2;

    if (cropRatio >= ratio) {
      // Touch the left and right
      cropWidth = width;

      x1 = 0;
      x2 = cropWidth;

      cropHeight = cropWidth / cropRatio;

      y1 = Math.round((height - cropHeight) / 2);
      y2 = height - y1;

    } else {
      cropHeight = height;

      y1 = 0;
      y2 = cropHeight;

      cropWidth = cropHeight * cropRatio;

      x1 = Math.round((width - cropWidth) / 2);
      x2 = width - x1;
    }

    var newCrop = Immutable.fromJS({
      applications: [],
      height: cropHeight,
      image: media.get('id'),
      changed: true,
      uuid: uuid(), // This doesn't get saved, it's just so that React has a key
      key: cropType,
      ratio: cropRatio,
      x1: x1,
      x2: x2,
      y1: y1,
      y2: y2
    });

    this.state = this.state.update('crops', crops => crops.push(newCrop));
    this.emit('change');
  },

  onMediaSelect: function() {
    this.state = this.state.withMutations(function(state) {
      state
        .set('crops', null)
        .set('selectedCrop', null)
    });
    this.emit('change');
  },

  onCropGetStart: function(payload) {
    var request = payload.request;
    var requests = this.state.get('fetchRequests');

    if (!requests) {
      requests = Immutable.Map();
    }
    requests = requests.set(payload.media.get('id'), request);
    this.state = this.state.set('fetchRequests', requests);
    this.emit('change');
  },

  onCropGetSuccess: function(payload) {
    var crops = Immutable.fromJS(payload.data);

    var requests = this.state.get('fetchRequests');
    requests = requests.delete(payload.mediaId);
    this.state = this.state.set('fetchRequests', requests);

    if (payload.mediaId === this.flux.stores['Media'].state.get('selectedMedia')) {
      this.state = this.state.set('crops', crops);
    }
    this.emit('change');
  },  

  onSaveStart: function(payload) {
    var crop = payload.crop;
    var request = payload.request;
    var requests = this.state.get('saveRequests', Immutable.Map());
    requests = requests.set(crop.get('uuid'), request);
    this.state = this.state.set('saveRequests', requests);
    this.emit('change');
  },

  onSaveSuccess: function(payload) {
    var crop = Immutable.fromJS(payload.data);
    var cropId = payload.cropId;
    var index;

    var requests = this.state.get('saveRequests');
    requests = requests.delete(cropId);
    this.state = this.state.set('saveRequests', requests);

    var index = this.state.get('crops').findIndex(c => c.get('uuid') === cropId);

    if (index !== -1) {
      this.state = this.state.updateIn(['crops', index], c => crop);
    }
    this.emit('change');
  },

  onPickStart: function(payload) {
    var crop = payload.crop;

    if (crop && window.opener) {
      var existingRequest = this.state.get('pickRequest');

      if (existingRequest) {
        existingRequest.abort();
      }

      this.state = this.state.set('pickRequest', payload.request);
      this.emit('change');
    }   
  },

  onPickSuccess: function() {
    this.state = this.state.set('pickRequest', null);
    this.emit('change');
  },

  onCategorySelect: function() {
    this.state = this.state.set('selectedCrop', null);    
    this.emit('change');
  }
});

module.exports = CropStore;