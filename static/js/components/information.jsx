var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;

var tabs = require('./common/tabs');
var ToolbarSpacer = require('./common/toolbar-spacer');
var Toolbar = require('./common/toolbar');
var ThemeMixin = require('./mixins/theme-mixin');

var ImageDataPanel = require('./image-data');
var CropsPanel = require('./crops');
var PickButton = require('./pick-button');


var InformationToolbar = React.createClass({
  mixins: [ThemeMixin, PureRenderMixin],

  render: function() {
    return (
      <Toolbar>
        <ToolbarSpacer />
        <PickButton />
      </Toolbar>
    );
  }
});


var Information = React.createClass({
  mixins: [PureRenderMixin],
  
  render: function() {
    return (
      <div className="mediacat-information mediacat-column mediacat-column--sidebar">
        <InformationToolbar theme="white-on-teal" />
        <tabs.Tabs>
          <tabs.Tab name="Crops">
            <CropsPanel />
          </tabs.Tab>
          <tabs.Tab name="Image">
            <ImageDataPanel />
          </tabs.Tab>
        </tabs.Tabs>
      </div>
    );
  }
});

module.exports = Information;