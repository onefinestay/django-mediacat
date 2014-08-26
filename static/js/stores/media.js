 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');
var request = require('superagent');

var Constants = require('../constants');

var MediaStore = Fluxxor.createStore({
  actions: {
    CATEGORY_SELECTED: 'onCategorySelect',
    MEDIA_SELECTED: 'onMediaSelect',
    CROP_SELECTED: 'onCropSelect',
    CROP_DESELECTED: 'onCropDeselect',
    CROP_MOVE: 'onCropMove',
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

  onCropMove: function(payload) {
    var crop = this.getSelectedCrop();
    var media = this.getSelectedMedia();
    var cropIndex = media.get('crops').indexOf(crop);
    var mediaIndex = this.state.get('media').indexOf(media);

    var x1 = crop.get('x1');
    var x2 = crop.get('x2');
    var y1 = crop.get('y1');
    var y2 = crop.get('y2');

    var dX = payload.dX;
    var dY = payload.dY;

    if (x1 + dX < 0) {
      dX = -x1;
    } else if (x2 + dX > media.get('width')) {
      dX = media.get('width') - x2;
    }

    if (y1 + dY < 0) {
      dY = -y1;
    } else if (y2 + dY > media.get('height')) {
      dY = media.get('height') - y2;
    }    

    this.state = this.state.updateIn(['media', mediaIndex, 'crops', cropIndex], function(c) {
      return c.withMutations(function(c) {
        c.
          set('x1', x1 + dX).
          set('x2', x2 + dX).
          set('y1', y1 + dY).
          set('y2', y2 + dY);
      });
    })
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