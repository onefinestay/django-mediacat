 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');
var request = require('superagent');
var uuid = require('uuid-v4');

var django = require('../utils/superagent-django');


var UploadStore = Fluxxor.createStore({
  actions: {
    UPLOAD_ADD: 'onUploadAdd',
    UPLOAD_PROGRESS: 'onUploadProgress',
    UPLOAD_LOAD: 'onUploadLoad',
    UPLOAD_COMPLETE: 'onUploadComplete'
  },

  initialize: function(options) {
    this.setMaxListeners(0);
    this.state = Immutable.fromJS(options);
  },

  getUploadRequest: function(id, file, category) {
    var content_type = null;
    var object_id = null;
    var categoryPath = null;

    if (category) {
      categoryPath = category.get('path');
      content_type = category.get('content_type_id');
      object_id = category.get('object_id');
    }

    var onProgress = function(event) {
      this.flux.actions.uploads.progress(event, id, file, categoryPath);
    }.bind(this);

    var onLoad = function(event) {
      this.flux.actions.uploads.load(event, id, file, categoryPath);
    }.bind(this);

    var onComplete = function(response) {
      this.flux.actions.uploads.complete(response, id, file, categoryPath);
    }.bind(this);

    var req = request.post('/mediacat/images/').use(django);

    if (content_type && object_id) {
      req = req
        .field('associated_content_type', content_type)
        .field('associated_object_id', object_id);
    }

    req = req
      .field('image_file', file)
      .end(onComplete);

    req.xhr.upload.addEventListener("progress", onProgress, false);
    req.xhr.addEventListener("load", onLoad, false);
    return req;
  },  

  onUploadAdd: function(payload) {
    payload.id = uuid();
    payload.progress = 0;
    payload.complete = false;
    payload.request = this.getUploadRequest(payload.id, payload.file, payload.category);
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

  onUploadLoad: function(payload) {
    var index = this.state.get('uploads').findIndex(upload => upload.get('id') === payload.id);
    this.state = this.state.updateIn(['uploads', index], upload => upload.set('progress', 100));
    this.emit('change');
  },

  onUploadComplete: function(payload) {
    var index = this.state.get('uploads').findIndex(upload => upload.get('id') === payload.id);
    this.state = this.state.updateIn(['uploads', index], upload => upload.set('complete', true));
    this.emit('change');
  }  
});

module.exports = UploadStore;
