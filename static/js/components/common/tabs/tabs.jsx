import React from 'react/addons';

import cx from '../../bem-cx';
import Tab from './tab';


export default class Tabs extends React.Component {

  constructor(props) {
    super(props);
    this.state = {activeTab: 0};
  }

  activateTab(index) {
    var tabs = this.props.children;

    if (!Array.isArray(tabs)) {
      tabs = [tabs];
    }

    var tab = tabs[index];
    this.setState({activeTab: index});
    if (tab.props.onActivate) {
      tab.props.onActivate();
    }
  }

  render() {
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
}
