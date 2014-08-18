/**
 * @jsx React.DOM
 */
var React = require('react/addons');


var Search = React.createClass({
  render: function() {
  	return (
  		<input type="search" placeholder="Enter search query" />
  	);
  }
});

module.exports = Search;