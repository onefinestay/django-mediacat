/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;
var ThemeMixin = require('./theme-mixin');


var Toolbar = React.createClass({
  mixins: [ThemeMixin, PureRenderMixin],

  getInitialState: function() {
    return {
      open: true
    };
  },

  render: function() {
    var classes = {
      'mediacat-toolbar': true
    };
    classes['mediacat-toolbar--theme-' + this.getTheme()] = true;

    return (
      <div className={cx(classes)}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Toolbar;