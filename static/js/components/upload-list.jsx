/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var CategoryTree = require('./category-tree');
var FluxMixin = require('./flux-mixin');
var ProxyImg = require('./proxy-img');


var Upload = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Uploads")],

  select: function(event) {
    event.preventDefault();
    //this.getFlux().actions.uplo.select(this.props.thumbnail);
  },

  getStateFromFlux: function() {
    //var store = this.getFlux().store('Uploads');
    //var selected = falsestore.getSelectedUpload();

    return {
      selected: false //selected && this.props.upload.get('id') === selected.get('id')
    };
  },

  render: function() {
    var upload = this.props.upload;

    var classes = {
      'mediacat-upload': true,
      'mediacat-upload-selected': this.state.selected
    };

    var caption;

    if (!upload.get('complete')) {
      if (upload.get('progress') === 100) {
        caption = 'Processing';
      } else {
        caption = 'Uploading';
      }
    } else {
      capation = 'Complete';
    }

    return (
      <li className="mediacat-list__item mediacat-list__item--upload">
        <div className={cx(classes)}>
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