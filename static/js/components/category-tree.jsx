/**
 * @jsx React.DOM
 */
var React = require('react/addons');

var CategoryTree = require('./category-tree');


var CategoryTree = React.createClass({
  render: function() {
  	return (
  		<div className="mediacat-categories">
  			<div>Categories!</div>
  		</div>
  	);
  }
});

module.exports = CategoryTree;