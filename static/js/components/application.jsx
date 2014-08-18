/**
 * @jsx React.DOM
 */
var React = require('react/addons');

var Navigation = require('./navigation');
var Main = require('./main');


var Application = React.createClass({
  render: function() {
  	return (
  		<div className="mediacat-application">
  			<Navigation />
  			<Main />
  		</div>
  	);
  }
});

module.exports = Application;



