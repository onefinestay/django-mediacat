var Promise = require("bluebird");

module.exports = function(request) {
	request.promise = function() {
    return new Promise(function(resolve, reject) {
      request.end(function(err, res) {
        if (err && reject) {
        	reject(err);
        } else if (resolve) {
        	resolve(res);
        }
      });
    });
  };
	return request;
};