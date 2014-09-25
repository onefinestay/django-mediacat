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

var elMetrics = require('../utils/element-metrics');

var minSize = 145;

var ThumbnailList = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media")],

  getInitialState: function() {
    return {
      width: null,
      height: null      
    };
  },  

  getStateFromFlux: function() {
    return {
      sortOptions: this.getFlux().store('Media').sortOptions,
      sortBy: this.getFlux().store('Media').state.get('sortBy'),
      media: this.getFlux().store('Media').getSortedMedia()
    };
  },

  updateDOMDimensions: function() {
    var el = this.refs.content.getDOMNode();

    this.setState({
      width: elMetrics.innerWidth(el),
      height: elMetrics.innerHeight(el)
    });
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (prevProps.mode !== this.props.mode) {
      this.updateDOMDimensions();
    }
  },

  componentDidMount: function() {
    this.updateDOMDimensions();
    window.addEventListener('resize', this.updateDOMDimensions); 
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.updateDOMDimensions);
  },  

  setSort: function(option) {
    this.getFlux().actions.media.setSort(option.get('value'));
  },  

  render: function() {
    var sort = this.state.sortBy;
    var media = this.state.media;

    var size;
    var numPerRow;

    if (this.props.mode === 'grid' && this.state.width && this.state.height) {
      numPerRow = Math.floor(this.state.width / minSize);
      size = (this.state.width - numPerRow) / numPerRow;
      console.log(size);     
    }

    var thumbnails = media.map(thumbnail => <Thumbnail size={size} key={thumbnail.get('id')} thumbnail={thumbnail} />);

    var toolbar = (
      <PanelToolbar>
        <div className="spacer" />
        <label>Sort by:</label>
        <Select value={this.state.sortBy} ref="sortBy" options={this.state.sortOptions} onSelect={this.setSort} placeholder="Sort by" />
      </PanelToolbar>
    );

    return (
      <Panel mode={this.props.mode} toolbar={toolbar}>
        <ul className="mediacat-thumbnail-list" ref="content">
          {thumbnails.toJS()}
        </ul>
      </Panel>
    );
  }
});

module.exports = ThumbnailList;
