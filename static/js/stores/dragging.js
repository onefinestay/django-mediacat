 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');


var DraggingStore = Fluxxor.createStore({
  actions: {
    DRAG_MEDIA_START: 'onDragMediaStart',
    DRAG_MEDIA_MOVE: 'onDragMediaMove',
    DRAG_MEDIA_END: 'onDragMediaStartEnd'
  },

  initialize: function(options) {
    this.setMaxListeners(0);    
    this.state = Immutable.fromJS(options);
  },

  onDragMediaStart: function(payload) {
    this.state = this.state.set('draggingMedia', payload.media);
  },

  onDragMediaMove: function(payload) {
    this.state = this.state.withMutations(function(state) {
      state.set('top', payload.y).set('left', payload.x);
    });
    this.emit('change');
  },

  onDragMediaStartEnd: function(event) {
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
