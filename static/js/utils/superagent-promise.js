module.exports = function(request) {
	request.promise = function(onProgress, onTransferComplete) {
    return new Promise(function(resolve, reject) {
      request.end(function(err, res) {
        if (err && reject) {
        	reject(err);
        } else if (resolve) {
        	resolve(res);
        }
      });
      if (onProgress) {
    		request.xhr.upload.addEventListener("progress", onProgress, false);
      }
      if (onTransferComplete) {
      	request.xhr.addEventListener("load", onTransferComplete, false);
      }
    });
  };
	return request;
};