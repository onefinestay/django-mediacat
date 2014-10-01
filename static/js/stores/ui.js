 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');
var uuid = require('uuid-v4');


var UIStore = Fluxxor.createStore({
  actions: {

  },

  initialize: function(options) {
    this.setMaxListeners(0);
    this.state = Immutable.fromJS(options);
  }
});

module.exports = UIStore;
