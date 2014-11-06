var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var moment = require('moment');

var Panel = require('./common/panel');
var Toolbar = require('./common/toolbar');
var Button = require('./common/button');

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
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media", "Crops")],

  getStateFromFlux: function() {
    var store = this.getFlux().store('Media');
    var selected = store.getSelectedMedia();
    var crops = null;

    if (selected) {
      crops = this.getFlux().store('Crops').state.get('crops');
    }

    return {
      media: selected,
      crops: crops
    };
  },

  delete: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.getFlux().actions.media.delete(this.state.media);
  },

  render: function() {
    var media = this.state.media;
    var size;

    if (media && media.get('width') && media.get('height')) {
      size = media.get('width') + ' × ' + media.get('height');
    }

    var canDelete = this.state.crops !== null && this.state.crops.count() === 0;
    var deleteMsg = '';

    if (!canDelete && this.state.media) {
      deleteMsg =  'Delete all crops first';
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
            <tr>
              <th csope="row">Delete</th>
              <td>{canDelete ? <Button onClick={this.delete} action="danger" theme="dark-grey" glyphSize="large" glyph="hairline-delete" disabled={!canDelete}>Delete Image</Button> : deleteMsg}</td>
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