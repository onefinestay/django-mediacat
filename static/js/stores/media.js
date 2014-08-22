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
      state.set('selectedMedia', payload.media).set('selectedCrop', null);
    });
    this.emit('change');
  },

  onCropSelect: function(payload) {
    this.state = this.state.set('selectedCrop', payload.crop);
    this.emit('change');    
  },

  onCropDeselect: function(payload) {
    this.state = this.state.set('selectedCrop', null);
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