var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('../../bem-cx');
var ThemeMixin = require('../../mixins/theme-mixin');


var Toolbar = React.createClass({
  mixins: [ThemeMixin, PureRenderMixin],

  getInitialState: function() {
    return {
      open: true
    };
  },

  render: function() {
    var classes = {
      'toolbar': true
    };
    var theme = this.getTheme();

    return (
      <div className={cx(classes, {theme})}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Toolbar;