 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');


var DraggingStore = Fluxxor.createStore({
  actions: {
    GRAB_MEDIA: 'onGrabMedia',
    DRAG_MEDIA: 'onDragMedia',
    DROP_MEDIA: 'onDropMedia',
    HOVER_OVER: 'onHoverOver',
    HOVER_OFF: 'onHoverOff'
  },

  initialize: function(options) {
    this.state = Immutable.fromJS(options);
  },

  onGrabMedia: function(event) {
    console.log("stores/dragging:onGrabMedia", event);
    var dragBuffer = setTimeout(function() {
      this.startDrag(event);
    }.bind(this), this.state.get('dragTimeout'));
    this.state = this.state.set('dragBuffer', dragBuffer);
    this.state = this.state.set('draggingMedia', event.media);
    document.addEventListener('mousemove', this.onDragMedia);
    document.addEventListener('mouseup', this.onDropMedia);
  },

  startDrag: function(event) {
    console.log("stores/dragging:startDrag", event);

    this.state = this.state.set('dragBuffer', null);
    this.state = this.state.set('dragging', true);
    if (!this.state.get('top')) {
      this.state = this.state.set('top', event.y);
    }
    if (!this.state.get('left')) {
      this.state = this.state.set('left', event.x);
    }
    this.emit('change');
  },

  onDragMedia: function(event) {
    if (!(this.state.get('dragging') || this.state.get('dragBuffer'))) {
      return;
    }

    if (this.state.get('dragBuffer')) {
      clearTimeout(this.state.get('dragBuffer'));
      this.state = this.state.set('dragBuffer', null);
      this.startDrag(event);
      return;
    }

    this.state = this.state.set('top', event.clientY);
    this.state = this.state.set('left', event.clientX);
    this.emit('change');
  },

  onDropMedia: function(event) {

    document.removeEventListener('mousemove', this.onDragMedia);
    document.removeEventListener('mouseup', this.onDropMedia);

    if (this.state.get('dragBuffer')) {
      console.log('clearing timeout');
      clearTimeout(this.state.get('dragBuffer'));
      this.state = this.state.set('dragBuffer', null);
      return;
    }

    console.log("stores/dragging:onDropMedia", event);
    this.state = this.state.set('dragging', false);
    this.state = this.state.set('draggingMedia', null);
    this.state = this.state.set('top', null);
    this.state = this.state.set('left', null);
    this.emit('change');
  },

  getDraggedMedia: function() {
    return this.state.get('draggingMedia');
  }
});


module.exports = DraggingStore;
