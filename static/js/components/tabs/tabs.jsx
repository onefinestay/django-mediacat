/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var cx = React.addons.classSet;
var Tab = require('./tab');


var Tabs = React.createClass({

  getInitialState: function() {
    return {
      activeTab: 0
    };
  },

  activateTab: function(index) {
    var tabs = this.props.children;

    if (!Array.isArray(tabs)) {
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

    if (!Array.isArray(tabs)) {
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
        'mediacat-tabs__button': true,
        'mediacat-is-active': active
      });

      panelClasses = cx({
        'mediacat-tabs__panel': true,
        'mediacat-is-active': active
      });

      tabButtons.push(<li key={tab.props.name} className={buttonClasses} onClick={this.activateTab.bind(this, i)}>{tab.props.name}</li>);
      tabBodies.push(<li key={tab.props.name} className={panelClasses}>{tab.props.children}</li>);
    }

    return (
      <div className="mediacat-tabs">
        <div className="mediacat-tabs__buttons-wrapper">
          <ul className="mediacat-tabs__buttons">{tabButtons}</ul>
        </div>
        <ul className="mediacat-tabs__panels">{tabBodies}</ul>
      </div>
    );
  }
});

module.exports = {Tabs, Tab};