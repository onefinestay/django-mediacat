 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');

var CategoryStore = Fluxxor.createStore({
  actions: {
    CATEGORY_SELECTED: 'onCategorySelect'
  },

  initialize: function(options) {
    this.setMaxListeners(0);
    var selectedPath = options.selectedPath;
    delete options.selectedPath;

    this.state = Immutable.fromJS(options);

    function checkForPath(cat) {
      var childMatch;
      if (cat.get('path') === selectedPath) {
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

    if (match) {
      this.state = this.state.set('selectedCategory', match);
    }

  },

  onCategorySelect: function(payload) {
    this.state = this.state.set('selectedCategory', payload.category);
    this.emit('change');
  }
});

module.exports = CategoryStore;
