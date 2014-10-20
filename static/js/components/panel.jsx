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
      fill: true,
      height: null,
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
      'mediacat-panel': true,
      'mediacat-panel--fill': this.props.fill,
      'mediacat-panel--fixed': !this.props.fill && this.props.height,
      'mediacat-panel--open': this.state.open
    };

    var style = {};

    if (this.props.height) {
      style['height'] = this.props.height + 'px';
    }

    return (
      <div className={cx(classes)} style={style}>
        {this.props.toolbar}
        <ScrollPane mode={this.props.mode}>
          {this.props.children}
        </ScrollPane>
      </div>
    );
  }
});

module.exports = Panel;