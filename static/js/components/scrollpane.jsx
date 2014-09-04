/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;
var cx = React.addons.classSet;


var ScrollPaneHandle = React.createClass({
  render: function() {
    var style;

    if (this.props.direction === 'vertical') {
      style = {
        height: this.props.handleSize + '%',
        top: this.props.position + '%'        
      };
    } else {
      style = {
        width: this.props.handleSize + '%',
        left: this.props.position + '%'        
      };
    }

    return (
      <div className="scrollpane-scrollbar-track">      
        <div className="scrollpane-scrollbar-handle" style={style} onMouseDown={this.props.onDrag} />
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
    var contentEl = el.querySelector(" .scrollpane-content");

    this.setState({
      width: el.offsetWidth,
      height: el.offsetHeight,
      contentWidth: contentEl.offsetWidth,
      contentHeight: contentEl.offsetHeight
    });
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (prevProps !== this.props) {
      this.updateDOMDimensions();
    }
  },

  componentDidMount: function() {
    this.updateDOMDimensions();
    this.getDOMNode().addEventListener('load', this.updateDOMDimensions);    
    window.addEventListener('resize', this.updateDOMDimensions); 
  },

  componentWillUnmount: function() {
    this.getDOMNode().removeEventListener('load', this.updateDOMDimensions);    
    window.removeEventListener('resize', this.updateDOMDimensions);
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
    var verticalHandleStyles;
    var verticalHandleSize;
    var horizontalHandleStyles;
    var horizontalHandleSize;
    var contentStyles;
    var translateX = 0;
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
        'scrollpane-viewport': true,
        'scrollpane-viewport-vertical-scrollbar': shouldScrollVertical,
        'scrollpane-viewport-horizontal-scrollbar': shouldScrollHorizontal
      };

      return (
        <div className="scrollpane" onWheel={this.handleWheel}>
          {shouldScrollVertical &&
          <div className="scrollpane-scrollbar scrollpane-scrollbar-vertical">
              <ScrollPaneHandle direction="vertical" handleSize={verticalHandleSize} position={this.state.scrollY} onDrag={this.handleDragY} />
          </div>}
          {shouldScrollHorizontal && <div className="scrollpane-scrollbar scrollpane-scrollbar-horizontal">
            <ScrollPaneHandle direction="horizontal" handleSize={horizontalHandleSize} position={this.state.scrollX} onDrag={this.handleDragX} />
          </div>}
          <div className={cx(viewportClasses)}>
          <div className="scrollpane-content" style={contentStyles}>
            {this.props.children}
          </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="scrollpane scrollpane-loading">
          <div className="scrollpane-viewport">
          <div className="scrollpane-content">
            {this.props.children}
          </div>        
          </div>
        </div>
      );
    }
  }
});

module.exports = ScrollPane;