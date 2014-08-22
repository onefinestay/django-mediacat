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
var LinearLoader = require('./loaders/linear');


var CategoryTreeNode = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Categories", "Media")],

  select: function(event) {
    event.preventDefault();
    this.getFlux().actions.categories.select(this.props.node);
  },

  getStateFromFlux: function() {
    var path = this.props.node.get('path');
    var requests = this.getFlux().store('Media').state.get('fetchRequests');

    var hasRequest = false;
    var fetchRequest;

    if (requests) {
      fetchRequest = requests.get(path);
    }
    return {
      fetchingMedia: fetchRequest ? true : false,
      selected: this.props.node === this.getFlux().store('Categories').state.get('selectedCategory')
    };
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

    var classes = {
      'mediacat-categories-node': true,
      'mediacat-categories-node-selected': this.state.selected
    };

    var style = {
      'padding-left': 20 * depth + 'px'
    };

    var count = node.get('count');

    return (
      <li className={cx(classes)}>
        <a style={style} className="mediacat-categories-label" href={node.get('url')} onClick={this.select}>
          {node.get('name')} {node.get('has_children') ? 'yes' : 'no'}
          {this.state.fetchingMedia ? <LinearLoader /> : <div className="mediacat-categories-count">{count || '-'}</div>}
        </a>
        {loadedChildren && children.length ? <ul className="mediacat-categories-children">{nodes.toJS()}</ul> : null}
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
      <ul className="mediacat-categories">
        {nodes.toJS()}
      </ul>
    );
  }
});

module.exports = CategoryTree;
