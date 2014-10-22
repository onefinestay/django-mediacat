var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var cx = require('./bem-cx');
var FluxMixin = require('./mixins/flux-mixin');

var DetailProxyImage = require('./detail-proxy-image');
var Cropper = require('./cropper');


var Detail = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Crops", "Media")],

  getInitialState: function() {
    return {
      width: null,
      height: null      
    };
  },

  getStateFromFlux: function() {
    var selectedMedia = this.getFlux().store('Media').getSelectedMedia();
    var selectedCrop = this.getFlux().store('Crops').getSelectedCrop();

    return {
      crop: selectedCrop,
      media: selectedMedia
    };
  },

  updateDOMDimensions: function() {
    var el = this.refs.content.getDOMNode();

    this.setState({
      width: el.offsetWidth,
      height: el.offsetHeight
    });
  },

  componentDidUpdate: function(prevProps) {
    if (prevProps.mode !== this.props.mode) {
      this.updateDOMDimensions();
    }
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

    var classes = {
      'detail': true,
      'detail--filmstrip': this.props.mode === 'filmstrip',
    };

    if (readyToDisplay && crop) {
      return (
        <div className={cx(classes)}>
          <div className="mediacat-detail__content" ref="content">
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
        </div>
      );
    }

    return (
      <div className={cx(classes)}>
          <div className="mediacat-detail__content" ref="content">
          {readyToDisplay ? <DetailProxyImage
            key={media.get('thumbnail')}
            width={displayWidth} 
            height={displayHeight} 
            top={displayTop} 
            left={displayLeft}           
            src={media.get('url')} 
            placeholderSrc={media.get('thumbnail')} /> : null}
          </div>
      </div>
    );
  }
});

module.exports = Detail;