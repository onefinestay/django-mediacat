/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;
var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var FluxMixin = require('../flux-mixin');


var ImageDataPanel = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media")],

  getStateFromFlux: function() {
    var store = this.getFlux().store('Media');
    var selected = store.state.get('selectedMedia');

    return {
      media: selected
    };
  },

  render: function() {
    var media = this.state.media;

    return (
      <div className="mediacat-information-panel">
        <table>
          <tr>
            <th scope="row">Width</th>
            <td>{media && media.get('width')}</td>
          </tr>
          <tr>
            <th scope="row">Height</th>
            <td>{media && media.get('height')}</td>
          </tr>          
        </table>
      </div>
    );
  }
});

module.exports = ImageDataPanel;