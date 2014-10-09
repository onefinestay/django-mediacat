/** @jsx React.DOM */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var FluxMixin = require('./flux-mixin');
var Icon = require('./icon');

var UploadButton = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Categories")],

  getStateFromFlux: function() {
    var store = this.getFlux().store('Categories');
    return {
      category: store.getSelectedCategory()
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
    var disabled = !this.state.category || !this.state.category.get('accepts_images');

    var classes = {
      'mediacat-button': true,
      'mediacat-button--header': true,
      'mediacat-is-disabled': disabled
    };

    return (
      <div className={cx(classes)}>
        <Icon glyph="upload" size="large" />
        <div className="mediacat-button__mask" onClick={this.handleClick} />
        <input className="mediacat-input--hidden-file" type="file" multiple={true} ref="upload"
          accept="image/jpeg, image/png, image/gif"
          onChange={this.handleChange} disabled={disabled} />
      </div>
    );
  }
});

module.exports = UploadButton;