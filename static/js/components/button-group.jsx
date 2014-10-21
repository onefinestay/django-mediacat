/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('./bem-cx');
var ThemeMixin = require('./theme-mixin');


var ButtonGroup = React.createClass({
	mixins: [ThemeMixin, PureRenderMixin],

  render: function() {
    var classes = {
      'button-group': true
    };
    var theme = this.getTheme();

    return (
      <div className={cx(classes, 'mediacat', theme)}>{this.props.children}</div>
    );
  }
});

module.exports = ButtonGroup;
