var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('../bem-cx');

var Icon = require('./icon');

var ThemeMixin = require('../mixins/theme-mixin');


var Button = React.createClass({
	mixins: [ThemeMixin, PureRenderMixin],

  propTypes: {
    glyphSize: React.PropTypes.string,
    action: React.PropTypes.string,
    glyph: React.PropTypes.string,
    active: React.PropTypes.bool.isRequired,
    disabled: React.PropTypes.bool.isRequired
  },

	getDefaultProps: function() {
		return {
      glyphSize: null,
      action: null,
			glyph: null,
			caption: null,
      active: false,
      disabled: false
		};
	},

  render: function() {
    var {glyph, active, disabled, children, ...other} = this.props;

    var classes = {
      'button': true,
    };
    if (this.props.action) {
      classes['button--action-' + this.props.action] = true;
    }

    var states = { active, disabled };
    var theme = this.getTheme();

    var glyphSize = theme === 'white-on-teal' || this.props.glyphSize === 'large' ? 'large' : 'small';

    return (
      <button {...other} onClick={other.onClick} disabled={disabled} className={cx(classes, {theme, states})}>
        {glyph ? <Icon glyph={glyph} size={glyphSize} /> : null}
        {children ? <span className="mediacat-button__caption">{children}</span> : null}
      </button>    
    );
  }
});

module.exports = Button;
