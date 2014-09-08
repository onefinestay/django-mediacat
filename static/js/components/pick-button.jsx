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
    var selectOptions = this.getFlux().store('Media').state.get('select');    
    var pickable = false;

    var ratio;
    var width;
    var selectWidth;
    var selectRatios;

    if (crop && !crop.get('changed') && selectOptions) {
      ratio = crop.get('key');
      width = crop.get('x2') - crop.get('x1');

      selectRatios = selectOptions.get('ratios');
      selectWidth = selectOptions.get('width');

      if (selectRatios.contains(ratio) && width >= selectWidth) {
        pickable = true;
      }
    }

    return {
      pickable: pickable
    };
  },  

  handleClick: function(event) {
    event.preventDefault();
    this.refs.upload.getDOMNode().click();
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
      <button className={cx(classes)} />
    );
  }
});

module.exports = PickButton;