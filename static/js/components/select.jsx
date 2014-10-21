/** @jsx React.DOM */
"use strict";

var React = require('react/addons');
var cx = require('./bem-cx');
var KeyboardMixin = require('./keyboard-mixin');
var Icon = require('./icon');


var SelectOption = React.createClass({
  propTypes: {
    disabled: React.PropTypes.bool,
    selected: React.PropTypes.bool,
    onHover: React.PropTypes.func.isRequired,
    onClick: React.PropTypes.func.isRequired,
    label: React.PropTypes.string.isRequired,
    option: React.PropTypes.object.isRequired,
    tokens: React.PropTypes.array.isRequired,
  },

  render: function() {
    var classes = {
      'select__option': true
    };

    var states = {
      'selected': !!this.props.selected
    };

    return (
      <li className={cx(classes, {states})}
        onMouseEnter={this.props.onHover.bind(null, this.props.option)}
        onMouseDown={this.props.onClick.bind(null, this.props.option)}>
        {this.props.label}
      </li>
    );
  }
});


var SelectOptions = React.createClass({
  mixins: [KeyboardMixin],

  componentDidMount: function() {
    var keyboard = this.getKeyboard();
    keyboard.push();
    keyboard.on('escape', this.props.onClose);
    keyboard.on('enter', this.props.onEnter);
    keyboard.on('up', this.props.onCursorUp);
    keyboard.on('down', this.props.onCursorDown);
  },

  componentWillUnmount: function() {
    var keyboard = this.getKeyboard();
    keyboard.pop();
  },    

  render: function() {
    return (
      <ul className="mediacat-select__options" ref="options">
        {this.props.options.toJS()}
      </ul>
    );
  }
});


var Select = React.createClass({
  propTypes: {
    name: React.PropTypes.string, // name of input
    placeholder: React.PropTypes.string, // input placeholder
    value: React.PropTypes.string, // initial value for input field

    valueField: React.PropTypes.string, // value field name
    labelField: React.PropTypes.string, // label field name

    options: React.PropTypes.object.isRequired, // array of objects
    resultRenderer: React.PropTypes.func, // search result React component

    onSelect: React.PropTypes.func, // function called when option is selected
  },

  componentWillReceiveProps: function(nextProps) {
    var newState = {};

    if (this.props.options !== nextProps.options) {
      newState.options = nextProps.options;
    }
    if (this.props.value !== nextProps.value) {
      newState.query = null;
    }
    this.setState(newState);
  },

  getDefaultProps: function() {
    return {
      valueField: 'value',
      labelField: 'label',
      searchField: ['label'],
      resultRenderer: SelectOption,
    };
  },

  getInitialState: function() {
    var selected = null;
    if (this.props.value) {
      selected = this.props.options.find(option => option.get(this.props.valueField) === this.props.value);
    }

    return {
      query: null,
      focus: false,
      options: this.props.options,
      highlighted: null,
      selected: selected,
      searchTokens: [],
    };
  },

  handleFocus: function(event) {
    event.preventDefault();

    var highlighted;
    if (this.state.selected) {
      highlighted = this.state.options.find(option => option === this.state.selected);
    } else {
      highlighted = this.state.options.first();
    }

    this.setState({
      focus: true,
      highlighted: highlighted
    });
  },

  open: function() {
    this.setState({
      focus: true
    });
  },

  close: function() {
    this.setState({
      focus: false
    });
  },

  handleBlur: function(event) {
    event.preventDefault();
    this.close();
  },

  handleOptionHover: function(option, event) {
    event.preventDefault();
    this.setState({
      highlighted: option
    });
  },

  handleOptionClick: function(option, event) {
    event.preventDefault();
    this.selectOption(option);
  },

  handleArrowClick: function(event) {
    if (this.state.focus) {
      this.handleBlur(event);
    } else {
      this.handleFocus(event);
    }
  },

  moveUp: function(event) {
    var options = this.state.options;
    if (options.count() > 0) {
      var index = options.indexOf(this.state.highlighted);
      if (options.get(index - 1)) {
        this.setState({
          highlighted: options.get(index - 1)
        });
      }
    }
  },

  moveDown: function(event) {
    var options = this.state.options;
    if (options.count() > 0) {
      event.preventDefault();
      var index = options.indexOf(this.state.highlighted);
      if (options.get(index + 1)) { 
        this.setState({
          highlighted: options.get(index + 1)
        });
      }
    }
  },

  remove: function(event) {
    if (this.state.selected) {
      event.preventDefault();
      this.setState({
        value: '',
        selected: null,
        highlighted: this.props.options.first(),
        focus: true,
        options: this.props.options
      });
    }
  },

  enter: function(event) {
    event.preventDefault();
    this.selectOption(this.state.highlighted);
  },

  updateScrollPosition: function() {
    var highlighted = this.refs.highlighted;
    if (highlighted) {
      // find if highlighted option is not visible
      var el = highlighted.getDOMNode();
      var parent = this.refs.options.getDOMNode();
      var offsetTop = el.offsetTop + el.clientHeight - parent.scrollTop;

      // scroll down
      if (offsetTop > parent.clientHeight) {
        var diff = el.offsetTop + el.clientHeight - parent.clientHeight;
        parent.scrollTop = diff;
      } else if (offsetTop - el.clientHeight < 0) { // scroll up
        parent.scrollTop = el.offsetTop;
      }
    }
  },

  selectOption: function(option) {
    this.setState({
      query: null,
      selected: option
    });

    this.getDOMNode().blur();

    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(option);
    }
  },

  componentDidMount: function() {
    this.updateScrollPosition();
  },

  componentDidUpdate: function() {
    this.updateScrollPosition();

    var active = !this.props.disabled && this.state.focus;
  },

  render: function() {
    var options = this.props.options.map(function(option) {
      var value = option.get(this.props.valueField);

      var highlighted = this.state.highlighted &&
        value == this.state.highlighted.get(this.props.valueField);

      return React.createFactory(this.props.resultRenderer)({
        key: value,
        value: value,
        label: option.get(this.props.labelField),
        option: option,
        tokens: this.state.searchTokens,
        selected: highlighted,
        ref: highlighted ? 'highlighted' : null,
        onHover: this.handleOptionHover,
        onClick: this.handleOptionClick,
      });
    }.bind(this));

    var selectedOption = this.state.selected;
    var active = !this.props.disabled && this.state.focus;
    var label;
    var value;

    var classes = {
      'select': true,
      'select--stretch': this.props.fillWidth
    };

    var states = {
      'open': active,
      'closed': !active,
      'disabled': this.props.disabled
    };

    if (selectedOption) {
      label = selectedOption.get(this.props.labelField);
      value = selectedOption.get(this.props.valueField);
    }

    return (
      <div
        className={cx(classes, {states})}
        role='listbox'
        aria-haspopup='true'
        aria-activedescendant={active}
        tabIndex="0"
        onFocus={this.handleFocus}
        onClick={this.open}
        onBlur={this.handleBlur}
      >
        <div className="mediacat-select__value-label">{selectedOption ? label : <span className="mediacat-select__placeholder">{this.props.placeholder}</span>}</div>
        <div className="mediacat-select__open-button"><Icon glyph="down-arrow" /></div>
        <input 
          disabled={this.props.disabled}
          type="hidden" 
          name={this.props.name}
          value={value}
          ref="input" />
        {active ? <SelectOptions
          options={options}
          onClose={this.close}
          onCursorUp={this.moveUp}
          onCursorDown={this.moveDown}
          onEnter={this.enter}
        /> : null}
      </div>
    );
  }
});

module.exports = Select;
