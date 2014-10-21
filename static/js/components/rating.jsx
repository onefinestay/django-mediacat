/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var Fluxxor = require("fluxxor");
var FluxMixin = require('./flux-mixin');
var moment = require('moment');
var Immutable = require('immutable');
var Icon = require('./icon');

var Rating = React.createClass({
  mixins: [PureRenderMixin, FluxMixin],

  getDefaultProps: function() {
    return  {
      interactable: true
    };
  },

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
    var interactable = this.props.interactable;
    var glyphs;

    if (this.state.highlight !== null) {
      glyphs = Immutable.Repeat('star', this.state.highlight).toVector().concat(Immutable.Repeat('empty-star', 5 - this.state.highlight).toVector());
    } else {
      if (rating !== undefined && rating !== null) {
        glyphs = Immutable.Repeat('star', rating).toVector().concat(Immutable.Repeat('empty-star', 5 - rating).toVector());
      } else {
        glyphs = Immutable.Repeat('empty-star', 5);
      }
    }

    var icons = glyphs.map((glyph, i) => <Icon size={this.props.size} glyph={glyph} key={i}
      onMouseOver={interactable && this.onMouseOver.bind(this, i)} 
      onMouseOut={interactable && this.onMouseOut.bind(this, i)}
      onClick={interactable && this.onClick.bind(this, i)} />);

    return (
      <div className="media-rating">
        {interactable ? <span
         onMouseOver={this.onMouseOver.bind(this, - 1)} 
         onMouseOut={this.onMouseOut.bind(this, - 1)}
         onClick={this.onClick.bind(this, - 1)}
         className="mediacat-icon mediacat-icon--reject" /> : null}
        {icons.toJS()}
      </div>
    );
  }
});

module.exports = Rating;