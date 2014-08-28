/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var FluxMixin = require('./flux-mixin');

var CropSelection = require('./crop-selection');

var Cropper = React.createClass({
  mixins: [PureRenderMixin, FluxMixin],

  moveSelection: function(dX, dY) {
    this.getFlux().actions.crop.move(this.props.crop, dX, dY);
  },

  resize: function(dX, dY, position) {
    this.getFlux().actions.crop.resize(this.props.crop, dX, dY, position);
  }, 
  
  render: function() {
    var media = this.props.media;
    var crop = this.props.crop;

    var containerWidth = this.props.width;
    var containerHeight = this.props.height;

    var containerRatio = containerWidth / containerHeight;

    var mWidth = media.get('width');
    var mHeight = media.get('height');

    var ratio = mWidth / mHeight;
    var scale;

    var height;
    var width;
    var top;
    var left;

    var style;

    if (ratio >= containerRatio) {
      // Landscape
      width = containerWidth;
      scale = width / mWidth;
      height = mHeight * scale;
      top = (containerHeight - height) / 2;

      style = {
        width: width + 'px',
        height: height + 'px',
        top: top + 'px'
      };

      style.width = width + 'px';
      style.height = height + 'px';
      style.top = top + 'px';
    } else {
      // Portrait
      height = containerHeight;
      scale = height / mHeight;
      width = mWidth * scale;
      left = (containerWidth - width) / 2;

      style = {
        width: width + 'px',
        height: height + 'px',
        left: left + 'px'
      };      
    }

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
      width: cropLeft + 'px'
    };
    var topMaskStyle = {
      top: 0,
      left: cropLeft + 'px',
      height: cropTop + 'px',
      right: (width - cropRight) + 'px'
    };
    var rightMaskStyle = {
      top: 0,
      left: cropRight + 'px',
      bottom: 0,
      right: 0
    };
    var bottomMaskStyle = {
      top: cropBottom + 'px',
      left: cropLeft + 'px',
      bottom: 0,
      right: (width - cropRight) + 'px'
    };

    return (
      <div className="mediacat-cropper" style={style}>
        <div className="mediacat-cropper-mask" style={leftMaskStyle} />
        <div className="mediacat-cropper-mask" style={topMaskStyle} />
        <div className="mediacat-cropper-mask" style={rightMaskStyle} />
        <div className="mediacat-cropper-mask" style={bottomMaskStyle} />
        <CropSelection onMove={this.moveSelection} onResize={this.resize} scale={scale} top={cropTop} left={cropLeft} width={cropWidth} height={cropHeight} />
      </div>
    );
  }
});

module.exports = Cropper;