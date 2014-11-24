var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('./bem-cx');


var ProxyImg = React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps: function() {
    return {
      draggable: true
    };
  },

  getInitialState: function() {
    return {
      loaded: false,
      loadingImage: null,
      alreadyLoaded: false
    };
  },

  handleImageLoad: function() {
    if (this.state.loadingImage) {
      this.state.loadingImage.removeEventListener('load', this.handleImageLoad);
      this.state.loadingImage.remove();

      this.setState({
        loaded: true,
        loadingImage: null
      });      
    }
  },

  componentDidMount: function() {
    var img = document.createElement('img');
    img.addEventListener('load', this.handleImageLoad);

    img.src = this.props.src;

    this.setState({
      'alreadyLoaded': img.complete,
      'loadingImage': img
    });
  },

  componentWillUnmount: function() {
    if (this.state.loadingImage) {
      this.state.loadingImage.removeEventListener('load', this.handleImageLoad);
      this.state.loadingImage.remove();
    }
  },

  onDragStart: function(event) {
    if (!this.props.draggable) {
      event.preventDefault();
    }
  },

  render: function() {
    var src = this.props.src;
    var draggable = this.props.draggable;

    var containerWidth = this.props.maxWidth;
    var containerHeight = this.props.maxHeight;

    var width = this.props.width;
    var height = this.props.height;
    var ratio = width / height;

    var displayWidth;
    var displayHeight;
    var displayTop;
    var displayLeft;
    var displayScale;

    var containerRatio = containerWidth / containerHeight;

    if (ratio >= containerRatio) {
      // Landscape
      displayWidth = containerWidth;
      displayScale = containerWidth / width;

      if (displayScale > 1) {
        displayScale = 1;
        displayWidth = width;
      }

      displayHeight = height * displayScale;
    } else {
      // Portrait
      displayHeight = containerHeight;
      displayScale = containerHeight / height;

      if (displayScale > 1) {
        displayScale = 1;
        displayHeight = height;
      }

      displayWidth = width * displayScale;
    }

    displayTop = (containerHeight - displayHeight) / 2;
    displayLeft = (containerWidth- displayWidth) / 2;

    var classes = {
      'proxy-image': true,
      'proxy-image--disable-animation': this.props.disableAnimation
    };

    var states = {
      'preloaded': this.state.alreadyLoaded ? true : false
    }

    var style = {
      'opacity': this.state.loaded ? 100 : 0
    };

    var imgStyle = {
        width: displayWidth,
        height: displayHeight,
        top: displayTop,
        left: displayLeft
    };

    return (
      <div className={cx(classes, {states})}>
        <div className="mediacat-proxy-image__bg" style={style}>
          <img className="mediacat-proxy-image__image" src={src} style={imgStyle} draggable={draggable} onDragStart={this.onDragStart} />
        </div>
      </div>
    );
  }
});

module.exports = ProxyImg;
