var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var FluxMixin = require('./mixins/flux-mixin');

var CropSelection = require('./crop-selection');

var Cropper = React.createClass({
  mixins: [PureRenderMixin, FluxMixin],

  moveSelection: function(dX, dY, origin, modifier) {
    if (!modifier && origin === 'center') {
      this.getFlux().actions.crop.move(this.props.crop, this.props.media, dX, dY);  
    } else {
      this.getFlux().actions.crop.resize(this.props.crop, this.props.media, dX, dY, origin);  
    }   
  },
 
  render: function() {
    var crop = this.props.crop;
    var scale = this.props.scale;

    var style = {
      width: this.props.width,
      height: this.props.height,
      left: this.props.left,
      top: this.props.top,
    };      

    var cropLeft = Math.round(scale * crop.get('x1'));
    var cropTop = Math.round(scale * crop.get('y1'));    
    var cropRight = Math.round(scale * crop.get('x2'));
    var cropBottom = Math.round(scale * crop.get('y2'));
    var cropWidth = cropRight - cropLeft;
    var cropHeight = cropBottom - cropTop;

    var leftMaskStyle = {
      top: 0,
      left: 0,
      bottom: 0,
      width: cropLeft
    };
    var topMaskStyle = {
      top: 0,
      left: cropLeft,
      height: cropTop,
      width: cropWidth
    };
    var rightMaskStyle = {
      top: 0,
      left: cropRight,
      bottom: 0,
      right: 0
    };
    var bottomMaskStyle = {
      top: cropBottom,
      left: cropLeft,
      bottom: 0,
      width: cropWidth
    };

    return (
      <div className="mediacat-cropper" style={style}>
        <div className="mediacat-cropper__mask" style={leftMaskStyle} />
        <div className="mediacat-cropper__mask" style={topMaskStyle} />
        <div className="mediacat-cropper__mask" style={rightMaskStyle} />
        <div className="mediacat-cropper__mask" style={bottomMaskStyle} />
        <CropSelection onMove={this.moveSelection} scale={this.props.scale} top={cropTop} left={cropLeft} width={cropWidth} height={cropHeight} />
      </div>
    );
  }
});

module.exports = Cropper;