var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;

var Navigation = require('./navigation');
var Main = require('./main');
var Information = require('./information');
var DragLayer = require('./drag-layer');

var FluxMixin = require('./mixins/flux-mixin');
var KeyboardMixin = require('./mixins/keyboard-mixin');


var Application = React.createClass({
  mixins: [PureRenderMixin, FluxMixin, KeyboardMixin],

  render: function() {
    return (
      <div className="mediacat-application">
        <DragLayer />
        <div className="mediacat-application__flex-container">
          <Navigation />
          <Main />
          <Information />
        </div>
      </div>
    );
  }
});

module.exports = Application;



