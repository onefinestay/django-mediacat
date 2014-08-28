/**
 * @jsx React.DOM
 */
"use strict";

require('../css/library');

var React = require('react/addons');
var Fluxxor = require("fluxxor");
var Application = require('./components/application');

var CategoryStore = require('./stores/categories');
var MediaStore = require('./stores/media');
var UploadStore = require('./stores/uploads');

var Actions = require('./actions');

var config = window.MEDIACAT_CONFIG;

var stores = {
  Categories: new CategoryStore(config.categories),
  Media: new MediaStore(config.media),
  Uploads: new UploadStore(config.uploads)
};

var flux = new Fluxxor.Flux(stores, Actions);

window.React = React;


React.renderComponent(
  <Application flux={flux} />,
  document.body
);