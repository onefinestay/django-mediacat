var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('./bem-cx');

var Icon = require('./icon');

var ThemeMixin = require('./theme-mixin');


var Button = React.createClass({
	mixins: [ThemeMixin, PureRenderMixin],

  propTypes: {
    glyph: React.PropTypes.string,
    active: React.PropTypes.bool.isRequired,
    disabled: React.PropTypes.bool.isRequired
  },

	getDefaultProps: function() {
		return {
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

    var states = { active, disabled };
    var theme = this.getTheme();

    return (
      <button {...other} onClick={other.onClick} disabled={disabled} className={cx(classes, {theme, states})}>
        {glyph ? <Icon glyph={glyph} size={theme === 'white-on-teal' ? 'large' : 'small'} /> : null}
        {children ? <span className="mediacat-button__caption">{children}</span> : null}
      </button>    
    );
  }
});

module.exports = Button;
