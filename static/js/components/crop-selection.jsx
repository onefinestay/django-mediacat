/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;


var CropSelectionHandle = React.createClass({
  mixins: [PureRenderMixin],

  onMouseDown: function(event) {
    return this.props.onMouseDown(event, this.props.position);
  },

  render: function() {
    var classes = [];
    classes['mediacat-cropper-selection-' + this.props.position] = true;

    return (
      <div 
        className={cx(classes)}
        onMouseDown={this.onMouseDown}>
        <div className="mediacat-cropper-selection-handle" />
      </div>
    );
  },
});


var CropSelection = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    return {
      dragging: false,
      dragOrigin: null,
      prevX: null,
      prevY: null
    };
  },

  onMouseDown: function(event) {
    event.preventDefault();

    if (event.button === 0) {
      document.body.addEventListener('mousemove', this.handleMouseMove);
      document.body.addEventListener('mouseup', this.handleMouseUp);          
      this.setState({
        dragging: true,
        dragOrigin: 'center',
        prevX: event.clientX,
        prevY: event.clientY
      });
    }
  },

  onHandleMouseDown: function(event, origin) {
    event.preventDefault();

    if (event.button === 0) {
      document.body.addEventListener('mousemove', this.handleMouseMove);
      document.body.addEventListener('mouseup', this.handleMouseUp);    
      this.setState({
        dragging: true,
        dragOrigin: origin,
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

      this.props.onMove(Math.round(dX / this.props.scale), Math.round(dY / this.props.scale), this.state.dragOrigin);
            
      this.setState({
        prevX: event.clientX,
        prevY: event.clientY
      });
    }
  },  

  handleMouseUp: function(event) {
    event.preventDefault();

    document.body.removeEventListener('mousemove', this.handleMouseMove);
    document.body.removeEventListener('mouseup', this.handleMouseUp);    

    this.setState({
      dragging: false,
      dragOrigin: null,
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
        style={style} >
        <div 
          className="mediacat-cropper-selection-mover" 
          onMouseDown={this.onMouseDown}
          />
          <div className="mediacat-cropper-selection-guide-x1" />
          <div className="mediacat-cropper-selection-guide-x2" />
          <div className="mediacat-cropper-selection-guide-y1" />
          <div className="mediacat-cropper-selection-guide-y2" />          
        <CropSelectionHandle position="top" onMouseDown={this.onHandleMouseDown} />
        <CropSelectionHandle position="top-left" onMouseDown={this.onHandleMouseDown} />
        <CropSelectionHandle position="left" onMouseDown={this.onHandleMouseDown} />
        <CropSelectionHandle position="bottom-left" onMouseDown={this.onHandleMouseDown} />
        <CropSelectionHandle position="bottom" onMouseDown={this.onHandleMouseDown} />
        <CropSelectionHandle position="bottom-right" onMouseDown={this.onHandleMouseDown} />
        <CropSelectionHandle position="right" onMouseDown={this.onHandleMouseDown} />
        <CropSelectionHandle position="top-right" onMouseDown={this.onHandleMouseDown} />     
      </div>
    );
  }
});

module.exports = CropSelection;