/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;

var RadialLoader = React.createClass({
  mixins: [PureRenderMixin],
  
  render: function() {
    return (
      <div className="radial-loader">
        <div className="radial-loader-container radial-loader-container-1">
          <div className="radial-loader-circle-1"></div>
          <div className="radial-loader-circle-2"></div>
          <div className="radial-loader-circle-3"></div>
          <div className="radial-loader-circle-4"></div>
        </div>
        <div className="radial-loader-container radial-loader-container-2">
          <div className="radial-loader-circle-1"></div>
          <div className="radial-loader-circle-2"></div>
          <div className="radial-loader-circle-3"></div>
          <div className="radial-loader-circle-4"></div>
        </div>
        <div className="radial-loader-container radial-loader-container-3">
          <div className="radial-loader-circle-1"></div>
          <div className="radial-loader-circle-2"></div>
          <div className="radial-loader-circle-3"></div>
          <div className="radial-loader-circle-4"></div>
        </div>      
      </div>
    );
  }
});

module.exports = RadialLoader;