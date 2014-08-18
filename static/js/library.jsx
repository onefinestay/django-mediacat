/**
 * @jsx React.DOM
 */
"use strict";

require('../css/library');

var React = require('react/addons');
var Fluxxor = require("fluxxor");
var Application = require('./components/application');

var LibraryStore = require('./store');


var actions = {

};

var stores = {
	LibraryStore: new LibraryStore(window.MEDIACAT_CONFIG)
};

var flux = new Fluxxor.Flux(stores, actions);

window.React = React;


React.renderComponent(
  <Application flux={flux} />,
  document.body
);