var React = require('react');

var { themes, defaultTheme } =  require('../themes');


var ThemeMixin = {
  propTypes: {
    theme: React.PropTypes.oneOf(themes)
  },

  contextTypes: {
    theme: React.PropTypes.oneOf(themes)
  },

  childContextTypes: {
    theme: React.PropTypes.oneOf(themes)
  },

  getChildContext: function() {
    console.log(this.getTheme());


    return {
      theme: this.getTheme()
    };
  },

  getTheme: function() {
    if (this.props.theme) {
      return this.props.theme;
    }
    if (this.context.theme) {
      return this.context.theme;
    }
    return defaultTheme;
  }
};

module.exports = ThemeMixin;