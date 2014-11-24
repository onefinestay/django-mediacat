var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('../bem-cx');


var ActionBar = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    var classes = {
      'action-bar': true,
    };

    var states = {};

    return (
      <div className={cx(classes, {states})}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = ActionBar;