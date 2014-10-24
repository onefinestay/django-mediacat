var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('./bem-cx');
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var FluxMixin = require('./mixins/flux-mixin');

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
      'crop': true,
      'list__item': true
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

    return (
      <li className={cx(classes,{states})} onClick={this.select}>
        <div className="mediacat-crop__content">
          <div className="mediacat-crop__preview-frame" style={frameStyles} >
            <div className="mediacat-crop__preview" style={previewStyles} />
          </div>
        </div>
        <div className="mediacat-crop__footer">
          <div className="mediacat-crop__applications-handle" onClick={this.toggleExpanded}>
            <div className="mediacat-crop__applications-heading">
              Applications ({crop.get('applications').length})
            </div>
            <div className="mediacat-crop__applications-button">
              <Icon glyph={this.state.expanded ? 'up-arrow' : 'down-arrow'} />
            </div>
          </div>
          {crop.get('changed') ? <a href="javascript:;" onClick={this.save}><Icon glyph="tick" /></a> : null}
        </div>
        {this.state.expanded ? <CropApplicationTable crop={crop} /> : null}
      </li>
    );
  }
});


module.exports = Crop;