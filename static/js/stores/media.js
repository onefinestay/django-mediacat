 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');
var request = require('superagent');

var Constants = require('../constants');

var matrix = require('matrix-utilities')

var getScaleMatrix = function(scale) {
  return [[scale, 0, 0], [0, scale, 0], [0, 0, 1]];
};

var getTranslateMatrix = function(x, y) {
  return [[1, 0, x], [0, 1, y], [0, 0, 1]];
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
  var translateMatrix = getTranslateMatrix(x, y);  
  m = matrix.multiply(translateMatrix, m);
  return valuesFromMatrix(m);
};

var MediaStore = Fluxxor.createStore({
  actions: {
    CATEGORY_SELECTED: 'onCategorySelect',
    MEDIA_SELECTED: 'onMediaSelect',
    CROP_SELECTED: 'onCropSelect',
    CROP_DESELECTED: 'onCropDeselect',
    CROP_MOVE: 'onCropMove',
    CROP_RESIZE: 'onCropResize',
    FETCH_IMAGES_SUCCESS: 'onFetchImagesSuccess'
  },

  initialize: function(options) {
    this.setMaxListeners(0);
    this.state = Immutable.fromJS(options);
  },

  getFetchRequest: function(category, filters) {
    var query = {
      content_type_id: category.get('content_type_id'),
      object_id: category.get('object_id')
    };

    return request
      .get('/mediacat/images/')
      .query(query)
      .set('Accept', 'application/json')
      .on('error', this.flux.actions.media.fetchError)
      .end(this.flux.actions.media.fetchSuccess);
  },

  getSelectedMedia: function() {
    var id = this.state.get('selectedMedia');

    if (!id) {
      return null;
    }
    return this.state.get('media').find(m => m.get('id') === id);
  },

  getSelectedCrop: function() {
    var id = this.state.get('selectedCrop');

    if (!id) {
      return null;
    }

    var media = this.getSelectedMedia();

    return media.get('crops').find(c => c.get('id') === id);
  },

  onFetchImagesSuccess: function(payload) {
    var req = payload.request;
    var media = Immutable.fromJS(payload.data);

    var requests = this.state.get('fetchRequests');
    var key = requests.findKey((v, k) => v === req);
    requests = requests.delete(key);

    this.state = this.state.withMutations(function(state) {
      state.set('media', media).set('fetchRequests', requests);
    });
    this.emit('change');    
  },

  onMediaSelect: function(payload) {
    this.state = this.state.withMutations(function(state) {
      state.set('selectedMedia', payload.media.get('id')).set('selectedCrop', null);
    });
    this.emit('change');
  },

  onCropSelect: function(payload) {
    this.state = this.state.set('selectedCrop', payload.crop.get('id'));
    this.emit('change');    
  },

  onCropDeselect: function(payload) {
    this.state = this.state.set('selectedCrop', null);
    this.emit('change');    
  },

  getCropOverflow: function(crop, media, values) {
    var x1 = values.x1 < 0 ? -values.x1 / (media.get('width') - values.x1) : 0;
    var y1 = values.y1 < 0 ? -values.y1 / (media.get('height') - values.y1): 0;
    var x2 = values.x2 > media.get('width') ? (values.x2 - media.get('width')) / values.x2 : 0;
    var y2 = values.y2 > media.get('height') ? (values.y2 - media.get('height')) / values.y2 : 0

    return {x1, y1, x2, y2, reverseScale: 1 - Math.max(x1 + x2, y1 + y2)};
  },

  onCropResize: function(payload) {
    // For when we're moving one of the corner handles
    var crop = payload.crop;
    var media = this.getSelectedMedia();
    var cropIndex = media.get('crops').indexOf(crop);
    var mediaIndex = this.state.get('media').indexOf(media);

    var cropData = crop.toJS();

    var width = media.get('width');
    var height = media.get('height');

    var cropWidth = cropData.x2 - cropData.x1;
    var cropHeight = cropData.y2 - cropData.y1;

    var dX = payload.dX;
    var dY = payload.dY;

    var scale;

    // What point do we anchor around, and how should we multiply the X and Y deltas;
    var anchor = {
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

    var overflow = this.getCropOverflow(crop, media, transformedData);

    console.log(overflow);

    if (overflow.reverseScale !== 1) {
      x = (transformedData[anchor[0][0]] + transformedData[anchor[0][1]]) / 2;
      y = (transformedData[anchor[1][0]] + transformedData[anchor[1][1]]) / 2;
      transformedData = scaleCoordinates(transformedData, overflow.reverseScale, x, y);
    }

    this.updateCrop(['media', mediaIndex, 'crops', cropIndex], crop, media, transformedData);
  },

  onCropMove: function(payload) {
    var crop = payload.crop;
    var media = this.getSelectedMedia();
    var cropIndex = media.get('crops').indexOf(crop);
    var mediaIndex = this.state.get('media').indexOf(media);
    var transformedData = translateCoordinates(crop.toJS(), scale, payload.dX, payload.dY);
    this.updateCrop(['media', mediaIndex, 'crops', cropIndex], crop, media, transformedData);
  },

  updateCrop: function(path, crop, media, data) {
    var values = {
      x1: Math.round(data.x1),
      x2: Math.round(data.x2),
      y1: Math.round(data.y1),
      y2: Math.round(data.y2)
    };

    this.state = this.state.updateIn(path, function(crop) {
      for (var k in values) {
        crop = crop.set(k, Math.round(values[k]));
      }
      return crop;
    }); 
    this.emit('change');
  },

  onCategorySelect: function(payload) {
    if (payload.category.get('accepts_images')) {
      var req = this.getFetchRequest(payload.category, null);

      var requests = this.state.get('fetchRequests');

      if (!requests) {
        requests = Immutable.Map();
      }
      requests = requests.set(payload.category.get('path'), req);

      this.state = this.state.withMutations(function(state) {
        state.set('media', Immutable.Sequence()).set('fetchRequests', requests);
      });
    } else {
      this.state = this.state.set('media', Immutable.Sequence());
    }
    
    this.emit('change');
  }  
});

module.exports = MediaStore;