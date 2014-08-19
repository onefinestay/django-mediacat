/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;

var Header = require('./header');
var ThumbnailList = require('./thumbnail-list');


var Main = React.createClass({
  mixins: [PureRenderMixin],
  
  render: function() {
  	return (
  		<div className="mediacat-content">
  			<Header>
  				<button>Upload</button>
  			</Header>
  			<div className="mediacat-document">
          <ThumbnailList />
        </div>
  		</div>
  	);
  }
});

module.exports = Main;