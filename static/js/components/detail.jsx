/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var FluxMixin = require('./flux-mixin');


var DetailProxyImage = require('./detail-proxy-image');
var Cropper = require('./cropper');


var Detail = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media")],

  getInitialState: function() {
    return {
      width: null,
      height: null      
    };
  },

  getStateFromFlux: function() {
    var store = this.getFlux().store('Media');
    var selected = store.getSelectedMedia();

    return {
      crop: store.getSelectedCrop(),
      media: selected
    };
  },

  updateDOMDimensions: function() {
    var el = this.getDOMNode();

    this.setState({
      width: el.offsetWidth,
      height: el.offsetHeight
    });
  },

  componentDidMount: function() {
    this.updateDOMDimensions();
    window.addEventListener('resize', this.updateDOMDimensions); 
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.updateDOMDimensions);
  },

  render: function() {
    var media = this.state.media;
    var crop = this.state.crop;
    var cropWrapperStyle;
    var width;
    var height;
    var containerRatio;
    var ratio;
    var displayWidth;
    var displayHeight;
    var displayTop;
    var displayLeft;
    var displayScale;

    var readyToDisplay = media && this.state.width && this.state.height;

    if (readyToDisplay) {
      width = media.get('width');
      height = media.get('height');
      ratio = width / height;

      containerRatio = this.state.width / this.state.height;

      if (ratio >= containerRatio) {
        // Landscape
        displayWidth = this.state.width;
        displayScale = this.state.width / width;

        if (displayScale > 1) {
          displayScale = 1;
          displayWidth = width;
        }

        displayHeight = height * displayScale;
      } else {
        // Portrait
        displayHeight = this.state.height;
        displayScale = this.state.height / height;

        if (displayScale > 1) {
          displayScale = 1;
          displayHeight = height;
        }

        displayWidth = width * displayScale;
      }
    }

    displayTop = (this.state.height - displayHeight) / 2;
    displayLeft = (this.state.width - displayWidth) / 2;    

    if (readyToDisplay && crop) {
      return (
        <div className="mediacat-detail mediacat-detail-crop">
          <DetailProxyImage
            key={media.get('thumbnail')} 
            width={displayWidth} 
            height={displayHeight} 
            top={displayTop} 
            left={displayLeft} 
            src={media.get('url')} 
            placeholderSrc={media.get('thumbnail')} />
          <Cropper 
            key={crop.get('id')} 
            scale={displayScale}
            width={displayWidth} 
            height={displayHeight} 
            top={displayTop} 
            left={displayLeft} 
            media={media} 
            crop={crop} />
        </div>
      );
    }

    return (
      <div className="mediacat-detail">
        {readyToDisplay ? <DetailProxyImage
          key={media.get('thumbnail')}
          width={displayWidth} 
          height={displayHeight} 
          top={displayTop} 
          left={displayLeft}           
          src={media.get('url')} 
          placeholderSrc={media.get('thumbnail')} /> : null}
      </div>
    );
  }
});

module.exports = Detail;