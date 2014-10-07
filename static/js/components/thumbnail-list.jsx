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
var KeyboardMixin = require('./keyboard-mixin');
var ProxyImg = require('./proxy-img');

var Thumbnail = require('./thumbnail');
var Select = require('./select');

var elMetrics = require('../utils/element-metrics');

var minSize = 145;

var ThumbnailList = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media"), KeyboardMixin],

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

  componentWillMount: function() {
    var keyboard = this.getKeyboard();
    var flux = this.getFlux();

    keyboard.pushCopy();    

    keyboard.on('up', this.cursorUp);
    keyboard.on('down', this.cursorDown);
    keyboard.on('left', this.cursorLeft);
    keyboard.on('right', this.cursorRight);    
  },

  componentDidMount: function() {
    this.updateDOMDimensions();
    window.addEventListener('resize', this.updateDOMDimensions); 

    var el = this.getDOMNode();

    var observer = new MutationObserver(function(mutations) {
      this.updateDOMDimensions();
    }.bind(this));

    var config = {
      subtree: true,
      childList: true
    };

    observer.observe(el, config);
    this.setState({observer});
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.updateDOMDimensions);

    if (this.state.observer) {
      this.state.observer.disconnect();
    }

    var keyboard = this.getKeyboard();
    keyboard.pop();
  },
 
  setRating: function(rating, event) {
    var selected = this.getFlux().store('Media').getSelectedMedia();
    if (selected) {
      this.getFlux().actions.media.setRating(selected, rating);
    }
  },

  cursorUp: function() {
    var numPerRow = Math.floor(this.state.width / minSize);
    var selected = this.getFlux().store('Media').getSelectedMedia();

    if (selected) {
      var media = this.state.media;

      var index = media.indexOf(selected);

      if (index < numPerRow) {
        return;
      }
      this.getFlux().actions.media.select(media.get(index - numPerRow));
    }
  },

  cursorDown: function() {
    var numPerRow = Math.floor(this.state.width / minSize);
    var selected = this.getFlux().store('Media').getSelectedMedia();

    if (selected) {
      var media = this.state.media;

      var numRows = Math.ceil(media.count() / numPerRow);
      var index = media.indexOf(selected);      
      var indexRowNum = Math.floor(index / numPerRow);

      if (indexRowNum >= numRows - 1) {
        return;
      }

      var newIndex = index + numPerRow;

      if (newIndex > media.count() - 1) {
        newIndex = media.count() - 1;
      }
      this.getFlux().actions.media.select(media.get(newIndex));
    }
  },

  cursorLeft: function() {
    var selected = this.getFlux().store('Media').getSelectedMedia();

    if (selected) {
      var media = this.state.media;

      var index = media.indexOf(selected);

      var newIndex = index -1;

      if (newIndex < 0) {
        newIndex = 0;
      }
      this.getFlux().actions.media.select(media.get(newIndex));
    }
  },

  cursorRight: function() {
    var selected = this.getFlux().store('Media').getSelectedMedia();

    if (selected) {
      var media = this.state.media;

      var index = media.indexOf(selected);

      var newIndex = index + 1;

      if (newIndex > media.count() - 1) {
        newIndex = media.count() - 1;
      }
      this.getFlux().actions.media.select(media.get(newIndex));
    }
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
      size = (this.state.width - (numPerRow + 1)) / numPerRow;
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
