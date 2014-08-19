 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');
var request = require('superagent');

var Constants = require('../constants');

var MediaStore = Fluxxor.createStore({
  actions: {
    CATEGORY_SELECTED: 'onCategorySelect',
    FETCH_IMAGES_SUCCESS: 'onFetchImagesSuccess'
  },

  initialize: function(options) {
    this.setMaxListeners(0);
    this.state = Immutable.fromJS(options);
  },

  getFetchRequest: function(category, filters) {
    return request
      .get('/mediacat/images/')
      .query({category: 1})
      .on('error', this.flux.actions.media.fetchError)
      .end(this.flux.actions.media.fetchSuccess);
    this.state.set('request', req);
    this.emit('change');
  },

  onFetchImagesSuccess: function(payload) {
    console.log(payload);
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