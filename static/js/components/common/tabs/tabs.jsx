var React = require('react/addons');
var cx = require('../../bem-cx');
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
    var states;
    var panelClasses;

    for (i=0; i<tabs.length; i++) {
      tab = tabs[i];
      active = i === this.state.activeTab;

      buttonClasses = {
        'tabs__button': true,
      };

      panelClasses = {
        'tabs__panel': true
      };

      states = {
        'active': active
      };

      tabButtons.push(<li key={tab.props.name} className={cx(buttonClasses, {states})} onClick={this.activateTab.bind(this, i)}>{tab.props.name}</li>);
      tabBodies.push(<li key={tab.props.name} className={cx(panelClasses, {states})}>{tab.props.children}</li>);
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

export default Tabs;