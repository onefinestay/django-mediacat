 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');

var CategoryStore = Fluxxor.createStore({
  actions: {
    CATEGORY_SELECTED: 'onCategorySelect'
  },

  initialize: function(options) {
    this.setMaxListeners(0);
    this.state = Immutable.fromJS(options);
  },

  onCategorySelect: function(payload) {
    this.state = this.state.set('selectedCategory', payload.category);
    this.emit('change');
  }  
});

module.exports = CategoryStore;