var RestService = require('./rest-service');

var request = require('superagent');
var promise = require('../utils/superagent-promise');
var django = require('../utils/superagent-django');

class CropService extends RestService {

  pick(id, previewWidth) {
    var root = this.options.root;
    var resource = this.options.resource;
    var url = `${root}/${resource}/${id}/pick/${previewWidth}/`;

    return request
      .get(url)
      .use(django)
      .use(promise)
      .set('Accept', 'application/json')
      .promise();
  }
}

module.exports = CropService;