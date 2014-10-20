/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;


var List = React.createClass({
	mixins: [PureRenderMixin],

  propTypes: {
    type: React.PropTypes.oneOf(['horizontal', 'vertical', 'grid']).isRequired
  },

  getDefaultProps: function() {
    return {
      type: 'vertical'
    };
  },

  render: function() {
    var classes = {
      'mediacat-list': true,
      'mediacat-list--horizontal': this.props.type === 'horizontal',
      'mediacat-list--grid': this.props.type === 'grid',
      'mediacat-list--vertical': this.props.type === 'vertical'
    };

    var childClasses = {
      'mediacat-list__item': true,
      'mediacat-list__item--horizontal': this.props.type === 'horizontal',
      'mediacat-list__item--grid': this.props.type === 'grid',
      'mediacat-list__item--vertical': this.props.type === 'vertical'
    }

    var children = this.props.children.map(child => <li className={cx(childClasses)}>{child}</li>);

    return (
      <ul className={cx(classes)}>{children}</ul>
    );
  }
});

module.exports = List;
