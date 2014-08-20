/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var cx = React.addons.classSet;
var Tab = require('./tab');
var _ = require('underscore');


var Tabs = React.createClass({

  getInitialState: function() {
    return {
      activeTab: 0
    };
  },

  activateTab: function(index) {
    var tabs = this.props.children;

    if (!_.isArray(tabs)) {
      tabs = [tabs];
    } 

    var tab = tabs[index];
    this.setState({activeTab: index});
    if (tab.props.onActivate) {
      tab.props.onActivate();
    }
  },

  render: function() {
    var tabs = this.props.children;

    if (!_.isArray(tabs)) {
      tabs = [tabs];
    }    
    
    var tabButtons = [];
    var tabBodies = [];
    var i;
    var tab;
    var active;
    var buttonClasses;
    var panelClasses;

    for (i=0; i<tabs.length; i++) {
      tab = tabs[i];
      active = i === this.state.activeTab;

      buttonClasses = cx({
        'mediacat-tabs-button-active': active,
        'mediacat-tabs-button': true
      });

      panelClasses = cx({
        'mediacat-tabs-panel-active': active,
        'mediacat-tabs-panel': true
      });

      tabButtons.push(<li key={tab.props.name} className={buttonClasses} onClick={_.partial(this.activateTab, i)}>{tab.props.name}</li>);
      tabBodies.push(<li key={tab.props.name} className={panelClasses}>{tab.props.children}</li>);
    }

    return (
      <div className="mediacat-tabs">
        <ul className="mediacat-tabs-buttons">{tabButtons}</ul>
        <ul className="mediacat-tabs-panels">{tabBodies}</ul>
      </div>
    );
  }
});

module.exports = {Tabs, Tab};