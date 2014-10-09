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
var Toolbar = require('../toolbar');
var Select  = require('../select');
var Button = require('../button');
var Icon = require('../icon');

var CropSearchResult = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Crops")],

  propTypes: {
    disabled: React.PropTypes.bool,
    selected: React.PropTypes.bool,
    onHover: React.PropTypes.func.isRequired,
    onClick: React.PropTypes.func.isRequired,
    label: React.PropTypes.string.isRequired,
    option: React.PropTypes.object.isRequired,
    tokens: React.PropTypes.array.isRequired,
  },

  getStateFromFlux: function() {
    var selectOptions = this.getFlux().store('Crops').state.get('select');
    var valid = false;

    if (selectOptions) {
      if (selectOptions.get('crops').find(c => c.get('key') === this.props.option.get('value'))) {
        valid = true;
      }
    }

    return {
      valid: valid
    };
  },  

  render: function() {
    var classes = cx({
      'mediacat-select__option': true,
      'mediacat-is-selected': !!this.props.selected
    });

    return (
      <li className={classes}
        onMouseEnter={this.props.onHover.bind(null, this.props.option)}
        onMouseDown={this.props.onClick.bind(null, this.props.option)}>
        {this.props.label}
        {this.state.valid ? <Icon glyph="tick" /> : null}
      </li>
    );
  }
});


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
    this.refs.addButton.getDOMNode().focus();
  },
  
  render: function() {
    var options = Immutable.Vector();

  	this.state.availableCrops.forEach(function(config, key) {
  		options = options.push(Immutable.Map({value: key, label: config.get(0)}));
	  });

    var disabled = this.state.media ? false : true;

  	var toolbar = (
  		<Toolbar theme="panel">
      	<Select fillWidth={true} resultRenderer={CropSearchResult} disabled={disabled} ref="cropType" options={options} onSelect={this.setCropChoice} placeholder="Select a crop to add" />
      	<span className="separator" />
      	<Button glyph="add" placement="panel" disabled={disabled || !this.state.cropChoice} onClick={this.handleAdd} ref="addButton" />
      </Toolbar>
  	);

    return (
      <Panel className="mediacat-crops-panel" toolbar={toolbar}>
        <CropList />
      </Panel>
    );
  }
});

module.exports = CropsPanel;