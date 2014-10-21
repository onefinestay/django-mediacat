/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('./bem-cx');
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var FluxMixin = require('./flux-mixin');


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

    var caption;

    if (!upload.get('complete')) {
      if (upload.get('progress') === 100) {
        caption = 'Processing';
      } else {
        caption = 'Uploading';
      }
    } else {
      caption = 'Complete';
    }

    return (
      <li className="mediacat-list__item mediacat-list__item--upload">
        <div className={cx(classes, {states})}>
          {upload.get('file').name} - {upload.get('progress')}% - {caption}
        </div>
      </li>
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
      <ul className="mediacat-list mediacat-list--uploads">
        {uploads.toJS()}
      </ul>
    );
  }
});

module.exports = UploadList;