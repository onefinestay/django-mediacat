/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var FluxMixin = require('./flux-mixin');

var Crop = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Crops", "Media")],

  select: function(event) {
    event.preventDefault();
    if (this.state.selected) {
      this.getFlux().actions.crop.deselect(this.props.crop);
    } else {
      this.getFlux().actions.crop.select(this.props.crop);
    }
  },

  save: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.getFlux().actions.crop.save(this.props.crop);
  },

  getStateFromFlux: function() {
    var store = this.getFlux().store('Crops');
    var selected = store.state.get('selectedCrop');

    var selectOptions = this.getFlux().store('Media').state.get('select');
    var ratio;
    var width;
    var selectWidth;
    var selectRatios;
    var pickable = false;

    if (selectOptions) {
      ratio = this.props.crop.get('key');
      width = this.props.crop.get('x2') - this.props.crop.get('x1');

      selectRatios = selectOptions.get('ratios');
      selectWidth = selectOptions.get('width');

      if (selectRatios.contains(ratio) && width >= selectWidth) {
        pickable = true;
      }
    }

    return {
      selected: selected && this.props.crop.get('uuid') === selected,
      pickable: pickable
    };
  },

  render: function() {
    var media = this.props.media;
    var crop = this.props.crop;

    var classes = {
      'mediacat-crop': true,
      'mediacat-crop--pickable': this.state.pickable,
      'mediacat-crop--selected': this.state.selected,
      'mediacat-list__item': true,
    };

    var frameWidth = 150;
    var mediaWidth = media.get('width');
    var mediaHeight = media.get('height');

    var scale = frameWidth / mediaWidth;
    var frameHeight = mediaHeight * scale;

    var frameStyles = {
        width: frameWidth + 'px',
        height: frameHeight + 'px'
    };

    var cropLeft = Math.round(scale * this.props.x1);
    var cropTop = Math.round(scale * this.props.y1);
    var cropWidth = Math.round(scale * (this.props.x2 - this.props.x1));
    var cropHeight = Math.round(scale * (this.props.y2 - this.props.y1));

    var previewStyles = {
      left: cropLeft + 'px',
      top: cropTop + 'px',
      width: cropWidth + 'px',
      height: cropHeight + 'px'
    };

    return (
      <li className={cx(classes)} onClick={this.select}>
        <div className="mediacat-crop__content">
          <div className="mediacat-crop__preview-frame" style={frameStyles} >
            <div className="mediacat-crop__preview" style={previewStyles} />
          </div>
        </div>
        <div className="mediacat-crop__footer">
          Usages: {crop.get('applications').length}
          {crop.get('changed') ? <a href="javascript:;" onClick={this.save}>Save</a> : null}          
        </div>
      </li>
    );
  }
});


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
          {this.state.availableCrops.get(this.props.key).get(0)}
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
      .map((crops, key) => <CropGroup key={key} crops={crops} />);

    return (
      <ul className="mediacat-list mediacat-list--crop-groups">
        {cropGroups.toJS()}
      </ul>
    );
  }
});

module.exports = CropList;