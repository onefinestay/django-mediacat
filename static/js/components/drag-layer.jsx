var React = require('react/addons');
var Immutable = require('immutable');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var List = require('./common/list');
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

    var thumbnail = this.state.draggingMedia;
    var thumbnails = Immutable.List([<Thumbnail key={thumbnail.get('id')} isDragging={true} thumbnail={thumbnail} />]);

    return (
      <div className="mediacat-thumbnails mediacat-thumbnails--is-dragging" style={style}>
        <List>
        {thumbnails.toJS()}
        </List>
      </div>
    );
  }
});

module.exports = DragLayer;