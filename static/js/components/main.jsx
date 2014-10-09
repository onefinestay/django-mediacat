/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var cx = React.addons.classSet;
var PureRenderMixin = require('react').addons.PureRenderMixin;

var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var FluxMixin = require('./flux-mixin');

var Document = require('./document');


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
    var gridButtonClasses = {
      'icon': true,
      'icon-grid': true,
      'active': this.state.mode === 'grid'
    };

    var filmstripButtonClasses = {
      'icon': true,
      'icon-filmstrip': true,
      'active': this.state.mode === 'filmstrip'
    };    

    var detailButtonClasses = {
      'icon': true,
      'icon-detail': true,
      'active': this.state.mode === 'detail'
    };

    return (
      <div className="mediacat-content mediacat-column">
        <div className="toolbar">
          <div className="spacer" />
          <div className="button-group">
            <button className={cx(gridButtonClasses)} onClick={this.setGridMode} />
            <button className={cx(filmstripButtonClasses)} onClick={this.setFilmstripMode} />
            <button className={cx(detailButtonClasses)} onClick={this.setDetailMode} />
          </div>
        </div>
        <Document mode={this.state.mode} />
      </div>
    );
  }
});

module.exports = Main;