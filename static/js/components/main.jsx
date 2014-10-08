/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var cx = React.addons.classSet;
var PureRenderMixin = require('react').addons.PureRenderMixin;

var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;
var FluxMixin = require('./flux-mixin');
var KeyboardMixin = require('./keyboard-mixin');

var ThumbnailList = require('./thumbnail-list');
var Detail = require('./detail');


var Main = React.createClass({
  mixins: [PureRenderMixin, KeyboardMixin, FluxMixin, StoreWatchMixin("Media")],

  getStateFromFlux: function() {
    return {
      mode: this.getFlux().store('Media').state.get('viewMode')
    };
  },

  componentWillMount: function() {
    var keyboard = this.getKeyboard();
    var flux = this.getFlux();

    keyboard.on('1', this.setRating.bind(this, 1));
    keyboard.on('2', this.setRating.bind(this, 2));
    keyboard.on('3', this.setRating.bind(this, 3));
    keyboard.on('4', this.setRating.bind(this, 4));
    keyboard.on('5', this.setRating.bind(this, 5));
    keyboard.on('0', this.setRating.bind(this, 0));
  },

  componentWillUnmount: function() {
    var keyboard = this.getKeyboard();

    keyboard.off('1');
    keyboard.off('2');
    keyboard.off('3');
    keyboard.off('4');
    keyboard.off('5');
    keyboard.off('0');
  },

  setRating: function(rating, event) {
    var selected = this.getFlux().store('Media').getSelectedMedia();
    if (selected) {
      this.getFlux().actions.media.setRating(selected, rating);
    }
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
    var documentClasses = {
      'mediacat-document': true,
      'mediacat-document-grid': this.state.mode === 'grid',
      'mediacat-document-filmstrip': this.state.mode === 'filmstrip',
      'mediacat-document-detail': this.state.mode === 'detail'
    };

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
        <div className={cx(documentClasses)}>
          {this.state.mode !== 'grid' && <div className="mediacat-detail-wrapper"><Detail mode={this.state.mode} /></div>}
          {this.state.mode !== 'detail' && <ThumbnailList mode={this.state.mode} />}
        </div>
      </div>
    );
  }
});

module.exports = Main;