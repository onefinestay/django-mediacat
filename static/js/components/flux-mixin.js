var React = require('react');

var FluxMixin = {
  propTypes: {
    flux: React.PropTypes.object
  },

  contextTypes: {
    flux: React.PropTypes.object
  },

  childContextTypes: {
    flux: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      flux: this.getFlux()
    };
  },

  getFlux: function() {
    return this.props.flux || this.context.flux;
  }
};

module.exports = FluxMixin;