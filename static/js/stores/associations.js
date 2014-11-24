 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');

var constants = require('../constants');
var uuid = require('uuid-v4');


var AssociationStore = Fluxxor.createStore({
  initialize: function(options) {
    this.bindActions(
      constants.MEDIA_SELECTED, this.onMediaSelect,
      constants.ASSOCIATION_GET_START, this.onAssociationGetStart,
      constants.ASSOCIATION_GET_SUCCESS, this.onAssociationGetSuccess
    );
    this.setMaxListeners(0);
    this.state = Immutable.fromJS(options);
  },

  onAssociationGetStart: function(payload) {
    var request = payload.request;
    var requests = this.state.get('fetchRequests');

    if (!requests) {
      requests = Immutable.Map();
    }
    requests = requests.set(payload.media.get('id'), request);
    this.state = this.state.set('fetchRequests', requests);
    this.emit('change');
  },

  onAssociationGetSuccess: function(payload) {
    var associations = Immutable.fromJS(payload.data);

    var requests = this.state.get('fetchRequests');
    requests = requests.delete(payload.mediaId);
    this.state = this.state.set('fetchRequests', requests);

    if (payload.mediaId === this.flux.stores['Media'].state.get('selectedMedia')) {
      this.state = this.state.set('associations', associations);
    }
    this.emit('change');
  },

  onMediaSelect: function() {
    this.state = this.state.withMutations(function(state) {
      state
        .set('associations', null)
        .set('selectedAssociation', null)
    });
    this.emit('change');
  }
});

module.exports = AssociationStore;