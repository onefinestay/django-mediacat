var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('./bem-cx');
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var List = require('./common/list');
var FluxMixin = require('./mixins/flux-mixin');


var InformationSection = require('./information-section');
var Crop = require('./crop');


var CropList = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media", "Crops")],

  getStateFromFlux: function() {
    var selectedMedia = this.getFlux().store('Media').getSelectedMedia();

    return {
      media: selectedMedia
    };
  },

  render: function() {
    var media = this.state.media;

    var crops = this.props.crops.map(function(crop) {
      return <Crop key={crop.get('uuid')} x1={crop.get('x1')} x2={crop.get('x2')} y1={crop.get('y1')} y2={crop.get('y2')} crop={crop} media={media} />;
    });

    return (
      <List>{crops.toJS()}</List>
    );
  }
});

module.exports = CropList;