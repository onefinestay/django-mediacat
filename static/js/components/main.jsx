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

  setDetailMode: function() {
    this.setState({mode: 'detail'});
  },
  
  render: function() {
    var documentClasses = {
      'mediacat-document': true,
      'mediacat-document-grid': this.state.mode === 'grid',
      'mediacat-document-detail': this.state.mode === 'detail'
    };

    return (
      <div className="mediacat-content">
        <Header>
          <button>Upload</button>
          <button className="icon icon-grid" onClick={this.setGridMode} />
          <button className="icon icon-detail" onClick={this.setDetailMode} />
        </Header>
        <div className={cx(documentClasses)}>
          <Detail />
          <ThumbnailList />
        </div>
      </div>
    );
  }
});

module.exports = Main;