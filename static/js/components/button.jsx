/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;

var Icon = require('./icon');


var Button = React.createClass({
	mixins: [PureRenderMixin],

  propTypes: {
    glyph: React.PropTypes.string,
    active: React.PropTypes.bool.isRequired,
    disabled: React.PropTypes.bool.isRequired,
    placement: React.PropTypes.oneOf([
      'header', 
      'panel'
    ]).isRequired,
  },

	getDefaultProps: function() {
		return {
			glyph: null,
			caption: null,
      active: false,
      disabled: false,
      placement: 'header'
		};
	},

  render: function() {
    var {glyph, active, disabled, children, placement, ...other} = this.props;

    var classes = {
      'mediacat-button': true,
      'mediacat-button--active': active,
      'mediacat-button--disabled': disabled,
    };

    if (placement) {
      classes['mediacat-button--' + placement] = true;
      classes['mediacat-button--' + placement + '--active'] = active;
      classes['mediacat-button--' + placement + '--disabled'] = disabled;
    }

    return this.transferPropsTo(
      <button onClick={other.onClick} disabled={disabled} className={cx(classes)}>
        {glyph ? <Icon glyph={glyph} size={placement === 'header' ? 'large' : null} /> : null}
        {children ? <span className="mediacat-button__caption">{children}</span> : null}
      </button>    
    );
  }
});

module.exports = Button;
