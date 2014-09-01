/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var FluxMixin = require('./flux-mixin');

var CropSelection = require('./crop-selection');

var Cropper = React.createClass({
  mixins: [PureRenderMixin, FluxMixin],

  moveSelection: function(dX, dY, origin, modifier) {
    if (!modifier && origin === 'center') {
      this.getFlux().actions.crop.move(this.props.crop, dX, dY);  
    } else {
      this.getFlux().actions.crop.resize(this.props.crop, dX, dY, origin);  
    }   
  },
 
  render: function() {
    var media = this.props.media;
    var crop = this.props.crop;
    var scale = this.props.scale;

    var style = {
      width: this.props.width + 'px',
      height: this.props.height + 'px',
      left: this.props.left + 'px',
      top: this.props.top + 'px'
    };      

    var cropLeft = scale * crop.get('x1');
    var cropTop = scale * crop.get('y1');    
    var cropRight = scale * crop.get('x2');
    var cropBottom = scale * crop.get('y2');
    var cropWidth = cropRight - cropLeft;
    var cropHeight = cropBottom - cropTop;

    var leftMaskStyle = {
      top: 0,
      left: 0,
      bottom: 0,
      width: Math.round(cropLeft) + 'px'
    };
    var topMaskStyle = {
      top: 0,
      left: Math.round(cropLeft) + 'px',
      height: Math.round(cropTop) + 'px',
      right: Math.round(this.props.width - cropRight) + 'px'
    };
    var rightMaskStyle = {
      top: 0,
      left: Math.round(cropRight) + 'px',
      bottom: 0,
      right: 0
    };
    var bottomMaskStyle = {
      top: Math.round(cropBottom )+ 'px',
      left: Math.round(cropLeft) + 'px',
      bottom: 0,
      right: Math.round(this.props.width - cropRight) + 'px'
    };

    return (
      <div className="mediacat-cropper" style={style}>
        <div className="mediacat-cropper-mask" style={leftMaskStyle} />
        <div className="mediacat-cropper-mask" style={topMaskStyle} />
        <div className="mediacat-cropper-mask" style={rightMaskStyle} />
        <div className="mediacat-cropper-mask" style={bottomMaskStyle} />
        <CropSelection onMove={this.moveSelection} scale={this.props.scale} top={cropTop} left={cropLeft} width={cropWidth} height={cropHeight} />
      </div>
    );
  }
});

module.exports = Cropper;