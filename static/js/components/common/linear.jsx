var React = require('react/addons');
var cx = require('../bem-cx');
var PureRenderMixin = require('react').addons.PureRenderMixin;

var LinearLoader = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    var classes = {
      'linearloader': true,
      'linearloader--small': this.props.size === 'small',
      'linearloader--medium': this.props.size === 'medium',
      'linearloader--tiny': this.props.size === 'tiny'
    };

    return (
      <div className={cx(classes)}>
        <div className="mediacat-linearloader__circle mediacat-linearloader__circle--a"></div>
        <div className="mediacat-linearloader__circle mediacat-linearloader__circle--b"></div>
        <div className="mediacat-linearloader__circle mediacat-linearloader__circle--c"></div>
      </div>
    );
  }
});

module.exports = LinearLoader;