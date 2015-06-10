require('../css/library');

var React = require('react/addons');
var Fluxxor = require("fluxxor");
var Application = require('./components/application');

var AssociationStore = require('./stores/associations');
var CategoryStore = require('./stores/categories');
var MediaStore = require('./stores/media');
var UploadStore = require('./stores/uploads');
var CropStore = require('./stores/crops');
var DraggingStore = require('./stores/dragging');

var Actions = require('./actions');

var Keyboard = require('./keyboard');

var config = window.MEDIACAT_CONFIG;

var stores = {
  Associations: new AssociationStore(config.associations),
  Categories: new CategoryStore(config.categories),
  Media: new MediaStore(config.media),
  Uploads: new UploadStore(config.uploads),
  Crops: new CropStore(config.crops),
  Dragging: new DraggingStore(config.dragging)
};

var flux = new Fluxxor.Flux(stores, Actions);
var keyboard = new Keyboard();


window.React = React;

React.render(
  <Application flux={flux} keyboard={keyboard} />,
  document.getElementById('application')
);
