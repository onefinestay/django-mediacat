/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var FluxMixin = require('./flux-mixin');
var ThemeMixin = require('./theme-mixin');

var Search = require('./search');
var UploadButton = require('./upload-button');
var CategoryTree = require('./category-tree');
var Uploads = require('./uploads');

var Toolbar = require('./toolbar');
var ToolbarSeparator = require('./toolbar-separator');


var NavigationToolbar = React.createClass({
  mixins: [ThemeMixin, PureRenderMixin],

  render: function() {
    return (
      <Toolbar>
        <UploadButton />
        <ToolbarSeparator />
        <Search />
      </Toolbar>
    );
  }
});


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
        <NavigationToolbar theme="white-on-teal" />
        <CategoryTree />
        {true ? <Uploads /> : null}
      </div>
    );
  }
});

module.exports = Navigation;