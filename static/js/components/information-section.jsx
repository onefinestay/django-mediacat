var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;


var InformationSection = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    return (
      <div className="mediacat-information-section">
        <div className="mediacat-information-section__heading">{this.props.heading}</div>
        <div className="mediacat-information-section__content">{this.props.children}</div>
      </div>
    );
  }
});

module.exports = InformationSection;