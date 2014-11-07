var RestService = require('./rest-service');

var request = require('superagent');
var promise = require('../utils/superagent-promise');
var django = require('../utils/superagent-django');


class MediaService extends RestService {

  upload(file, category, onProgress, onTransferComplete) {
    var root = this.options.root;
    var resource = this.options.resource;
    var url = `${root}/${resource}/`;

    var content_type = null;
    var object_id = null;

    if (category) {
      content_type = category.get('content_type_id');
      object_id = category.get('object_id');
    }

    var req = request
      .post(url)
      .use(django)
      .use(promise)
      .field('image_file', file);

    if (content_type && object_id) {
      req = req
        .field('associated_content_type', content_type)
        .field('associated_object_id', object_id);
    }
    return req.promise(onProgress, onTransferComplete);
  }
}

module.exports = MediaService;