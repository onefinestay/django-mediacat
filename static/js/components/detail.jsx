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

    if (media && crop && this.state.width && this.state.height) {
      width = media.get('width');
      height = media.get('height');

      return (
        <div className="mediacat-detail mediacat-detail-crop">
          <DetailProxyImage key={media.get('thumbnail')} src={media.get('url')} placeholderSrc={media.get('thumbnail')} />
          <Cropper key={crop.get('id')} width={this.state.width} height={this.state.height} media={media} crop={crop} />
        </div>
      );
    }

    return (
      <div className="mediacat-detail">
        {media ? <DetailProxyImage key={media.get('thumbnail')} src={media.get('url')} placeholderSrc={media.get('thumbnail')} /> : null}
      </div>
    );
  }
});

module.exports = Detail;