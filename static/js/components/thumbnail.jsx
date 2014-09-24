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

  getInitialState: function() {
    return {
      dragOverPosition: null
    };
  },

  select: function(event) {
    event.preventDefault();
    this.getFlux().actions.media.select(this.props.thumbnail);
  },

  handleDoubleClick: function(event) {
    event.preventDefault();
    this.getFlux().actions.media.select(this.props.thumbnail);
    this.getFlux().actions.media.setViewMode('detail');
  },

  handleMouseEnter: function(event) {
    var draggedMedia = this.getFlux().stores.Dragging.getDraggedMedia();
    if (draggedMedia && draggedMedia !== this.props.thumbnail) {
      console.log('dragging over me!');
    }
  },

  handleMouseLeave: function(event) {
    var draggedMedia = this.getFlux().stores.Dragging.getDraggedMedia();
    if (draggedMedia && draggedMedia !== this.props.thumbnail) {
      this.setState({dragOverPosition: null});
    }    
  },

  handleMouseMove: function(event) {
    var elRect;
    var offsetX;
    var offsetY;

    var draggedMedia = this.getFlux().stores.Dragging.getDraggedMedia();
    if (draggedMedia && draggedMedia !== this.props.thumbnail) {
      elRect = this.getDOMNode().getBoundingClientRect();
      offsetX = event.clientX - elRect.left;
      offsetY = event.clientY - elRect.top;
     
      if (offsetX <= (elRect.width / 2)) {
        this.setState({dragOverPosition: 'before'});
      } else {
        this.setState({dragOverPosition: 'after'});
      }
    }
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
      <li 
        className={cx(classes)} 
        onClick={this.select} 
        onDoubleClick={this.handleDoubleClick} 
        onMouseDown={this.grab} 
        onMouseUp={this.drop} 
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave} 
        onMouseMove={this.handleMouseMove}>
        {this.state.dragOverPosition && this.state.dragOverPosition === 'before' ? <div className="dragover-guide dragover-guide-before" /> : null}
        <ProxyImg src={thumbnail.get('thumbnail')} width={thumbnail.get('width')} height={thumbnail.get('height')} maxWidth={160} maxHeight={160} draggable={false} />
        {this.state.dragOverPosition && this.state.dragOverPosition === 'after' ? <div className="dragover-guide dragover-guide-after" /> : null}
      </li>
    );
  }
});

module.exports = Thumbnail;