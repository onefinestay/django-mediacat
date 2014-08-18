/**
 * @jsx React.DOM
 */
var React = require('react/addons');

var Header = require('./header');


var Main = React.createClass({
  render: function() {
  	return (
  		<div className="mediacat-content">
  			<Header>
  				<button>Upload</button>
  			</Header>
  			<div className="mediacat-document">
          Hello world
        </div>
  		</div>
  	);
  }
});

module.exports = Main;