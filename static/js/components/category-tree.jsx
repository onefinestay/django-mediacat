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


var CategoryTreeNode = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Categories")],

  select: function(event) {
    event.preventDefault();
    this.getFlux().actions.categories.select(this.props.node);
  },

  getStateFromFlux: function() {
    return {
      selected: this.props.node === this.getFlux().store('Categories').state.get('selectedCategory')
    };
  },  

  render: function() {
    var node = this.props.node;

    var depth = this.props.depth;
    var children = node.get('children');
    var nodes = children.map(node => <CategoryTreeNode key={node.get('path')} node={node} depth={depth + 1} />);

    var classes = {
      'mediacat-categories-node': true,
      'mediacat-categories-node-selected': this.state.selected
    };

    var style = {
      'padding-left': 20 * depth + 'px'
    };

    return (
      <li className={cx(classes)}>
        <a style={style} className="mediacat-categories-label" href={node.get('url')} onClick={this.select}>{node.get('name')}</a>
        {children.length ? <ul className="mediacat-categories-children">{nodes.toJS()}</ul> : null}
      </li>
    );
  }
});


var CategoryTree = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Categories")],

  getStateFromFlux: function() {
    return {
      categories: this.getFlux().store('Categories').state.get('categories')
    };
  },

  render: function() {
    var nodes = this.state.categories.map(node => <CategoryTreeNode key={node.get('path')} node={node} depth={1} />);

    return (
      <ul className="mediacat-categories">
        {nodes.toJS()}
      </ul>
    );
  }
});

module.exports = CategoryTree;