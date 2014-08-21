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


var Detail = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media")],

  getStateFromFlux: function() {
    var store = this.getFlux().store('Media');
    var selected = store.state.get('selectedMedia');

    return {
      crop: store.state.get('selectedCrop'),
      media: selected
    };
  },

  render: function() {
    var media = this.state.media;
    var crop = this.state.crop;

    if (media) {
      return (
        <div className="mediacat-detail">
          {media ? <DetailProxyImage key={media.get('thumbnail')} src={media.get('url')} placeholderSrc={media.get('thumbnail')} /> : null}
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