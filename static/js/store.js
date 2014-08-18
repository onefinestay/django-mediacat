 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');

var LibraryStore = Fluxxor.createStore({
  actions: {
  },

  initialize: function(options) {
    this.setMaxListeners(0);
    this.state = Immutable.fromJS(options);
  },

  getCursor: function() {
    return this.state.cursor([], (newData) => {
      this.state = newState
      this.emit('change');
    });
  }
});

module.exports = LibraryStore;