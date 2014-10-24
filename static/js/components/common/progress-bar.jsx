var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('../bem-cx');


var ProgressBar = React.createClass({
	mixins: [PureRenderMixin],

  propTypes: {
    progress: React.PropTypes.number.isRequired
  },

  getDefaultProps: function() {
    return {
      progress: 0
    };
  },

  render: function() {
    var classes = {
      'progress-bar': true,
    };

    var progressClasses = {
      'progress-bar__progress': true,
    };

    var states = {
      'complete': this.props.progress <= 100
    };

    var style = {
      'width': Math.round(this.props.progress) + '%'
    };

    return (
      <div className={cx(classes, {states})}>
        <div className={cx(progressClasses, {states})} style={style} />
      </div>
    );
  }
});

module.exports = ProgressBar;
