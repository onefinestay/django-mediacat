/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;

var ScrollPane = require('./scrollpane');


var Panel = React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps: function() {
    return {
      collapsible: false,
      className: ''
    };
  },

  getInitialState: function() {
    return {
      open: true
    };
  },

  render: function() {
    var classes = {
      'panel': true,
      'panel-open': this.state.open,
    };
    this.props.className.split(/\s+/).forEach(c => classes[c] = true);

    return (
      <div className={cx(classes)}>
        {this.props.toolbar}
        <ScrollPane mode={this.props.mode}>
          {this.props.children}
        </ScrollPane>
      </div>
    );
  }
});

module.exports = Panel;