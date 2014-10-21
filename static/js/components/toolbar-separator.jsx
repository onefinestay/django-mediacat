/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;

var ThemeMixin = require('./theme-mixin');


var ToolbarSeparator = React.createClass({
	mixins: [ThemeMixin, PureRenderMixin],

  render: function() {
    var classes = {
      'mediacat-toolbar__separator': true
    };

    var theme = this.getTheme();
    classes['mediacat-toolbar__separator--theme-' + theme] = true;

    return (
      <div className={cx(classes)} />
    );
  }
});

module.exports = ToolbarSeparator;
