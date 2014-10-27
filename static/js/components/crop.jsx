var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('./bem-cx');
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var FluxMixin = require('./mixins/flux-mixin');

var Action = require('./common/action');
var ActionBar = require('./common/action-bar');
var Icon = require('./common/icon');

var CropApplicationTable = require('./crop-application-table');


var Crop = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Crops", "Media")],

  getInitialState: function() {
    return {
      expanded: false
    };
  },

  expand: function() {
    this.setState({expanded: true});
  },

  collapse: function() {
   this.setState({expanded: false});
  },

  toggleExpanded: function(event) {
    event.stopPropagation();

    if (this.state.expanded) {
      this.collapse();
    } else {
      this.expand();
    }
  },

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

  delete: function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.getFlux().actions.crop.delete(this.props.crop);
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
      'crop': true
    };

    var states = {
      'pickable': this.state.pickable,
      'selected': this.state.selected
    }

    var frameWidth = 150;
    var mediaWidth = media.get('width');
    var mediaHeight = media.get('height');

    var scale = frameWidth / mediaWidth;
    var frameHeight = mediaHeight * scale;

    var frameStyles = {
        width: frameWidth,
        height: frameHeight
    };

    var cropLeft = Math.round(scale * this.props.x1);
    var cropTop = Math.round(scale * this.props.y1);
    var cropWidth = Math.round(scale * (this.props.x2 - this.props.x1));
    var cropHeight = Math.round(scale * (this.props.y2 - this.props.y1));

    var previewStyles = {
      left: cropLeft,
      top: cropTop,
      width: cropWidth,
      height: cropHeight
    };

    var numApplications = crop.get('applications').count();
    var hasApplications = !!numApplications;

    return (
      <div className={cx(classes,{states})} onClick={this.select}>
        <div className="mediacat-crop__content">
          <div className="mediacat-crop__preview-frame" style={frameStyles} >
            <div className="mediacat-crop__preview" style={previewStyles} />
            {crop.get('changed') ? <div className="mediacat-crop__unsaved-label">Unsaved Changes</div> : null}
          </div>
        </div>
        <ActionBar>
          <Action fill={true} onClick={this.toggleExpanded} glyph={this.state.expanded ? 'up-arrow' : 'down-arrow'} disabled={!hasApplications}>
            {hasApplications && this.state.expanded && 'Hide applications (' + numApplications + ')'}
            {hasApplications && !this.state.expanded && 'Show applications (' + numApplications + ')'}
            {!hasApplications && 'No applications'}
          </Action>
          <Action onClick={this.save} glyph="tick" disabled={!crop.get('changed')}>Save</Action>
          <Action onClick={this.delete} glyph="delete" disabled={hasApplications} />
        </ActionBar>
        {this.state.expanded ? <CropApplicationTable crop={crop} /> : null}
      </div>
    );
  }
});


module.exports = Crop;