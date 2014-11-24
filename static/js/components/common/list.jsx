var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('../bem-cx');


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
      'list': true,
      'list--horizontal': this.props.type === 'horizontal',
      'list--grid': this.props.type === 'grid',
      'list--vertical': this.props.type === 'vertical'
    };

    var childClasses = {
      'list__item': true,
      'list__item--horizontal': this.props.type === 'horizontal',
      'list__item--grid': this.props.type === 'grid',
      'list__item--vertical': this.props.type === 'vertical'
    }

    var children = this.props.children.map(child => <li key={child.key} className={cx(childClasses)}>{child}</li>);

    return (
      <ul className={cx(classes)}>{children}</ul>
    );
  }
});

module.exports = List;
