/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Panel = require('./panel');
var CategoryTree = require('./category-tree');
var FluxMixin = require('./flux-mixin');
var LinearLoader = require('./loaders/linear');
var Icon = require('./icon');


var CategoryTreePlaceholderNode = React.createClass({
  render: function() {
    var style = {
      'paddingLeft': 5 + (15 * (this.props.depth - 1)) + 'px'
    };

    return (
      <li className="mediacat-list__item mediacat-list__item--category">
        <div className="mediacat-category">
          <span className="mediacat-category__info" style={style}>
            <span className="mediacat-category__handle" />
            <span className="mediacat-category__label mediacat-category__label--loading">Loading...</span>
            <div className="mediacat-category__count">-</div>            
          </span>
        </div>
      </li>
    );
  }
});


var CategoryTreeNode = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Categories", "Media", "Dragging")],

  select: function(event) {
    var category = this.props.node;
    event.preventDefault();
    this.getFlux().actions.categories.select(category);

    if (!category.get('expanded')) {
      this.getFlux().actions.categories.open(category);
    }
  },

  toggleExpanded: function(event) {
    var category = this.props.node;
    event.preventDefault();
    event.stopPropagation();

    if (category.get('expanded')) {
      this.getFlux().actions.categories.close(category);
    } else {
      this.getFlux().actions.categories.open(category);
    }
  },

  getStateFromFlux: function() {
    var path = this.props.node.get('path');
    var requests = this.getFlux().store('Media').state.get('fetchRequests');

    var hasRequest = false;
    var fetchRequest;

    var dragStore = this.getFlux().store('Dragging');

    if (requests) {
      fetchRequest = requests.get(path);
    }
    return {
      fetchingMedia: fetchRequest ? true : false,
      selected: this.props.node.get('path') === this.getFlux().store('Categories').state.get('selectedPath'),
      draggingMedia: dragStore.state.get('draggingMedia')
    };
  },

  cursor: function() {
    if (!this.state.draggingMedia) {
      return "pointer";
    }

    if (this.props.node.get('accepts_images')) {
      return "copy";
    }

    return "not-allowed";
  },

  onMouseEnter: function() {
    this.state.hover = true;
    this.forceUpdate();
  },

  onMouseOut: function() {
    this.state.hover = false;
    this.forceUpdate();
  },

  onMouseUp: function() {
    var draggingMedia = this.state.draggingMedia;
    if (draggingMedia && this.props.node.get('accepts_images')) {
      this.getFlux().actions.media.addAssociation(this.props.node, draggingMedia);
    }
  },

  render: function() {
    var node = this.props.node;

    var depth = this.props.depth;
    var children = node.get('children');
    var loadedChildren = children !== null;
    var nodes;

    if (loadedChildren) {
      nodes = children.map((node, i) => <CategoryTreeNode key={node.get('path')} node={node} depth={depth + 1} />);
    }

    var isOpen = node.get('expanded');
    var hasChildren = node.get('has_children');

    var classes = {
      'mediacat-category': true,
      'mediacat-category--selected': this.state.selected
    };

    var handleClasses = {
      'mediacat-category__handle': true,
      'mediacat-category__handle--open': isOpen
    };

    var style = {
      'paddingLeft': 5 + (15 * (this.props.depth - 1)) + 'px',
      'cursor': this.cursor()
    };

    var labelClasses = {
      "mediacat-category__info": true,
      "mediacat-is-hovered": this.state.hover
    };

    var count = node.get('count');

    return (
      <li className="mediacat-list__item mediacat-list__item--category">
        <div className={cx(classes)}>
          <a style={style} className={cx(labelClasses)} href={node.get('url')} onClick={this.select} onMouseEnter={this.onMouseEnter} onMouseOut={this.onMouseOut} onMouseUp={this.onMouseUp}>
            <span className={cx(handleClasses)}>
              {node.get('has_children') ? <Icon glyph="arrow" onClick={this.toggleExpanded} /> : null}
            </span>
            <span className="mediacat-category__label">{node.get('name')}</span>
            {this.state.fetchingMedia ? <div className="mediacat-category__loader"><LinearLoader size="tiny" /></div> : <div className="mediacat-category__count">{count || '-'}</div>}
          </a>
          {isOpen && hasChildren && loadedChildren ? <ul className="mediacat-list mediacat-list--sub-categories">{nodes.toJS()}</ul> : null}
          {isOpen && hasChildren && !loadedChildren ? <ul className="mediacat-list mediacat-list--sub-categories"><CategoryTreePlaceholderNode depth={depth + 1} /></ul> : null}
        </div>
      </li>
    );
  }
});


var CategoryTree = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Categories")],

  getStateFromFlux: function() {
    var store = this.getFlux().store('Categories');

    return {
      categories: this.getFlux().store('Categories').state.get('categories')
    };
  },

  render: function() {
    var nodes = this.state.categories.map((node, i) => <CategoryTreeNode key={node.get('path')} node={node} depth={1} />);

    return (
      <Panel fill={true}>
        <ul className="mediacat-list mediacat-list--categories">
          {nodes.toJS()}
        </ul>
      </Panel>
    );
  }
});

module.exports = CategoryTree;
