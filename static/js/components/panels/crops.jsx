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
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media", "Crops")],

  getStateFromFlux: function() {
    var selectedMedia = this.getFlux().store('Media').getSelectedMedia();
    var availableCrops = this.getFlux().store('Crops').state.get('availableCrops');

    return {
      media: selectedMedia,      
      availableCrops: availableCrops
    };
  },

  handleAdd: function(event) {
  	var cropType = this.refs.cropType.getDOMNode().value;
  	this.getFlux().actions.crop.add(this.state.media, cropType);
  },
  
  render: function() {
  	var options = this.state.availableCrops.map(function(config, key) {
  		return <option value={key}>{config.get(0)}</option>;
	  });

    var disabled = this.state.media ? false : true;

  	var toolbar = (
  		<PanelToolbar>
      	<select disabled={disabled} ref="cropType">{options.toJS()}</select>
      	<span className="separator" />
      	<button disabled={disabled} onClick={this.handleAdd}>Add</button>
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