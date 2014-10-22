var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var FluxMixin = require('./mixins/flux-mixin');
var Button = require('./common/button');

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

  handleClick: function() {
    this.getFlux().actions.crop.pick(this.state.crop, this.state.previewWidth);
  },

  render: function() {
    return (
      <Button disabled={!this.state.pickable} onClick={this.handleClick} glyph="tick" />
    );
  }
});

module.exports = PickButton;