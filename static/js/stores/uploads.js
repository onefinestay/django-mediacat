 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');
var request = require('superagent');
var uuid = require('uuid-v4');

var django = require('../utils/superagent-django');


var UploadStore = Fluxxor.createStore({
  actions: {
    UPLOAD_ADD: 'onUploadAdd'
  },

  initialize: function(options) {
    this.setMaxListeners(0);
    this.state = Immutable.fromJS(options);
  },

  getUploadRequest: function(file, category) {
    var content_type = null;
    var object_id = null;

    if (category) {
      content_type = category.get('content_type_id');
      object_id = category.get('object_id');
    }

    return request.post('/mediacat/images/')
      .use(django)
      .field('associated_content_type', content_type)
      .field('associated_object_id', object_id)
      .field('image_file', file)
      .end(function(response) {
        console.log(response);
      });
  },  

  onUploadAdd: function(payload) {
    payload.id = uuid();
    payload.request = this.getUploadRequest(payload.file, payload.category);
    this.state = this.state.updateIn(['uploads'], uploads => uploads.push(Immutable.fromJS(payload)));
    this.emit('change');
  }
});

module.exports = UploadStore;
