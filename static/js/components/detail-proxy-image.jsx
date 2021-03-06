var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('./bem-cx');

var RadialLoader = require('./common/radial');


var DetailProxyImage = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    return {
      loaded: false,
      loadingImage: null,
      alreadyLoaded: false
    };
  },

  handleImageLoad: function() {
    this.state.loadingImage.removeEventListener('load', this.handleImageLoad);
    this.state.loadingImage.remove();
    this.setState({
      loaded: true,
      loadingImage: null
    });
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
  
  render: function() {
    var src = this.props.src;
    var placeholderSrc = this.props.placeholderSrc;

    var containerStyle = {
      width: this.props.width,
      height: this.props.height,
      top: this.props.top,
      left: this.props.left
    };

    var classes = {
      'detail__proxy-image': true
    };

    var states = {
      'preloaded': this.state.alreadyLoaded ? true : false
    }

    var placeholderStyle = {
      'backgroundImage': `url('${ placeholderSrc }')`
    };

    var style = {
      'opacity': this.state.loaded ? 100 : 0,
      'backgroundImage': this.state.loaded ? `url('${ src }')` : null
    };

    var spinnerStyle = {
      'opacity': this.state.loaded ? 0 : 100
    };
    return (
      <div className={cx(classes, {states})} style={containerStyle}>
        <div className="mediacat-detail__proxy-image__placeholder" style={placeholderStyle} />
        <div className="mediacat-detail__proxy-image__bg" style={style}>
          <img className="mediacat-detail__proxy-image__image" src={src} />
        </div>
        <div className="mediacat-detail__proxy-image__spinner" style={spinnerStyle}><RadialLoader /></div>
      </div>
    );
  }
});

module.exports = DetailProxyImage;