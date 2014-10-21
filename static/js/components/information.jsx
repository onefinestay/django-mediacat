/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;

var tabs = require('./tabs/tabs');
var Tab = tabs.Tab;
var Tabs = tabs.Tabs;

var ImageDataPanel = require('./panels/image-data');
var CropsPanel = require('./panels/crops');
var Toolbar = require('./toolbar');
var PickButton = require('./pick-button');
var ToolbarSpacer = require('./toolbar-spacer');

var ThemeMixin = require('./theme-mixin');


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
        <Tabs>
          <Tab name="Crops">
            <CropsPanel />
          </Tab>        
          <Tab name="Image">
            <ImageDataPanel />
          </Tab>
        </Tabs>
      </div>
    );
  }
});

module.exports = Information;