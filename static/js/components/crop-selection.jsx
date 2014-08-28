/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;


var CropSelectionHandle = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    return {
      dragging: false,
      draggingPaused: false,
      prevX: null,
      prevY: null
    };
  },

  handleMouseDown: function(event) {
    console.log('Mouse Down');  
    document.body.addEventListener('mousemove', this.handleMouseMove);
    document.body.addEventListener('mouseup', this.handleMouseUp);

    this.setState({
      dragging: true,
      prevX: event.clientX,
      prevY: event.clientY
    });
  },

  handleMouseMove: function(event) {
    console.log('Mouse Move');
    var dX;
    var dY;

    event.preventDefault();
    
    if (this.state.dragging) {
      dX = event.clientX - this.state.prevX;
      dY = event.clientY - this.state.prevY;

      this.props.onMove(Math.round(dX / this.props.scale), Math.round(dY / this.props.scale), this.props.position);
            
      this.setState({
        prevX: event.clientX,
        prevY: event.clientY
      });
    }
  },  

  handleMouseUp: function(event) {
    console.log('Mouse Up');
    event.preventDefault();

    document.body.removeEventListener('mousemove', this.handleMouseMove);
    document.body.removeEventListener('mouseup', this.handleMouseUp);    

    this.setState({
      dragging: false,
      prevX: null,
      prevY: null
    });
  },

  render: function() {
    var classes = [];
    classes['mediacat-cropper-selection-' + this.props.position] = true;

    return (
      <div 
        className={cx(classes)}
        onMouseDown={this.handleMouseDown}>
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
      draggingPaused: false,
      prevX: null,
      prevY: null
    };
  },

  // handleMouseLeave: function(event) {
  //   event.preventDefault();

  //   if (this.state.dragging) {
  //     this.setState({
  //       draggingPaused: true,
  //     });
  //   }
  // },

  // handleMouseEnter: function(event) {
  //   event.preventDefault();

  //   if (this.state.dragging && this.state.draggingPaused) {
  //     if (event.button === 0) {
  //       this.setState({
  //         draggingPaused: false,
  //         prevX: event.clientX,
  //         prevY: event.clientY        
  //       });
  //     } else {
  //       this.setState({
  //         dragging: false,
  //         draggingPaused: false,
  //         prevX: null,
  //         prevY: null      
  //       });
  //     }
  //   }
  // },

  // handleMouseDown: function(event) {
  //   event.preventDefault();

  //   if (event.button === 0) {
  //     this.setState({
  //       dragging: true,
  //       prevX: event.clientX,
  //       prevY: event.clientY
  //     });
  //   }
  // },

  // handleMouseMove: function(event) {
  //   var dX;
  //   var dY;

  //   event.preventDefault();

  //   if (this.state.dragging) {
  //     dX = event.clientX - this.state.prevX;
  //     dY = event.clientY - this.state.prevY;
  //     this.props.onMove(Math.round(dX / this.props.scale), Math.round(dY / this.props.scale));
      
  //     this.setState({
  //       prevX: event.clientX,
  //       prevY: event.clientY
  //     });
  //   }
  // },  

  // handleMouseUp: function(event) {
  //   event.preventDefault();

  //   this.setState({
  //     dragging: false,
  //     prevX: null,
  //     prevY: null
  //   });
  // },

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
        onMouseLeave={this.handleMouseLeave}
        onMouseEnter={this.handleMouseEnter}
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}        
        style={style} >
        <CropSelectionHandle position="top" onMove={this.props.onResize} scale={this.props.scale} />
        <CropSelectionHandle position="top-left" onMove={this.props.onResize} scale={this.props.scale} />
        <CropSelectionHandle position="left" onMove={this.props.onResize} scale={this.props.scale} />
        <CropSelectionHandle position="bottom-left" onMove={this.props.onResize} scale={this.props.scale} />
        <CropSelectionHandle position="bottom" onMove={this.props.onResize} scale={this.props.scale} />
        <CropSelectionHandle position="bottom-right" onMove={this.props.onResize} scale={this.props.scale} />
        <CropSelectionHandle position="right" onMove={this.props.onResize} scale={this.props.scale} />
        <CropSelectionHandle position="top-right" onMove={this.props.onResize} scale={this.props.scale} />     
      </div>
    );
  }
});

module.exports = CropSelection;