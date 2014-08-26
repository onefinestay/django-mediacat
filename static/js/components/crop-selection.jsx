/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;


var CropSelection = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    return {
      dragging: false,
      draggingPaused: false,
      prevX: null,
      prevY: null
    };
  },

  handleMouseLeave: function(event) {
    event.preventDefault();

    if (this.state.dragging) {
      this.setState({
        draggingPaused: true,
      });
    }
  },

  handleMouseEnter: function(event) {
    event.preventDefault();

    if (this.state.dragging && this.state.draggingPaused) {
      if (event.button === 0) {
        this.setState({
          draggingPaused: false,
          prevX: event.clientX,
          prevY: event.clientY        
        });
      } else {
        this.setState({
          dragging: false,
          draggingPaused: false,
          prevX: null,
          prevY: null      
        });
      }
    }
  },

  handleMouseDown: function(event) {
    event.preventDefault();

    if (event.button === 0) {
      this.setState({
        dragging: true,
        prevX: event.clientX,
        prevY: event.clientY
      });
    }
  },

  handleMouseMove: function(event) {
    var dX;
    var dY;

    event.preventDefault();

    if (this.state.dragging) {
      dX = event.clientX - this.state.prevX;
      dY = event.clientY - this.state.prevY;
      this.props.onMove(dX / this.props.scale, dY / this.props.scale);
      
      this.setState({
        prevX: event.clientX,
        prevY: event.clientY
      });
    }
  },  

  handleMouseUp: function(event) {
    event.preventDefault();

    this.setState({
      dragging: false,
      prevX: null,
      prevY: null
    });
  },

  render: function() {
    var style = {
      top: this.props.top + 'px',
      left: this.props.left + 'px',
      width: this.props.width  + 'px',
      height: this.props.height + 'px'
    };

    return (
      <div 
        className="mediacat-cropper-selection" 
        style={style} 
        onMouseLeave={this.handleMouseLeave}
        onMouseEnter={this.handleMouseEnter}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
      >
        <div className="mediacat-cropper-selection-top">
          <div className="mediacat-cropper-selection-handle" />
        </div>
        <div className="mediacat-cropper-selection-top-left">
          <div className="mediacat-cropper-selection-handle" />
        </div>        
        <div className="mediacat-cropper-selection-left">
          <div className="mediacat-cropper-selection-handle" />
        </div>
        <div className="mediacat-cropper-selection-bottom-left">
          <div className="mediacat-cropper-selection-handle" />
        </div>          
        <div className="mediacat-cropper-selection-bottom">
          <div className="mediacat-cropper-selection-handle" />
        </div>
        <div className="mediacat-cropper-selection-bottom-right">
          <div className="mediacat-cropper-selection-handle" />
        </div>          
        <div className="mediacat-cropper-selection-right">
          <div className="mediacat-cropper-selection-handle" />
        </div>
        <div className="mediacat-cropper-selection-top-right">
          <div className="mediacat-cropper-selection-handle" />
        </div>          
      </div>
    );
  }
});

module.exports = CropSelection;