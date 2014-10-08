/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;

var Header = require('./header');
var tabs = require('./tabs/tabs');
var Tab = tabs.Tab;
var Tabs = tabs.Tabs;

var ImageDataPanel = require('./panels/image-data');
var CropsPanel = require('./panels/crops');

var PickButton = require('./pick-button');


var Information = React.createClass({
  mixins: [PureRenderMixin],
  
  render: function() {
    return (
      <div className="mediacat-information mediacat-column mediacat-column--sidebar">
        <div className="toolbar">
          <div className="spacer" />
          <PickButton />
        </div>
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