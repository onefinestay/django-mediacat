var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('./bem-cx');
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var FluxMixin = require('./mixins/flux-mixin');

var Crop = require('./crop');


var CropGroup = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media", "Crops")],

  getStateFromFlux: function() {
    var availableCrops = this.getFlux().store('Crops').state.get('availableCrops');
    var selectedMedia = this.getFlux().store('Media').getSelectedMedia();

    return {
      media: selectedMedia,
      availableCrops: availableCrops
    };
  },

  render: function() {
    var media = this.state.media;
    var crops = this.props.crops.map(crop => <Crop key={crop.get('uuid')} x1={crop.get('x1')} x2={crop.get('x2')} y1={crop.get('y1')} y2={crop.get('y2')} crop={crop} media={media} />);

    return (
      <li className="mediacat-crop-group mediacat-list__item mediacat-list__item--crop-group">
        <div className="mediacat-crop-group__header">
          {this.state.availableCrops.get(this.props.cropKey).get(0)}
        </div>
        <ul className="mediacat-list mediacat-list--crops">
          {crops.toJS()}
        </ul>
      </li>
    );
  }
});


var CropList = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media", "Crops")],

  getStateFromFlux: function() {
    var selectedMedia = this.getFlux().store('Media').getSelectedMedia();
    var crops;

    if (selectedMedia) {
      crops = this.getFlux().store('Crops').state.get('crops');
    }

    return {
      media: selectedMedia,
      crops: crops
    };
  },

  render: function() {
    var media = this.state.media;    
    var cropGroups;

    if (!media || !this.state.crops) {
      return null;
    }

    cropGroups = this.state.crops
      .groupBy(crop => crop.get('key'))
      .map((crops, key) => <CropGroup key={key} cropKey={key} crops={crops} />);

    return (
      <ul className="mediacat-list mediacat-list--crop-groups">
        {cropGroups.toJS()}
      </ul>
    );
  }
});

module.exports = CropList;