var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;

var Fluxxor = require("fluxxor");
var StoreWatchMixin = Fluxxor.StoreWatchMixin;

var Button = require('./common/button');
var ButtonGroup = require('./common/button-group');
var Toolbar = require('./common/toolbar');

var FluxMixin = require('./mixins/flux-mixin');
var ThemeMixin = require('./mixins/theme-mixin');

var Document = require('./document');



var MainToolbar = React.createClass({
  mixins: [ThemeMixin, FluxMixin, PureRenderMixin],

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
      <Toolbar.Toolbar>
        <Toolbar.Spacer />
        <ButtonGroup>
          <Button active={this.props.mode === 'grid'} onClick={this.setGridMode} glyph="grid" />
          <Button active={this.props.mode === 'filmstrip'} onClick={this.setFilmstripMode} glyph="filmstrip" />
          <Button active={this.props.mode === 'detail'} onClick={this.setDetailMode} glyph="detail" />
        </ButtonGroup>
      </Toolbar.Toolbar>
    );
  }
})


var Main = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, StoreWatchMixin("Media")],

  getStateFromFlux: function() {
    return {
      mode: this.getFlux().store('Media').state.get('viewMode')
    };
  },

  render: function() {
    return (
      <div className="mediacat-content mediacat-column">
        <MainToolbar mode={this.state.mode} theme="white-on-teal" />
        <Document mode={this.state.mode} />
      </div>
    );
  }
});

module.exports = Main;