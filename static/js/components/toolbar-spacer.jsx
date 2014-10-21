/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;

var ThemeMixin = require('./theme-mixin');


var ToolbarSpacer = React.createClass({
	mixins: [ThemeMixin, PureRenderMixin],

  render: function() {
    var classes = {
      'mediacat-toolbar__spacer': true
    };

    var theme = this.getTheme();
    classes['mediacat-toolbar__spacer--theme-' + theme] = true;

    return (
      <div className={cx(classes)} />
    );
  }
});

module.exports = ToolbarSpacer;
