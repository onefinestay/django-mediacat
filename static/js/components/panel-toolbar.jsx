


/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;


var PanelToolbar = React.createClass({
  mixins: [PureRenderMixin],

  getDefaultProps: function() {
    return {
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
      'panel-header': true,
      'toolbar': true
    };
    this.props.className.split(/\s+/).forEach(c => classes[c] = true);

    return (
      <div className={cx(classes)}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = PanelToolbar;        