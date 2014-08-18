/**
 * @jsx React.DOM
 */
var React = require('react/addons');

var Header = require('./header');
var Search = require('./search');
var CategoryTree = require('./category-tree');


var Navigation = React.createClass({
  render: function() {
  	return (
  		<div className="mediacat-navigation">
  			<Header>
  				<Search />
  			</Header>
  			<CategoryTree />
  		</div>
  	);
  }
});

module.exports = Navigation;