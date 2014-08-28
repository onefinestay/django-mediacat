/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;

var UploadList = require('./upload-list');


var Uploads = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    return {
      open: true
    };
  },

  render: function() {
    var classes = {
      'mediacat-panel': true,
      'mediacat-uploads': true,
      'mediacat-panel-open': this.state.open,
    };

    return (
      <div className={cx(classes)}>
        <div className="mediacat-uploads-header mediacat-panel-header toolbar">
          Uploads
          <span className="spacer" />
          <button className="mediacat-panel-state"><span className="icon icon-arrow" /></button>
          </div>
        <UploadList />
      </div>
    );
  }
});

module.exports = Uploads;