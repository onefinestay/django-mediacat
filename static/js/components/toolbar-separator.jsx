/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('./bem-cx');

var ThemeMixin = require('./theme-mixin');


var ToolbarSeparator = React.createClass({
	mixins: [ThemeMixin, PureRenderMixin],

  render: function() {
    var classes = {
      'toolbar__separator': true
    };
    var theme = this.getTheme();

    return (
      <div className={cx(classes, {theme})} />
    );
  }
});

module.exports = ToolbarSeparator;
