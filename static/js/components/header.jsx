/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;


var Header = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    return (
      <div className="mediacat-header">
        {this.props.children}
      </div>
    );
  }
});

module.exports = Header;