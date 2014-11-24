var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;

var Tabs = require('./common/tabs');
var Toolbar = require('./common/toolbar');
var ThemeMixin = require('./mixins/theme-mixin');

var ImageDataPanel = require('./image-data');
var CropsPanel = require('./crops');
var PickButton = require('./pick-button');


var InformationToolbar = React.createClass({
  mixins: [ThemeMixin, PureRenderMixin],

  render: function() {
    return (
      <Toolbar.Toolbar>
        <Toolbar.Spacer />
        <PickButton />
      </Toolbar.Toolbar>
    );
  }
});


var Information = React.createClass({
  mixins: [PureRenderMixin],
  
  render: function() {
    return (
      <div className="mediacat-information mediacat-column mediacat-column--sidebar">
        <InformationToolbar theme="white-on-teal" />
        <Tabs.Tabs>
          <Tabs.Tab name="Crops">
            <CropsPanel />
          </Tabs.Tab>
          <Tabs.Tab name="Image">
            <ImageDataPanel />
          </Tabs.Tab>
        </Tabs.Tabs>
      </div>
    );
  }
});

module.exports = Information;