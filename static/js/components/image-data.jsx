var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var moment = require('moment');

var Panel = require('./common/panel');
var Toolbar = require('./common/toolbar');

var ThemeMixin = require('./mixins/theme-mixin');
var FluxMixin = require('./mixins/flux-mixin');

var Rating = require('./rating');
var InformationSection = require('./information-section');

var AssociationList = require('./association-list');


var ImageDataToolbar = React.createClass({
  mixins: [ThemeMixin, PureRenderMixin],

  render: function() {
    return (
      <Toolbar.Toolbar>
      	<Toolbar.Title>Image Information</Toolbar.Title>
      </Toolbar.Toolbar>
    );
  }
});


var ImageDataPanel = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media")],

  getStateFromFlux: function() {
    var store = this.getFlux().store('Media');
    var selected = store.getSelectedMedia();

    return {
      media: selected
    };
  },

  render: function() {
    var media = this.state.media;
    var size;

    if (media && media.get('width') && media.get('height')) {
      size = media.get('width') + ' × ' + media.get('height');
    }


    return (
      <Panel fill={true} className="mediacat-information-panel">
        <InformationSection heading="Image Information">
          <table className="mediacat-table mediacat-table--simple">
            <tr>
              <th scope="row">Size</th>
              <td>{size}</td>
            </tr>
            <tr>
              <th scope="row">Created</th>
              <td>{media && moment(media.get('date_created')).format('LLL')}</td>
            </tr>
            <tr>
              <th scope="row">Rating</th>
              <td>{media ? <Rating size="large" media={media} /> : null}</td>
            </tr>
          </table>
        </InformationSection>
        <InformationSection heading="Associations">
          <AssociationList />
        </InformationSection>
      </Panel>
    );
  }
});

module.exports = ImageDataPanel;