/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var CategoryTree = require('./category-tree');
var FluxMixin = require('./flux-mixin');
var ProxyImg = require('./proxy-img');


var Thumbnail = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media")],

  select: function(event) {
    event.preventDefault();
    this.getFlux().actions.media.select(this.props.thumbnail);
  },

  getStateFromFlux: function() {
    return {
      selected: this.props.thumbnail === this.getFlux().store('Media').state.get('selectedMedia')
    };
  },



  render: function() {
    var thumbnail = this.props.thumbnail;

    var classes = {
      'mediacat-thumbnail': true,
      'mediacat-thumbnail-selected': this.state.selected
    };

    return (
      <li className={cx(classes)} onClick={this.select}>
        <ProxyImg src={thumbnail.get('thumbnail')} />
      </li>
    );
  }
});


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
      <ul className="mediacat-thumbnail-list">
        {thumbnails.toJS()}
      </ul>
    );
  }
});

module.exports = ThumbnailList;