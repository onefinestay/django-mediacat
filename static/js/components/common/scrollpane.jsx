var React = require('react/addons');
var Immutable = require('immutable');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = require('../bem-cx');

var elementMetrics = require('../../utils/element-metrics');


var ScrollPaneHandle = React.createClass({
  render: function() {
    var style;

    if (this.props.direction === 'vertical') {
      style = {
        height: this.props.handleSize + '%',
        top: this.props.position + '%',
        bottom: null
      };
    } else {
      style = {
        width: this.props.handleSize + '%',
        left: this.props.position + '%',
        right: null
      };
    }

    return (
      <div className="mediacat-scrollbar__track">      
        <div className="mediacat-scrollbar__handle" style={style} onMouseDown={this.props.onDrag} />
      </div>
    );
  }
});


var ScrollPane = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    return {
      dragging: false,
      dragMode: null,
      dragPrevX: null,
      dragPrevY: null,
      scrollY: 0,
      scrollX: 0,
      width: null,
      height: null,
      contentWidth: null,
      contentHeight: null
    };
  },

  updateDOMDimensions: function() {
    var el = this.getDOMNode();

    var contentNode = this.refs.content.getDOMNode();

    this.setState({
      width: el.offsetWidth,
      height: el.offsetHeight,
      contentWidth: contentNode.offsetWidth,
      contentHeight: contentNode.offsetHeight,
      observer: null,
    });
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (prevProps !== this.props) {
      this.updateDOMDimensions();
    }
  },  

  componentDidMount: function() {
    this.updateDOMDimensions();
    window.addEventListener('resize', this.updateDOMDimensions); 

    var el = this.getDOMNode();

    var observer = new MutationObserver(function(mutations) {
      this.updateDOMDimensions();
    }.bind(this));

    var config = {
      subtree: true,
      childList: true
    };

    observer.observe(el, config);
    this.setState({observer});
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.updateDOMDimensions);

    if (this.state.observer) {
      this.state.observer.disconnect();
    }
  },

  handleDragX: function(event) {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    this.setState({
      dragging: true,
      dragMode: 'horizontal',
      dragPrevX: event.clientX
    });
  },    

  handleDragY: function(event) {
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    this.setState({
      dragging: true,
      dragMode: 'vertical',
      dragPrevY: event.clientY
    });
  },

  handleMouseMove: function(event) {
    var dX;
    var dY;
    var handleX;
    var handleY;
    var newScrollX = this.state.scrollX;
    var newScrollY = this.state.scrollY;

    if (this.state.dragging) {
      if (this.state.dragMode === 'horizontal') {
        dX = event.clientX - this.state.dragPrevX;

        if (Math.abs(dX) > 0) {
          handleX = 100 * (this.state.width / this.state.contentWidth);
          dX = 100 * (dX / this.state.width);

          newScrollX = newScrollX + dX;

          if (newScrollX > 100 - handleX) {
            newScrollX = 100 - handleX;
          } else if (newScrollX < 0) {
            newScrollX = 0;
          }
        }
      } else {
        dY = event.clientY - this.state.dragPrevY;

        if (Math.abs(dY) > 0) {
          handleY = 100 * (this.state.height / this.state.contentHeight);
          dY = 100 * (dY / this.state.height);

          newScrollY = newScrollY + dY;

          if (newScrollY > 100 - handleY) {
            newScrollY = 100 - handleY;
          } else if (newScrollY < 0) {
            newScrollY = 0;
          }
        }
      }

      this.setState({
        dragPrevX: event.clientX,
        dragPrevY: event.clientY,
        scrollY: newScrollY,
        scrollX: newScrollX
      });
    }
  },

  handleMouseUp: function(event) {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);    

    this.setState({
      dragging: false,
      dragMode: null,
      dragPrevX: null,
      dragPrevY: null
    });
  },

  handleWheel: function(event) {
    if (this.state.width && this.state.height) {
      var shouldScrollHorizontal = this.state.contentWidth > this.state.width;
      var shouldScrollVertical = this.state.contentHeight > this.state.height;

      event.preventDefault();
      event.stopPropagation();
      var dY;
      var handleY;
      var handleX;
      var newScrollX = this.state.scrollX;
      var newScrollY = this.state.scrollY;

      if (Math.abs(event.deltaY) > 0 && shouldScrollVertical) {
        handleY = 100 * (this.state.height / this.state.contentHeight);
        dY = 100 * (event.deltaY / this.state.contentHeight);

        newScrollY = newScrollY + dY;

        if (newScrollY > 100 - handleY) {
          newScrollY = 100 - handleY;
        } else if (newScrollY < 0) {
          newScrollY = 0;
        }
      }

      if (Math.abs(event.deltaX) > 0 && shouldScrollHorizontal) {
        handleX = 100 * (this.state.width / this.state.contentWidth);
        dX = 100 * (event.deltaX / this.state.contentWidth);

        newScrollX = newScrollX + dX;

        if (newScrollX > 100 - handleX) {
          newScrollX = 100 - handleX;
        } else if (newScrollX < 0) {
          newScrollX = 0;
        }
      }

      this.setState({
        scrollY: newScrollY,
        scrollX: newScrollX
      });
    }
  },

  render: function() {
    var readyToDisplay = this.state.width && this.state.height;
    var verticalHandleSize;
    var horizontalHandleSize;
    var contentStyles;
    var translateX = 0;

    var classes = {
      'scrollpane': true
    };

    var states = {
      'loading': !readyToDisplay
    }

    var translateY = 0;

    if (readyToDisplay) {
      var shouldScrollHorizontal = this.state.contentWidth > this.state.width;
      var shouldScrollVertical = this.state.contentHeight > this.state.height;

      if (shouldScrollVertical) {
        verticalHandleSize = 100 * (this.state.height / this.state.contentHeight);
        translateY = -this.state.scrollY;
      }

      if (shouldScrollHorizontal) {
        horizontalHandleSize = 100 * (this.state.width / this.state.contentWidth);
        translateX = -this.state.scrollX;
      }      

      contentStyles = {
        'transform': 'translate3d(' + translateX + '%, ' + translateY + '%, 0)'
      };

      var viewportClasses = {
        'scrollpane__viewport': true,
        'scrollpane__viewport--scrolls-vertically': shouldScrollVertical,
        'scrollpane__viewport--scrolls-horizontally': shouldScrollHorizontal
      };

      return (
        <div className={cx(classes, {states})} onWheel={this.handleWheel}>
          {shouldScrollVertical &&
          <div className="mediacat-scrollbar mediacat-scrollbar--vertical" ref="vertical-scrollbar">
            <ScrollPaneHandle ref="vertical-scrollbar-handle" direction="vertical" handleSize={verticalHandleSize} position={this.state.scrollY} onDrag={this.handleDragY} />
          </div>}
          {shouldScrollHorizontal && <div className="mediacat-scrollbar mediacat-scrollbar--horizontal" ref="horizontal-scrollbar">
            <ScrollPaneHandle ref="horizontal-scrollbar-handle" direction="horizontal" handleSize={horizontalHandleSize} position={this.state.scrollX} onDrag={this.handleDragX} />
          </div>}
          <div className={cx(viewportClasses, {states})} ref="viewport">
          <div className="mediacat-scrollpane__content" style={contentStyles} ref="content">
            {this.props.children}
          </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={cx(classes, {states})}>
          <div className="mediacat-scrollpane__viewport" ref="viewport">
          <div className="mediacat-scrollpane__content" ref="content">
            {this.props.children}
          </div>        
          </div>
        </div>
      );
    }
  }
});

module.exports = ScrollPane;