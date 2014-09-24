/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;
var Fluxxor = require("fluxxor");
var FluxMixin = require('./flux-mixin');
var moment = require('moment');
var Immutable = require('immutable');


var Rating = React.createClass({
  mixins: [PureRenderMixin, FluxMixin],

  getInitialState: function() {
    return {
      highlight: null
    };
  },

  onMouseOver: function(i, event) {
    this.setState({highlight:  i + 1});
  },

  onMouseOut: function(i, event) {
    this.setState({highlight: null});
  },

  onClick: function(i, event) {
    this.getFlux().actions.media.setRating(this.props.media, i + 1);
    this.setState({highlight: null});
  },

  render: function() {
    var media = this.props.media;
    var rating = media.get('rating');
    var iconClasses;

    if (this.state.highlight !== null) {
      iconClasses = Immutable.Repeat('highlight icon-star', this.state.highlight).toVector().concat(Immutable.Repeat('icon-empty-star', 5 - this.state.highlight).toVector());
    } else {
      if (rating !== undefined && rating !== null) {
        iconClasses = Immutable.Repeat('icon-star', rating).toVector().concat(Immutable.Repeat('icon-empty-star', 5 - rating).toVector());
      } else {
        iconClasses = Immutable.Repeat('icon-empty-star no-rating', 5);
      }
    }

    var icons = iconClasses.map((className, i) => <span 
      onMouseOver={this.onMouseOver.bind(this, i)} 
      onMouseOut={this.onMouseOut.bind(this, i)}
      onClick={this.onClick.bind(this, i)}
      className={'icon ' + className} />);

    return (
      <div className="media-rating">
        <span
         onMouseOver={this.onMouseOver.bind(this, - 1)} 
         onMouseOut={this.onMouseOut.bind(this, - 1)}
         onClick={this.onClick.bind(this, - 1)}
         className="icon icon-reject" />
        {icons.toJS()}
      </div>
    );
  }
});

module.exports = Rating;