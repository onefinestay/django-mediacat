var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('./bem-cx');
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Icon = require('./common/icon');
var List = require('./common/list');
var FluxMixin = require('./mixins/flux-mixin');


var Association = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    var association = this.props.association;

    return (
      <div className="mediacat-association">
        <div className="mediacat-association__info">
          <div className="mediacat-association__label">{association.get('object_label')}</div>
          <div className="mediacat-association__type">{association.get('content_type_label')}</div>
        </div>
        <div className="mediacat-association__actions">
          <div className="mediacat-association__is_canonical">{association.get('canonical') ? <Icon glyph="tick" size="large" /> : null}</div>
        </div>
      </div>
    );
  }
});


var AssociationList = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media", "Associations")],

  getStateFromFlux: function() {
    var selectedMedia = this.getFlux().store('Media').getSelectedMedia();
    var associations;

    if (selectedMedia) {
      associations = this.getFlux().store('Associations').state.get('associations');
    }

    return {
      media: selectedMedia,
      associations: associations
    };
  },

  render: function() {
    var media = this.state.media;

    if (!media || !this.state.associations) {
      return null;
    }

    var associations = this.state.associations
      .map((a, i) => <Association key={a.get('id')} association={a} />);

    return (
      <div className="mediacat-associations">
        <List type='vertical'>
          {associations.toJS()}
        </List>
      </div>
    );
  }
});

module.exports = AssociationList;