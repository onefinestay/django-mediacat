/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var Immutable = require('immutable');
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
var Select = require('./select');

var sortOptions = Immutable.fromJS([
  {value: 'manual', label: 'Manual'},
  {value: '-rating', label: 'Rating (Highest First'},
  {value: 'rating', label: 'Rating (Lowest First'},
  {value: '-date', label: 'Date Uploaded (Newest First)'},
  {value: 'date', label: 'Date Uploaded (Oldest First)'}
]);

var ThumbnailList = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media")],

  getStateFromFlux: function() {
    return {
      sortBy: this.getFlux().store('Media').state.get('sortBy'),
      media: this.getFlux().store('Media').state.get('media')
    };
  },

  setSort: function(option) {
    this.getFlux().actions.media.setSort(option.get('value'));
  },  

  render: function() {
    var thumbnails = this.state.media.map(thumbnail => <Thumbnail key={thumbnail.get('id')} thumbnail={thumbnail} />);

    var toolbar = (
      <PanelToolbar>
        <div className="spacer" />
        <label>Sort by:</label>
        <Select value={this.state.sortBy} ref="sortBy" options={sortOptions} onSelect={this.setSort} placeholder="Sort by" />
      </PanelToolbar>
    );

    return (
      <Panel mode={this.props.mode} toolbar={toolbar}>
        <ul className="mediacat-thumbnail-list">
          {thumbnails.toJS()}
        </ul>
      </Panel>
    );
  }
});

module.exports = ThumbnailList;
