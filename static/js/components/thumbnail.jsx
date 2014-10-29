var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('./bem-cx');
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var FluxMixin = require('./mixins/flux-mixin');
var ProxyImg = require('./proxy-img');
var Rating = require('./rating');

var Thumbnail = React.createClass({
  mixins: [PureRenderMixin, FluxMixin],

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
    var sortable = this.getFlux().store('Media').state.get('sortBy') === 'manual_asc';

    if (sortable && this.props.userIsDragging && !this.props.dragging) {
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

  handleMouseLeave: function(event) {
    this.setState({dragOverPosition: null});
  },

  handleMouseMove: function(event) {
    var elRect;
    var offsetX;
    var offsetY;

    var sortable = this.getFlux().store('Media').state.get('sortBy') === 'manual_asc';

    if (sortable && this.props.userIsDragging && !this.props.dragging) {
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

  handleMouseDown: function(event) {
    document.addEventListener('mousemove', this.dragMove);
    document.addEventListener('mouseup', this.dragEnd);
    this.getFlux().actions.dragging.dragStart(this.props.thumbnail, event.pageX, event.pageY);
  },

  handleMouseUp: function() {
    var draggingMedia = this.getFlux().store('Dragging').state.get('draggingMedia');
    var sortable = this.getFlux().store('Media').state.get('sortBy') === 'manual_asc';
    var position = this.state.dragOverPosition;

    if (sortable && this.props.userIsDragging && !this.props.dragging && position) {
      if (position === 'before') {
        this.getFlux().actions.media.moveBefore(draggingMedia, this.props.thumbnail);  
      } else {
        this.getFlux().actions.media.moveAfter(draggingMedia, this.props.thumbnail);  
      }
    }
  },  

  dragMove: function(event) {
    event.preventDefault();
    this.getFlux().actions.dragging.dragMove(event.pageX, event.pageY);
  },

  dragEnd: function(event) {
    event.preventDefault();
    document.removeEventListener('mousemove', this.dragMove);
    document.removeEventListener('mouseup', this.dragEnd);

    this.getFlux().actions.dragging.dragEnd(event.pageX, event.pageY);

    this.setState({
      dragOverPosition: null
    });
  },

  render: function() {
    var thumbnail = this.props.thumbnail;

    var classes = {
      'thumbnail': true,
      'thumbnail--rejected': thumbnail.get('rating') === 0
    };

    var states = {
      'dragging': this.props.isDragging,
      'selected': this.props.selected
    };

    var contentStyle;
    var thumbnailSize = 160;

    if (this.props.size) {
      contentStyle = {
        width: this.props.size,
        height: this.props.size
      };
      thumbnailSize = this.props.size - 22;
    }

    return (
      <div
        className={cx(classes, {states})}
        onClick={this.select} 
        onDoubleClick={this.handleDoubleClick} 
        onMouseDown={this.handleMouseDown} 
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}>
        {this.state.dragOverPosition && this.state.dragOverPosition === 'before' ? <div className="mediacat-thumbnail__dragover mediacat-thumbnail__dragover--before" /> : null}
        <div style={contentStyle} className="mediacat-thumbnail__content">
          <ProxyImg
            src={thumbnail.get('thumbnail')}
            width={thumbnail.get('width')}
            height={thumbnail.get('height')}
            maxWidth={thumbnailSize}
            maxHeight={thumbnailSize}
            draggable={false}
            disableAnimation={this.props.isDragging}
          />
        </div>
        <div className="mediacat-thumbnail__footer">
          <Rating size="small" media={thumbnail} interactable={false} /> 
        </div>
        {this.state.dragOverPosition && this.state.dragOverPosition === 'after' ? <div className="mediacat-thumbnail__dragover mediacat-thumbnail__dragover--after" /> : null}
      </div>
    );
  }
});

module.exports = Thumbnail;