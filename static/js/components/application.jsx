/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;

var Navigation = require('./navigation');
var Main = require('./main');
var Information = require('./information');
var DragLayer = require('./drag_layer');

var FluxMixin = require('./flux-mixin');
var KeyboardMixin = require('./keyboard-mixin');


var Application = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, KeyboardMixin],

  render: function() {
    return (
      <div className="mediacat-application">
        <DragLayer />
        <Navigation />
        <Main />
        <Information />
      </div>
    );
  }
});

module.exports = Application;



