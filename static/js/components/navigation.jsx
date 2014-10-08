/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var FluxMixin = require('./flux-mixin');

var Header = require('./header');
var Search = require('./search');
var UploadButton = require('./upload-button');
var CategoryTree = require('./category-tree');

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
        <div className="toolbar">
          <UploadButton />
          <div className="separator" />
          <Search />
        </div>
        <CategoryTree />
        {this.state.hasUploads ? <Uploads /> : null}
      </div>
    );
  }
});

module.exports = Navigation;