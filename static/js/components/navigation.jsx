/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var FluxMixin = require('./flux-mixin');

var Search = require('./search');
var UploadButton = require('./upload-button');
var CategoryTree = require('./category-tree');
var Toolbar = require('./toolbar');
var Uploads = require('./uploads');


var Navigation = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Uploads")],

  getStateFromFlux: function() {
    return {
      hasUploads: this.getFlux().store('Uploads').state.get('uploads').length > 0
    };
  },
  
  render: function() {
    return (
      <div className="mediacat-navigation mediacat-column mediacat-column--sidebar">
        <Toolbar theme="column">
          <UploadButton />
          <div className="mediacat-toolbar__separator" />
          <Search />
        </Toolbar>
        <CategoryTree />
        {this.state.hasUploads ? <Uploads /> : null}
      </div>
    );
  }
});

module.exports = Navigation;