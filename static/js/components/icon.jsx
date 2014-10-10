/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;


var Icon = React.createClass({
	mixins: [PureRenderMixin],

	propTypes: {
		glyph: React.PropTypes.string.isRequired,
		size: React.PropTypes.oneOf(['large', 'small'])
	},

	getDefaultProps: function() {
		return {
			glyph: 'add',
			size: 'small'
		};
	},

  render: function() {
  	var { glyph, size, ...other } = this.props;

  	var classes = {
  		'mediacat-icon': true,
  	}

  	classes['mediacat-icon--' + glyph] = true;

  	if (size) {
  		classes['mediacat-icon--' + size] = true;	
  	}
  	
		return this.transferPropsTo(
			<span className={cx(classes)} />
		);
  }
});

module.exports = Icon;
