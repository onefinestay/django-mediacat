/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;


var InformationPanel = React.createClass({
  mixins: [PureRenderMixin],
  
  render: function() {
    return (
      <div className="mediacat-information-panel">
        Oh hi!
      </div>
    );
  }
});

module.exports = InformationPanel;