/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var Immutable = require('immutable');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;
var Fluxxor = require("fluxxor");
var moment = require('moment');
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Panel = require('./panel');
var PanelToolbar = require('./panel-toolbar');
var CategoryTree = require('./category-tree');
var FluxMixin = require('./flux-mixin');
var ProxyImg = require('./proxy-img');

var Thumbnail = require('./thumbnail');
var Select = require('./select');

var sortOptions = Immutable.fromJS([
  {value: 'manual_asc', label: 'Manual'},
  {value: 'rating_desc', label: 'Rating (Highest First)'},
  {value: 'rating_asc', label: 'Rating (Lowest First)'},
  {value: 'date_desc', label: 'Date Uploaded (Newest First)'},
  {value: 'date_asc', label: 'Date Uploaded (Oldest First)'}
]);

var ascSorter = function(a, b) {
  // Sort ascending, null values come first
  if (a === b) {
    return 0;
  }
  if (a === null || a < b) {
    return -1;
  }
  if (b === null || a > b) {
    return 1;
  }
  return 0;
};

var descSorter = function(a, b) {
  // Sort descending, null values come last
  if (a === b) {
    return 0;
  }    

  if (b === null || b < a) {
    return -1;
  }
  if (a === null || b > a) {
    return 1;
  }
  return 0;
};

var sorters = {
  manual_asc: (a, b) => ascSorter(a.get('rank'), b.get('rank')),
  rating_asc: (a, b) => ascSorter(a.get('rating'), b.get('rating')),
  rating_desc: (a, b) => descSorter(a.get('rating'), b.get('rating')),
  date_asc: (a, b) => ascSorter(new Date(a.get('date_created')), new Date(b.get('date_created'))),
  date_desc: (a, b) => descSorter(new Date(a.get('date_created')), new Date(b.get('date_created')))
};

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
    var sort = this.state.sortBy;
    var media = this.state.media.sort(sorters[sort]);

    if (sort === 'manual') {
      media = media.sort('rank');
    } else if (sort === '-rating') {
      media = media.sort('rating');
    } else if (sort === 'rating') {
      media = media.sort('rating');
    } else if (sort === '-date') {
      media = media.sort('date_created');
    } else if (sort === 'date') {
      media = media.sort('date_created');
    }

    var thumbnails = media.map(thumbnail => <Thumbnail key={thumbnail.get('id')} thumbnail={thumbnail} />);

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
