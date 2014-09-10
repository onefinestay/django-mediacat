/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var FluxMixin = require('./flux-mixin');

var DragLayer = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Dragging")],

  getStateFromFlux: function() {
    var store = this.getFlux().store('Dragging')
    return {
      dragging: store.state.get('dragging'),
      draggingMedia: store.state.get('draggingMedia'),
      top: store.state.get('top') - 25,
      left: store.state.get('left') - 25,
    };
  },



  render: function() {
    if (!this.state.dragging) {
      return null;
    }

    var position = {
      top: this.state.top,
      left: this.state.left,
    }
    return (
      <div className="mediacat-drag-placeholder" style={position}></div>
    );
  }
});

module.exports = DragLayer;
