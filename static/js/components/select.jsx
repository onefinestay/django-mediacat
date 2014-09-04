/** @jsx React.DOM */
"use strict";

var React = require('react/addons');
var _ = require('underscore');
var Sifter = require('sifter');
var cx = React.addons.classSet;

var SearchResult = React.createClass({
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
    var classes = cx({
      'select-result': true,
      'selected': !!this.props.selected
    });

    return (
      <li className={classes}
        onMouseEnter={this.props.onHover.bind(null, this.props.option)}
        onMouseDown={this.props.onClick.bind(null, this.props.option)}>
        {this.props.label}
      </li>
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

    searchField: React.PropTypes.array, // array of search fields

    options: React.PropTypes.array.isRequired, // array of objects
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
      resultRenderer: SearchResult,
    };
  },

  getInitialState: function() {
    var selected = null;
    if (this.props.value) {
      // find selected value
      selected = _.find(this.props.options, function(option) {
        return option[this.props.valueField] == this.props.value;
      }, this);
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

  //
  // events
  //
  handleInput: function(event) {
    var keys = {
      13: this.enter,
      38: this.moveUp,
      40: this.moveDown,
      8: this.remove
    };

    if (_.contains(_.keys(keys), event.keyCode + "")) {
      if (typeof keys[event.keyCode] == 'function') {
        keys[event.keyCode](event);
      }
    }
  },

  handleChange: function(event) {
    event.preventDefault();

    var query = event.target.value;

    var searcher = new Sifter(this.props.options);

    var result = searcher.search(query, {
      fields: this.props.searchField
    });

    var options = _.map(result.items, function(res) {
      return this.props.options[res.id];
    }, this);

    var highlighted = _.first(options);

    this.setState({
      query: query,
      options: options,
      searchTokens: result.tokens,
      highlighted: highlighted,
    });
  },

  handleFocus: function(event) {
    event.preventDefault();

    var highlighted;
    if (this.state.selected) {
      highlighted = _.find(this.state.options, function(option) {
        return option[this.props.valueField] == this.state.selected[this.props.valueField];
      }, this);
    } else {
      highlighted = _.first(this.state.options);
    }

    this.setState({
      focus: true,
      highlighted: highlighted
    });
  },

  handleBlur: function(event) {
    event.preventDefault();
    this.setState({
      focus: false
    });
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
      this.refs.input.getDOMNode().blur();
    } else {
      this.handleFocus(event);
      this.refs.input.getDOMNode().focus();
    }
  },

  moveUp: function(event) {
    var options = this.state.options;
    if (options.length > 0) {
      event.preventDefault();
      var index = _.indexOf(options, this.state.highlighted);
      if (!_.isUndefined(options[index - 1])) {
        this.setState({
          highlighted: options[index - 1]
        });
      }
    }
  },

  moveDown: function(event) {
    var options = this.state.options;
    if (options.length > 0) {
      event.preventDefault();
      var index = _.indexOf(options, this.state.highlighted);
      if (!_.isUndefined(options[index + 1])) {
        this.setState({
          highlighted: options[index + 1]
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
        highlighted: _.first(this.props.options),
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
      selected: option,
    });

    this.refs.input.getDOMNode().blur();

    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(option);
    }
  },

  componentDidMount: function() {
    this.updateScrollPosition();
  },

  componentDidUpdate: function() {
    this.updateScrollPosition();
  },

  render: function() {
    var options = _.map(this.state.options, function(option) {
      var value = option[this.props.valueField];

      var highlighted = this.state.highlighted &&
        value == this.state.highlighted[this.props.valueField];

      return this.props.resultRenderer({
        key: value,
        value: value,
        label: option[this.props.labelField],
        option: option,
        tokens: this.state.searchTokens,
        selected: highlighted,
        ref: highlighted ? 'highlighted' : null,
        onHover: this.handleOptionHover,
        onClick: this.handleOptionClick,
      });
    }, this);

    var classes = cx({
      'select-autocomplete': true,
      'in-focus': this.state.focus,
      'not-in-focus': !this.state.focus
    });

    var inputValue = '';
    var selected;

    if (this.state.query) {
      inputValue = this.state.query;
    } else if (this.props.value) {
      selected = _.find(this.props.options, function(option) {
        return option[this.props.valueField] == this.props.value;
      }, this);
      if (selected) {
        inputValue = selected[this.props.labelField];
      }
    }

    return (
      <div className={classes}>
        <input type="text" name={this.props.name}
          placeholder={this.props.placeholder}
          value={inputValue}
          disabled={this.props.disabled}
          onKeyDown={this.handleInput}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}

          autoComplete="off"
          ref="input" />

        <div className="select-autocomplete-icon" onMouseDown={this.handleArrowClick}>
          {this.state.focus ?
            <i className="fa fa-caret-up"></i> :
            <i className="fa fa-caret-down"></i>}
        </div>

        {this.state.focus ?
          <ul className="select-autocomplete-options" ref="options">
            {options}
          </ul> : null}
      </div>
    );
  }
});

module.exports = Select;