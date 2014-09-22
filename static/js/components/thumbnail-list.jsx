/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Panel = require('./panel');
var PanelToolbar = require('./panel-toolbar');
var CategoryTree = require('./category-tree');
var FluxMixin = require('./flux-mixin');
var ProxyImg = require('./proxy-img');

var Thumbnail = require('./thumbnail');


var ThumbnailList = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media")],

  getStateFromFlux: function() {
    return {
      media: this.getFlux().store('Media').state.get('media')
    };
  },

  render: function() {
    var thumbnails = this.state.media.map(thumbnail => <Thumbnail key={thumbnail.get('id')} thumbnail={thumbnail} />);

    return (
      <Panel mode={this.props.mode} toolbar={null}>
        <ul className="mediacat-thumbnail-list">
          {thumbnails.toJS()}
        </ul>
      </Panel>
    );
  }
});

module.exports = ThumbnailList;
