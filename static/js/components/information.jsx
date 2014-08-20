/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;

var Header = require('./header');
var tabs = require('./tabs/tabs');
var Tab = tabs.Tab;
var Tabs = tabs.Tabs;

var InformationPanel = require('./information-panel');


var Information = React.createClass({
  mixins: [PureRenderMixin],
  
  render: function() {
    return (
      <div className="mediacat-information">
        <Header />
        <Tabs>
          <Tab name="Crops">
            <div>Hello World!</div>
          </Tab>        
          <Tab name="Metadata">
            <InformationPanel />
          </Tab>
        </Tabs>
      </div>
    );
  }
});

module.exports = Information;