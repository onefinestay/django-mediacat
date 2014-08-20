 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');
var request = require('superagent');

var Constants = require('../constants');

var MediaStore = Fluxxor.createStore({
  actions: {
    CATEGORY_SELECTED: 'onCategorySelect',
    MEDIA_SELECTED: 'onMediaSelect',
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
    this.state = this.state.set('request', req);
    this.emit('change');
  },

  onFetchImagesSuccess: function(payload) {
    var media = Immutable.fromJS(payload.data);

    this.state = this.state.set('media', media);
    this.emit('change');
  },

  onMediaSelect: function(payload) {
    this.state = this.state.set('selectedMedia', payload.media);
    this.emit('change');
  },

  onCategorySelect: function(payload) {
    var req = this.getFetchRequest(payload.category, null);

    this.state = this.state.withMutations(function(state) {
      state['media'] = [];
      state['request'] = req;
    });
    this.emit('change');
  }  
});

module.exports = MediaStore;