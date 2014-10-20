/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var cx = React.addons.classSet;
var PureRenderMixin = require('react').addons.PureRenderMixin;

var LinearLoader = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    var classes = {
      'mediacat-linearloader': true,
      'mediacat-linearloader--small': this.props.size === 'small',
      'mediacat-linearloader--medium': this.props.size === 'medium',
      'mediacat-linearloader--tiny': this.props.size === 'tiny'
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