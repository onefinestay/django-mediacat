var RestService = require('./rest-service');

var request = require('superagent');
var bluebird = require('../utils/superagent-bluebird');
var django = require('../utils/superagent-django');

class CropService extends RestService {

	pick(id, previewWidth) {
    var root = this.options.root;
    var resource = this.options.resource;
    var url = `${root}/${resource}/${id}/pick/${previewWidth}/`;

    return request
      .get(url)
	    .use(django)
	    .use(bluebird)      
      .set('Accept', 'application/json')
      .promise();
	}
}

module.exports = CropService;