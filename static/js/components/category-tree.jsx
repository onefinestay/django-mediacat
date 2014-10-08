/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var ScrollPane = require('./scrollpane');
var CategoryTree = require('./category-tree');
var FluxMixin = require('./flux-mixin');
var LinearLoader = require('./loaders/linear');


var CategoryTreePlaceholderNode = React.createClass({
  render: function() {
    var style = {
      'padding-left': 15 * this.props.depth + 'px'
    };

    var classes = {
      'mediacat-categories-node': true,
      'mediacat-list__item': true,
      'mediacat-list__item--category': true,   
    };

    return (
      <li className={cx(classes)}>
        <a style={style} className="mediacat-categories-label">
          <span className="icon icon-dash" />
          <span className="loading">Loading...</span>
        </a>
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
      'mediacat-categories-node': true,
      'mediacat-categories-node-open': isOpen,
      'mediacat-list__item': true,
      'mediacat-list__item--category': true,    
      'mediacat-categories-node-selected': this.state.selected
    };

    var style = {
      'padding-left': 15 * depth + 'px',
      'cursor': this.cursor()
    };

    var labelClasses = {
      "mediacat-categories-label": true,
      "hover": this.state.hover
    };

    var count = node.get('count');

    return (
      <li className={cx(classes)}>
        <a style={style} className={cx(labelClasses)} href={node.get('url')} onClick={this.select} onMouseEnter={this.onMouseEnter} onMouseOut={this.onMouseOut} onMouseUp={this.onMouseUp}>
          {node.get('has_children') ? <span className="icon icon-arrow" onClick={this.toggleExpanded} /> : <span className="icon icon-dash" />}
          {node.get('name')}
          {this.state.fetchingMedia ? <LinearLoader /> : <div className="mediacat-categories-count">{count || '-'}</div>}
        </a>
        {isOpen && hasChildren && loadedChildren ? <ul className="mediacat-categories-children mediacat-list mediacat-list--categories">{nodes.toJS()}</ul> : null}
        {isOpen && hasChildren && !loadedChildren ? <ul className="mediacat-categories-children mediacat-list mediacat-list--categories"><CategoryTreePlaceholderNode depth={depth + 1} /></ul> : null}
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
      <ScrollPane>
        <ul className="mediacat-categories mediacat-list mediacat-list--categories">
          {nodes.toJS()}
        </ul>
      </ScrollPane>
    );
  }
});

module.exports = CategoryTree;
