var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;

var Button = require('./common/button');
var Icon = require('./common/icon');
var Panel = require('./common/panel');
var Toolbar = require('./common/toolbar');

var ThemeMixin = require('./mixins/theme-mixin');

var UploadList = require('./upload-list');


var UploadsToolbar = React.createClass({
  mixins: [ThemeMixin, PureRenderMixin],

  render: function() {
    return (
      <Toolbar.Toolbar>
        <Toolbar.Title>Uploads</Toolbar.Title>
        <Toolbar.Separator />
        <Button glyph="arrow" />
      </Toolbar.Toolbar>
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