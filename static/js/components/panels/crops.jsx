/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var FluxMixin = require('../flux-mixin');

var CropList = require('../crop-list');
var Panel = require('../panel');
var PanelToolbar = require('../panel-toolbar');
var Select  = require('../select');

var CropsPanel = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media")],

  getStateFromFlux: function() {
    var store = this.getFlux().store('Media');

    return {
      availableCrops: store.state.get('availableCrops')
    };
  },
  
  render: function() {
  	var options = this.state.availableCrops.map(function(config, key) {
  		return <option value={key}>{config.get(0)}</option>;
	  });

  	var toolbar = (
  		<PanelToolbar>
      	<select>{options.toJS()}</select>
      	<span className="separator" />
      	<button>Add</button>
      </PanelToolbar>
  	);

    return (
      <Panel className="mediacat-crops-panel" toolbar={toolbar}>
        <CropList />
      </Panel>
    );
  }
});

module.exports = CropsPanel;