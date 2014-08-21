/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;

var LinearLoader = React.createClass({
  mixins: [PureRenderMixin],
  
  render: function() {
    return (
      <div className="linear-loader">
        <div className="linear-loader-bounce-1"></div>
        <div className="linear-loader-bounce-2"></div>
        <div className="linear-loader-bounce-3"></div>
      </div>
    );
  }
});

module.exports = LinearLoader;