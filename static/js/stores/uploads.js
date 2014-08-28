 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');
var request = require('superagent');
var uuid = require('uuid-v4');

var UploadStore = Fluxxor.createStore({
  actions: {
    UPLOAD_ADD: 'onUploadAdd'
  },

  initialize: function(options) {
    this.setMaxListeners(0);
    this.state = Immutable.fromJS(options);
  },

  onUploadAdd: function(payload) {
    payload.id = uuid();
    this.state = this.state.updateIn(['uploads'], uploads => uploads.push(Immutable.fromJS(payload)));
    this.emit('change');
  }
});

module.exports = UploadStore;
