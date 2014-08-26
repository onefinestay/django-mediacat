/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;


var CropSelection = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    var style = {
      top: this.props.top + 'px',
      left: this.props.left + 'px',
      width: this.props.width  + 'px',
      height: this.props.height + 'px'
    };

    return (
      <div className="mediacat-cropper-selection" style={style}>
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