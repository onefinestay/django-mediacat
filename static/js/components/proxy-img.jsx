/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;

var ProxyImg = React.createClass({
  mixins: [PureRenderMixin],
  
  render: function() {
    var src = this.props.src;

    var style = {
      'background-size': 'contain',
      'background-position': '50% 50%',
      'background-image': `url('${ src }')`,
      'background-repeat': 'no-repeat'
    };

  	return (
  		<div className="proxy-image" style={style}>
        <img src={src} />
      </div>
  	);
  }
});

module.exports = ProxyImg;