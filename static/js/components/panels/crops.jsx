/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('../bem-cx');
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var FluxMixin = require('../flux-mixin');
var Immutable = require('immutable');
var ThemeMixin = require('../theme-mixin');

var CropList = require('../crop-list');
var Panel = require('../panel');
var Toolbar = require('../toolbar');
var ToolbarSeparator = require('../toolbar-separator');

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
    var classes = {
      'select__option': true
    };

    var states = {
      'selected': !!this.props.selected
    }

    return (
      <li className={cx(classes, {states})}
        onMouseEnter={this.props.onHover.bind(null, this.props.option)}
        onMouseDown={this.props.onClick.bind(null, this.props.option)}>
        {this.props.label}
        {this.state.valid ? <Icon glyph="tick" /> : null}
      </li>
    );
  }
});


var CropsToolbar = React.createClass({
  mixins: [ThemeMixin, PureRenderMixin, FluxMixin, StoreWatchMixin("Media", "Crops")],

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

  handleAdd: function() {
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

    return (
      <Toolbar>
      	<Select fillWidth={true} resultRenderer={CropSearchResult} disabled={disabled} ref="cropType" options={options} onSelect={this.setCropChoice} placeholder="Select a crop to add" />
      	<ToolbarSeparator />
      	<Button theme="dark-grey" glyph="add" disabled={disabled || !this.state.cropChoice} onClick={this.handleAdd} ref="addButton" />
      </Toolbar>
    );
  }
});


var CropsPanel = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    return (
      <Panel fill={true} className="mediacat-crops-panel" toolbar={<CropsToolbar theme="dark-grey" />}>
        <CropList />
      </Panel>
    );
  }
});

module.exports = CropsPanel;