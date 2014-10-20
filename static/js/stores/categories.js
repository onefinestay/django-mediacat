 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');

var constants = require('../constants');


var CategoryStore = Fluxxor.createStore({
  initialize: function(options) {
    this.bindActions(
      constants.CATEGORY_SELECTED, this.onCategorySelect,
      constants.CATEGORY_OPEN, this.onCategoryOpen,
      constants.CATEGORY_CLOSE, this.onCategoryClose,
      constants.CATEGORY_GET_START, this.onCategoryGetStart,
      constants.CATEGORY_GET_SUCCESS, this.onCategoryGetSuccess,
      constants.ASSOCIATIONS_CREATE_SUCCESS, this.onAssociationsCreateSuccess
    );
    this.setMaxListeners(0);
    this.state = Immutable.fromJS(options);
  },  

  findByPath: function(path) {
    var match;

    function checkForPath(cat) {
      var childMatch;
      if (cat.get('path') === path) {
        return cat;
      } else if (cat.get('children')) {
        cat.get('children').forEach(function(obj){
          childMatch = checkForPath(obj);
          if (childMatch) {
            return false;
          }
        });
      }
      return childMatch;
    }

    var match;
    this.state.get('categories').forEach(function(obj) {
      match = checkForPath(obj);
      if (match) {
        return false;
      }
    });
    return match;
  },

  getObjectPath: function(stringPath) {
    var result = Immutable.fromJS(['categories']);

    function checkForPath(category, subPath) {
      var result;
      var children = category.get('children');

      if (children) {
        children.forEach(function(category, i) {
          if (category.get('path') === stringPath) {
            result = subPath.push(i);
            return false;
          }
          var subResult = checkForPath(category, subPath.push(i, 'children'));

          if (subResult) {
            result = subResult;
            return false;
          }
        });
      }
      return result;
    }

    this.state.get('categories').forEach(function(category, i) {
      if (category.get('path') === stringPath) {
        result = result.push(i);
        return false;
      }
      var subResult = checkForPath(category, result.push(i, 'children'));

      if (subResult) {
        result = subResult;
        return false;
      }
    });

    return result;
  },

  onCategorySelect: function(payload) {
    this.state = this.state.set('selectedPath', payload.category.get('path'));
    var urlPath = this.state.get('basePath') + this.state.get('selectedPath') + '/';
    window.history.replaceState(null, '', urlPath);
    this.emit('change');
  },

  onCategoryOpen: function(payload) {
    var updatePath = this.getObjectPath(payload.category.get('path'));
    this.state = this.state.updateIn(updatePath.toJS(), cat => cat.set('expanded', true));
    this.emit('change');
  },

  onCategoryClose: function(payload) {
    var updatePath = this.getObjectPath(payload.category.get('path'));
    this.state = this.state.updateIn(updatePath.toJS(), cat => cat.set('expanded', false));
    this.emit('change');
  },

  onUploadComplete: function(payload) {
    // Increment category count
    if (payload.categoryPath) {
      var updatePath = this.getObjectPath(payload.categoryPath);
      this.state = this.state.updateIn(updatePath.toJS(), cat => cat.set('count', cat.get('count') + 1));
      this.emit('change');
    }
  },

  getSelectedCategory: function() {
    var path = this.state.get('selectedPath');

    if (!path) {
      return null;
    }
    return this.state.getIn(this.getObjectPath(path).toJS());
  },

  onCategoryGetSuccess: function(payload) {
    if (payload.data && payload.data.length > 0) {
      var parentPath = payload.data[0].path.split('/').slice(0, -1).join('/');
      var children = Immutable.fromJS(payload.data);
      var updatePath = this.getObjectPath(parentPath);
      this.state = this.state.updateIn(updatePath.toJS(), parent => parent.set('children', children));
      this.emit('change');
    }
  },

  onCategoryGetStart: function(payload) {
    var request = payload.request;
    var requests = this.state.get('fetchRequests');

    if (!requests) {
      requests = Immutable.Map();
    }
    requests = requests.set(payload.category.get('path'), request);
    this.state = this.state.set('fetchRequests', requests);
    this.emit('change');
  },

  onAssociationsCreateSuccess: function(payload) {
    // Increment category count
    if (payload.categoryPath) {
      var updatePath = this.getObjectPath(payload.categoryPath);
      this.state = this.state.updateIn(updatePath.toJS(), cat => cat.set('count', cat.get('count') + 1));
      this.emit('change');
    }
  },

});

module.exports = CategoryStore;
