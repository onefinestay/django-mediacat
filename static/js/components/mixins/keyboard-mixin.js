var React = require('react');

var KeyboardMixin = {
  propTypes: {
    keyboard: React.PropTypes.object
  },

  contextTypes: {
    keyboard: React.PropTypes.object
  },

  childContextTypes: {
    keyboard: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      keyboard: this.getKeyboard()
    };
  },

  getKeyboard: function() {
    return this.props.keyboard || this.context.keyboard;
  }
};

module.exports = KeyboardMixin;