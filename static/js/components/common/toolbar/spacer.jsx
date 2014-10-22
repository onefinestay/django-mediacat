var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('../../bem-cx');

var ThemeMixin = require('../../mixins/theme-mixin');


var ToolbarSpacer = React.createClass({
	mixins: [ThemeMixin, PureRenderMixin],

  render: function() {
    var classes = {
      'toolbar__spacer': true
    };
    var theme = this.getTheme();

    return (
      <div className={cx(classes, {theme})} />
    );
  }
});

module.exports = ToolbarSpacer;
