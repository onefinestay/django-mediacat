/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var cx = React.addons.classSet;
var PureRenderMixin = require('react').addons.PureRenderMixin;

var Header = require('./header');
var ThumbnailList = require('./thumbnail-list');
var Detail = require('./detail');


var Main = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    return {
      mode: 'grid'
    };
  },

  setGridMode: function() {
    this.setState({mode: 'grid'});
  },

  setFilmstripMode: function() {
    this.setState({mode: 'filmstrip'});
  },  

  setDetailMode: function() {
    this.setState({mode: 'detail'});
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
      <div className="mediacat-content">
        <Header>
          <div className="toolbar">
            <div className="spacer" />
            <div className="button-group">
              <button className={cx(gridButtonClasses)} onClick={this.setGridMode} />
              <button className={cx(filmstripButtonClasses)} onClick={this.setFilmstripMode} />
              <button className={cx(detailButtonClasses)} onClick={this.setDetailMode} />
            </div>
          </div>
        </Header>
        <div className={cx(documentClasses)}>
          {this.state.mode !== 'grid' && <div className="mediacat-detail-wrapper"><Detail mode={this.state.mode} /></div>}
          {this.state.mode !== 'detail' && <ThumbnailList mode={this.state.mode} />}
        </div>
      </div>
    );
  }
});

module.exports = Main;