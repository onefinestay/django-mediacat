/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var FluxMixin = require('./flux-mixin');
var ProxyImg = require('./proxy-img');


var Thumbnail = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media")],

  select: function(event) {
    event.preventDefault();
    this.getFlux().actions.media.select(this.props.thumbnail);
  },

  handleDoubleClick: function(event) {
    event.preventDefault();
    this.getFlux().actions.media.select(this.props.thumbnail);
    this.getFlux().actions.media.setViewMode('detail');
  },

  getStateFromFlux: function() {
    var store = this.getFlux().store('Media');
    var selected = store.getSelectedMedia();

    return {
      selected: selected && this.props.thumbnail.get('id') === selected.get('id')
    };
  },

  grab: function(event) {
    this.getFlux().actions.dragging.grab(this.props.thumbnail, event.pageX, event.pageY);
  },

  drop: function(event) {
    this.getFlux().actions.dragging.drop(this.props.thumbnail, event.pageX, event.pageY);
  },

  render: function() {
    var thumbnail = this.props.thumbnail;

    var classes = {
      'mediacat-thumbnail': true,
      'mediacat-thumbnail-selected': this.state.selected
    };

    return (
      <li className={cx(classes)} onClick={this.select} onDoubleClick={this.handleDoubleClick} onMouseDown={this.grab} onMouseUp={this.drop}>
        <ProxyImg src={thumbnail.get('thumbnail')} width={thumbnail.get('width')} height={thumbnail.get('height')} maxWidth={160} maxHeight={160} draggable={false} />
      </li>
    );
  }
});

module.exports = Thumbnail;