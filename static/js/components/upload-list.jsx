var truncate = require('truncate');

var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('./bem-cx');
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var List = require('./common/list');
var ProgressBar = require('./common/progress-bar');
var FluxMixin = require('./mixins/flux-mixin');


var Upload = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Uploads")],

  select: function(event) {
    event.preventDefault();
  },

  getStateFromFlux: function() {
    return {
      selected: false
    };
  },

  render: function() {
    var upload = this.props.upload;

    var classes = {
      'upload': true
    };

    var states = {
      'selected': this.state.selected
    };

    var status;

    if (!upload.get('complete')) {
      if (upload.get('progress') === 100) {
        status = 'Processing';
      } else {
        status = 'Uploading';
      }
    } else {
      status = 'Complete';
    }

    return (
      <div className={cx(classes, {states})}>
        <div className="mediacat-upload__name">{truncate(upload.get('file').name, 20)}</div>
        <div className="mediacat-upload__status">{status}</div>
        <ProgressBar progress={upload.get('progress')} />
      </div>
    );
  }
});


var UploadList = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Uploads")],

  getStateFromFlux: function() {
    return {
      uploads: this.getFlux().store('Uploads').state.get('uploads')
    };
  },

  render: function() {
    var uploads = this.state.uploads.map(upload => <Upload key={upload.get('id')} upload={upload} />);

    return (
      <List>{uploads.toJS()}</List>
    );
  }
});

module.exports = UploadList;