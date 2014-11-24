var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;

var cx = require('../bem-cx');


var Icon = React.createClass({
	mixins: [PureRenderMixin],

	propTypes: {
		glyph: React.PropTypes.string.isRequired,
		size: React.PropTypes.oneOf(['large', 'medium', 'small'])
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
  		'icon': true,
  	}

  	classes['icon--' + glyph] = true;

  	if (size) {
  		classes['icon--' + size] = true;
  	}
  	
		return (
			<span {...other} className={cx(classes)} />
		);
  }
});

module.exports = Icon;
