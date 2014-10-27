var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('../bem-cx');

var Icon = require('./icon');

var ThemeMixin = require('../mixins/theme-mixin');


var Action = React.createClass({
	mixins: [ThemeMixin, PureRenderMixin],

  propTypes: {
    glyph: React.PropTypes.string,
    active: React.PropTypes.bool.isRequired,
    fill: React.PropTypes.bool.isRequired,
    disabled: React.PropTypes.bool.isRequired
  },

	getDefaultProps: function() {
		return {
			glyph: null,
			caption: null,
      fill: false,
      active: false,
      disabled: false
		};
	},

  onClick: function(event) {
    event.stopPropagation();
    if (!this.props.disabled && this.props.onClick) {
      this.props.onClick(event);
    }
  },

  render: function() {
    var {glyph, active, fill, disabled, children, ...other} = this.props;

    var classes = {
      'action': true,
      'action--fill': fill
    };

    var states = { active, disabled };

    return (
      <div {...other} onClick={this.onClick} disabled={disabled} className={cx(classes, {states})}>
        {glyph ? <Icon glyph={glyph} size="medium" /> : null}
        {children ? <span className="mediacat-action__caption">{children}</span> : null}
      </div>
    );
  }
});

module.exports = Action;
