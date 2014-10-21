/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;

var ThemeMixin = require('./theme-mixin');


var ToolbarTitle = React.createClass({
	mixins: [ThemeMixin, PureRenderMixin],

  render: function() {
    var classes = {
      'mediacat-toolbar__title': true
    };

    var theme = this.getTheme();
    classes['mediacat-toolbar__title--theme-' + theme] = true;

    return (
      <div className={cx(classes)}>{this.props.children}</div>
    );
  }
});

module.exports = ToolbarTitle;
