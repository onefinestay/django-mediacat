var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('../../bem-cx');

var ThemeMixin = require('../../mixins/theme-mixin');


var ToolbarTitle = React.createClass({
	mixins: [ThemeMixin, PureRenderMixin],

  render: function() {
    var classes = {
      'toolbar__title': true
    };
    var theme = this.getTheme();

    return (
      <div className={cx(classes, {theme})}>{this.props.children}</div>
    );
  }
});

module.exports = ToolbarTitle;
