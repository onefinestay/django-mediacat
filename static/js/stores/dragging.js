 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');

var constants = require('../constants');


var DraggingStore = Fluxxor.createStore({
  initialize: function(options) {
    this.bindActions(
      constants.DRAG_MEDIA_START, this.onDragMediaStart,
      constants.DRAG_MEDIA_MOVE, this.onDragMediaMove,
      constants.DRAG_MEDIA_END, this.onDragMediaStartEnd 
    );

    this.setMaxListeners(0);    
    this.state = Immutable.fromJS(options);
  },

  onDragMediaStart: function(payload) {
    this.state = this.state.withMutations(function(state) {
      state.set('top', payload.y).set('left', payload.x).set('draggingMedia', payload.media);
    });
    this.emit('change');
  },

  onDragMediaMove: function(payload) {
    this.state = this.state.withMutations(function(state) {
      state.set('top', payload.y).set('left', payload.x);
    });
    this.emit('change');
  },

  onDragMediaStartEnd: function() {
    this.state = this.state.withMutations(function(state) {
      state.set('draggingMedia', null).set('top', null).set('left', null);
    });    
    this.emit('change');
  },

  getDraggedMedia: function() {
    return this.state.get('draggingMedia');
  }
});


module.exports = DraggingStore;
