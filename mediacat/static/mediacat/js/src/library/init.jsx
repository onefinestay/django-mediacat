/**
 * @jsx React.DOM
 */
"use strict";

var React = require('react/addons');

module.exports = function(data, config, el) {
  React.renderComponent(
    <div>Hello world!</div>,
    el
  );
};