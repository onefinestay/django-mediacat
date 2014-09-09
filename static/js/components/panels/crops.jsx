/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var FluxMixin = require('../flux-mixin');
var Immutable = require('immutable');

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

  getInitialState: function() {
    return {
      cropChoice: null
    };
  },

  setCropChoice: function(option) {
    this.setState({
      cropChoice: option.get('value')
    });
  },

  handleAdd: function(event) {
  	var cropType = this.state.cropChoice;
  	this.getFlux().actions.crop.add(this.state.media, cropType);
  },
  
  render: function() {
    var options = Immutable.Vector();

  	this.state.availableCrops.forEach(function(config, key) {
  		options = options.push(Immutable.Map({value: key, label: config.get(0)}));
	  });

    var disabled = this.state.media ? false : true;

  	var toolbar = (
  		<PanelToolbar>
      	<Select disabled={disabled} ref="cropType" options={options} onSelect={this.setCropChoice} />
      	<span className="separator" />
      	<button disabled={disabled} onClick={this.handleAdd}><span className="icon icon-add" /></button>
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