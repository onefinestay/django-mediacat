var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var UploadList = require('./upload-list');

var Panel = require('./panel');

var Toolbar = require('./toolbar');
var ToolbarSeparator = require('./toolbar-separator');
var ToolbarSpacer = require('./toolbar-spacer');
var ToolbarTitle = require('./toolbar-title');

var Button = require('./button');
var Icon = require('./icon');

var ThemeMixin = require('./theme-mixin');


var UploadsToolbar = React.createClass({
  mixins: [ThemeMixin, PureRenderMixin],

  render: function() {
    return (
      <Toolbar>
        <ToolbarTitle>Uploads</ToolbarTitle>
        <ToolbarSeparator />
        <Button glyph="arrow" />
      </Toolbar>
    );
  }
});


var Uploads = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    return (
      <Panel fill={false} height={200} className="mediacat-uploads" toolbar={<UploadsToolbar theme="dark-grey" />}>
        <UploadList />
      </Panel>
    );    
  }
});

module.exports = Uploads;