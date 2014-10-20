/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var UploadList = require('./upload-list');

var Panel = require('./panel');
var Toolbar = require('./toolbar');
var Button = require('./button');
var Icon = require('./icon');


var Uploads = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    var toolbar = (
      <Toolbar theme="dark-grey">
        <span className="mediacat-toolbar__title">Uploads</span>
        <span className="mediacat-toolbar__separator" />
        <Button theme="dark-grey" glyph="arrow" />
      </Toolbar>
    );

    return (
      <Panel fill={false} height={200} className="mediacat-uploads" toolbar={toolbar}>
        <UploadList />
      </Panel>
    );    
  }
});

module.exports = Uploads;