/** @jsx React.DOM */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var FluxMixin = require('./flux-mixin');

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
    return (
      <div className="button icon icon-upload">
        <div className="button-mask" onClick={this.handleClick} />
        <input className="hidden-file" type="file" multiple={true} ref="upload"
          accept="image/jpeg, image/png, image/gif"
          onChange={this.handleChange} />
      </div>
    );
  }
});

module.exports = UploadButton;