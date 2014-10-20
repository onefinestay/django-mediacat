/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;

var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var FluxMixin = require('./flux-mixin');
var Document = require('./document');
var Button = require('./button');
var Toolbar = require('./toolbar');


var Main = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media")],

  getStateFromFlux: function() {
    return {
      mode: this.getFlux().store('Media').state.get('viewMode')
    };
  },

  setGridMode: function() {
    this.getFlux().actions.media.setViewMode('grid');
  },

  setFilmstripMode: function() {
    this.getFlux().actions.media.setViewMode('filmstrip');
  },  

  setDetailMode: function() {
    this.getFlux().actions.media.setViewMode('detail');
  },
  
  render: function() {
    return (
      <div className="mediacat-content mediacat-column">
        <Toolbar theme="white-on-teal">
          <div className="mediacat-toolbar__spacer" />
          <div className="mediacat-button-group">
            <Button active={this.state.mode === 'grid'} onClick={this.setGridMode} glyph="grid" />
            <Button active={this.state.mode === 'filmstrip'} onClick={this.setFilmstripMode} glyph="filmstrip" />
            <Button active={this.state.mode === 'detail'} onClick={this.setDetailMode} glyph="detail" />
          </div>
        </Toolbar>
        <Document mode={this.state.mode} />
      </div>
    );
  }
});

module.exports = Main;