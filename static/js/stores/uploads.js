 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');
var constants = require('../constants');


var UploadStore = Fluxxor.createStore({
  initialize: function(options) {
    this.bindActions(
      constants.UPLOAD_START, this.onUploadStart,
      constants.UPLOAD_PROGRESS, this.onUploadProgress,
      constants.UPLOAD_TRANSFER_COMPLETE, this.onUploadTransferComplete,    
      constants.UPLOAD_SUCCESS, this.onUploadSuccess   
    );    
    this.setMaxListeners(0);
    this.state = Immutable.fromJS(options);
  },

  onUploadStart: function(payload) {
    this.state = this.state.updateIn(['uploads'], uploads => uploads.push(Immutable.fromJS(payload)));
    this.emit('change');
  },

  onUploadProgress: function(payload) {
    var index = this.state.get('uploads').findIndex(upload => upload.get('id') === payload.id);
    var event = payload.event;
    var progress = Math.round(event.loaded * 100 / event.total);
    this.state = this.state.updateIn(['uploads', index], upload => upload.set('progress', progress));
    this.emit('change');
  },

  onUploadTransferComplete: function(payload) {
    var index = this.state.get('uploads').findIndex(upload => upload.get('id') === payload.id);
    this.state = this.state.updateIn(['uploads', index], upload => upload.set('progress', 100));
    this.emit('change');
  },

  onUploadSuccess: function(payload) {
    var index = this.state.get('uploads').findIndex(upload => upload.get('id') === payload.id);
    this.state = this.state.updateIn(['uploads', index], upload => upload.set('complete', true));
    this.emit('change');
  }  
});

module.exports = UploadStore;
