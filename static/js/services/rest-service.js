var request = require('superagent');

var bluebird = require('../utils/superagent-bluebird');
var django = require('../utils/superagent-django');

class RestService {
  constructor(options) {
    this.options = Object.freeze(options || {});
  }

  get(query) {
    var root = this.options.root;
    var resource = this.options.resource;
    var url = `${root}/${resource}/`;

    return request
      .get(url)
      .use(django)
      .use(bluebird)
      .query(query)
      .set('Accept', 'application/json')
      .promise();
  }

  getOne(id) {
    var root = this.options.root;
    var resource = this.options.resource;
    var url = `${root}/${resource}/${id}/`;

    return request
      .get(url)
      .use(django)
      .use(bluebird)      
      .set('Accept', 'application/json')
      .promise();
  }

  create(data) {
    var root = this.options.root;
    var resource = this.options.resource;
    var url = `${root}/${resource}/`;

    return request
      .post(url)
      .use(django)
      .use(bluebird)      
      .send(data)
      .set('Accept', 'application/json')
      .promise();
  }

  update(id, data) {
    var root = this.options.root;
    var resource = this.options.resource;
    var url = `${root}/${resource}/${id}/`;

    return request
      .put(url)
      .use(django)
      .use(bluebird)      
      .send(data)
      .set('Accept', 'application/json')
      .promise();
  }

  patch(id, data) {
    var root = this.options.root;
    var resource = this.options.resource;
    var url = `${root}/${resource}/${id}/`;

    return request
      .patch(url)
      .use(django)
      .use(bluebird)      
      .send(data)
      .set('Accept', 'application/json')
      .promise();
  }

  patchMany(data) {
    var root = this.options.root;
    var resource = this.options.resource;
    var url = `${root}/${resource}/`;

    return request
      .patch(url)
      .use(django)
      .use(bluebird)      
      .send(data)
      .set('Accept', 'application/json')
      .promise();    
  }
}

module.exports = RestService;