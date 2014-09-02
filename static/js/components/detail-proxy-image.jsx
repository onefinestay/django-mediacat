/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;

var RadialLoader = require('./loaders/radial');

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
      width: this.props.width + 'px',
      height: this.props.height + 'px',
      top: this.props.top + 'px',
      left: this.props.left + 'px'
    };

    var classes = {
      'detail-proxy-image': true,
      'detail-proxy-image-preloaded': this.state.alreadyLoaded ? true : false
    };

    var placeholderStyle = {
      'background-image': `url('${ placeholderSrc }')`      
    };

    var style = {
      'opacity': this.state.loaded ? 100 : 0,
      'background-image': this.state.loaded ? `url('${ src }')` : null
    };

    var spinnerStyle = {
      'opacity': this.state.loaded ? 0 : 100
    };
    return (
      <div className={cx(classes)} style={containerStyle}>
        <div className="detail-proxy-image-placeholder" style={placeholderStyle} />
        <div className="detail-proxy-image-bg" style={style}>
          <img src={src} />
        </div>
        <div className="detail-proxy-image-spinner" style={spinnerStyle}><RadialLoader /></div>
      </div>
    );
  }
});

module.exports = DetailProxyImage;