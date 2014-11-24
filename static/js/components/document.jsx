var React = require('react/addons');
var cx = require('./bem-cx');
var PureRenderMixin = require('react').addons.PureRenderMixin;

var FluxMixin = require('./mixins/flux-mixin');
var KeyboardMixin = require('./mixins/keyboard-mixin');

var ThumbnailList = require('./thumbnail-list');
var Detail = require('./detail');


var Document = React.createClass({
  mixins: [PureRenderMixin, KeyboardMixin, FluxMixin],

  componentWillMount: function() {
    var keyboard = this.getKeyboard();
    keyboard.on('1', this.setRating.bind(this, 1));
    keyboard.on('2', this.setRating.bind(this, 2));
    keyboard.on('3', this.setRating.bind(this, 3));
    keyboard.on('4', this.setRating.bind(this, 4));
    keyboard.on('5', this.setRating.bind(this, 5));
    keyboard.on('0', this.setRating.bind(this, 0));
  },

  componentWillUnmount: function() {
    var keyboard = this.getKeyboard();
    keyboard.off('1');
    keyboard.off('2');
    keyboard.off('3');
    keyboard.off('4');
    keyboard.off('5');
    keyboard.off('0');
  },

  setRating: function(rating) {
    var selected = this.getFlux().store('Media').getSelectedMedia();
    if (selected) {
      this.getFlux().actions.media.setRating(selected, rating);
    }
  },  

  render: function() {
    var classes = {
      'document': true,
      'document--grid': this.props.mode === 'grid',
      'document--filmstrip': this.props.mode === 'filmstrip',
      'document--detail': this.props.mode === 'detail'
    };

    return (
      <div className={cx(classes)}>
        {this.props.mode !== 'grid' && <Detail mode={this.props.mode} />}
        {this.props.mode !== 'detail' && <ThumbnailList mode={this.props.mode} />}
      </div>
    );
  }
});

module.exports = Document;