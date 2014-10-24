var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var FluxMixin = require('./mixins/flux-mixin');
var Thumbnail = require('./thumbnail');

var DragLayer = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Dragging")],

  getStateFromFlux: function() {
    var store = this.getFlux().store('Dragging');

    return {
      draggingMedia: store.state.get('draggingMedia'),
      top: store.state.get('top') - 100,
      left: store.state.get('left') - 100
    };
  },

  render: function() {
    if (!this.state.draggingMedia) {
      return null;
    }

    var style = {
      top: this.state.top,
      left: this.state.left
    };

    return (
      <ul className="mediacat-list mediacat-list--is-dragging mediacat-list--thumbnails" style={style}>
        <li className="mediacat-list__item mediacat-list__item--thumbnail">
          <Thumbnail dragging={true} thumbnail={this.state.draggingMedia} />
        </li>
      </ul>
    );
  }
});

module.exports = DragLayer;
