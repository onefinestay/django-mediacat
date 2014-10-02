/** @jsx React.DOM */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var FluxMixin = require('./flux-mixin');

var PickButton = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Crops", "Media")],

  getStateFromFlux: function() {
    var crop = this.getFlux().store('Crops').getSelectedCrop();
    var selectOptions = this.getFlux().store('Crops').state.get('select');    
    var pickable = false;

    var ratio;
    var width;
    var selectCrops;

    if (crop && !crop.get('changed') && selectOptions) {
      ratio = crop.get('key');
      width = crop.get('x2') - crop.get('x1');

      selectCrops = selectOptions.get('crops');

      selectCrops.forEach(function(c) {
        if (c.get('key') === ratio && width >= c.get('width')) {
          pickable = true;
        }
      });
    }

    return {
      crop: crop,
      previewWidth: selectOptions && selectOptions.get('previewWidth'),
      pickable: pickable
    };
  },  

  handleClick: function(event) {
    this.getFlux().actions.crop.pick(this.state.crop, this.state.previewWidth);
  },

  handleChange: function(event) {
    event.preventDefault();
    var files = this.refs.upload.getDOMNode().files;
    
    if (files.length) {
      for (var i = 0; i < files.length; i++) {
        this.getFlux().actions.uploads.add(files[i], this.state.category);
      }
    }
  },

  render: function() {
    var classes = {
      'button': true,
      'icon': true,
      'icon-tick': true,
      'disabled': !this.state.pickable
    };

    return (
      <button disabled={!this.state.pickable} className={cx(classes)} onClick={this.handleClick} />
    );
  }
});

module.exports = PickButton;