/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;

var ProxyImg = React.createClass({
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

    var classes = {
      'proxy-image': true,
      'proxy-image-preloaded': this.state.alreadyLoaded ? true : false
    };

    var style = {
      'opacity': this.state.loaded ? 100 : 0,
      'background-image': `url('${ src }')`
    };

    var spinnerStyle = {
      'opacity': this.state.loaded ? 0 : 100
    };
  	return (
  		<div className={cx(classes)}>
        <div className="proxy-image-bg" style={style}>
          <img src={src} />
        </div>
        <div className="proxy-image-spinner" style={spinnerStyle}>Loading</div>
      </div>
  	);
  }
});

module.exports = ProxyImg;