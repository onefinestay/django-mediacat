
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Toolbar = require('./common/toolbar');

var FluxMixin = require('./mixins/flux-mixin');
var ThemeMixin = require('./mixins/theme-mixin');

var Search = require('./search');
var UploadButton = require('./upload-button');
var CategoryTree = require('./category-tree');
var Uploads = require('./uploads');


var NavigationToolbar = React.createClass({
  mixins: [ThemeMixin, PureRenderMixin],

  render: function() {
    return (
      <Toolbar.Toolbar>
        <UploadButton />
        <Toolbar.Spacer />
      </Toolbar.Toolbar>
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