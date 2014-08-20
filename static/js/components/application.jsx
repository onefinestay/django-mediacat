/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;

var Navigation = require('./navigation');
var Main = require('./main');

var FluxMixin = require('./flux-mixin');


var Application = React.createClass({
  mixins: [PureRenderMixin, FluxMixin],

  render: function() {
    return (
      <div className="mediacat-application">
        <Navigation />
        <Main />
      </div>
    );
  }
});

module.exports = Application;



