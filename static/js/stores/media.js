 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');
var request = require('superagent');

var Constants = require('../constants');

var MediaStore = Fluxxor.createStore({
  actions: {
    CATEGORY_SELECTED: 'onCategorySelect',
    MEDIA_SELECTED: 'onMediaSelect',
    FETCH_IMAGES_SUCCESS: 'onFetchImagesSuccess',
    UPLOAD_COMPLETE: 'onUploadComplete'
  },

  initialize: function(options) {
    this.setMaxListeners(0);
    this.state = Immutable.fromJS(options);
  },

  getFetchRequest: function(category, filters) {
    var categoryPath = null;
    var content_type_id = null;
    var object_id = null;

    if (category) {
      categoryPath = category.get('path');
      content_type_id = category.get('content_type_id');
      object_id = category.get('object_id');
    }

    var query = {
      content_type_id: content_type_id,
      object_id: object_id,
    };

    var onSuccess = function(response) {
      this.flux.actions.media.fetchSuccess(response, categoryPath);
    }.bind(this);

    return request
      .get('/mediacat/images/')
      .query(query)
      .set('Accept', 'application/json')
      .on('error', this.flux.actions.media.fetchError)
      .end(onSuccess);
  },

  getSelectedMedia: function() {
    var id = this.state.get('selectedMedia');

    if (!id) {
      return null;
    }
    return this.state.get('media').find(m => m.get('id') === id);
  },

  onFetchImagesSuccess: function(payload) {
    var categoryPath = payload.categoryPath;

    var req = payload.request;
    var media = Immutable.fromJS(payload.data);

    var requests = this.state.get('fetchRequests');
    var key = requests.findKey((v, k) => v === req);
    requests = requests.delete(key);    
    this.state = this.state.set('fetchRequests', requests);

    if (payload.categoryPath === this.flux.stores['Categories'].state.get('selectedPath')) {
      this.state = this.state.set('media', media);
    }
    this.emit('change');
  },

  onMediaSelect: function(payload) {
    this.state = this.state.withMutations(function(state) {
      state.set('selectedMedia', payload.media.get('id')).set('selectedCrop', null);
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
        state
          .set('media', Immutable.Sequence())
          .set('fetchRequests', requests);
      });
    } else {
      this.state = this.state.set('media', Immutable.Sequence());
    }

    this.state = this.state.set('selectedMedia', null);
    this.state = this.state.set('selectedCrop', null);    
    
    this.emit('change');
  },

  onUploadComplete: function(payload) {
    var categoryPath = payload.categoryPath;
    var newImage;

    if (payload.categoryPath === this.flux.stores['Categories'].state.get('selectedPath')) {
      newImage = Immutable.fromJS(payload.response.body);
      this.state = this.state.updateIn(['media'], media => media.push(newImage));
      this.emit('change');
    }
  }
});

module.exports = MediaStore;