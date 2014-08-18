/**
 * @jsx React.DOM
 */
var React = require('react/addons');


var Header = React.createClass({
  render: function() {
  	return (
  		<div className="mediacat-header">
        {this.props.children}
  		</div>
  	);
  }
});

module.exports = Header;