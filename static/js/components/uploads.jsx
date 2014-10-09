/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;

var UploadList = require('./upload-list');

var Panel = require('./panel');
var PanelToolbar = require('./panel-toolbar');
var Icon = require('./icon');


var Uploads = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    var toolbar = (
      <PanelToolbar>
        Uploads
        <span className="spacer" />
        <button className="mediacat-panel-state"><Icon glyph="arrow" /></button>
      </PanelToolbar>
    );

    return (
      <Panel className="mediacat-uploads" toolbar={toolbar}>
        <UploadList />
      </Panel>
    );    
  }
});

module.exports = Uploads;