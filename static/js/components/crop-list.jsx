/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var FluxMixin = require('./flux-mixin');

var ScrollPane = require('./scrollpane');


var Crop = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media")],

  select: function(event) {
    event.preventDefault();
    if (this.state.selected) {
      this.getFlux().actions.crop.deselect(this.props.crop);
    } else {
      this.getFlux().actions.crop.select(this.props.crop);
    }
  },

  getStateFromFlux: function() {
    var store = this.getFlux().store('Media');
    var selected = store.getSelectedCrop();

    return {
      selected: selected && this.props.crop.get('id') === selected.get('id')
    };
  },

  render: function() {
    var media = this.props.media;
    var crop = this.props.crop;

    var classes = {
      'mediacat-crop': true,
      'mediacat-crop-selected': this.state.selected
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
        <div className="mediacat-crop-preview-frame" style={frameStyles} >
          <div className="mediacat-crop-preview" style={previewStyles} />
        </div>
        {crop.get('label')}
      </li>
    );
  }
});


var CropList = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media")],

  getStateFromFlux: function() {
    var store = this.getFlux().store('Media');
    var selected = store.getSelectedMedia();

    return {
      media: selected,
      crops: selected ? selected.get('crops') : null
    };
  },

  render: function() {
    var media = this.state.media;    
    var crops;

    if (!media) {
      return <p>Select an image to view its crops</p>;
    }

    crops = this.state.crops.map(crop => <Crop key={crop.get('id')} x1={crop.get('x1')} x2={crop.get('x2')} y1={crop.get('y1')} y2={crop.get('y2')} crop={crop} media={media} />);

    return (
      <ScrollPane>
        <ul className="mediacat-crop-list">
          {crops.toJS()}
        </ul>
      </ScrollPane>
    );
  }
});

module.exports = CropList;