var parseDimension = function(d) {
  return parseFloat(d) || 0
};


var elementStyles = function(el) {
  return window.getComputedStyle(el);
};


var innerWidth = function(el) {
  var styles = elementStyles(el);
  var boxModel = styles['boxSizing'];
  var width = parseDimension(styles['width']);

  if (boxModel === 'border-box') {
    width -= parseDimension(styles['paddingLeft']);
    width -= parseDimension(styles['paddingRight']);
  }

  return width;
}

var innerHeight = function(el) {
  var styles = elementStyles(el);
  var boxModel = styles['boxSizing'];
  var height = parseDimension(styles['height']);

  if (boxModel === 'border-box') {
    height -= parseDimension(styles['paddingTop']);
    height -= parseDimension(styles['paddingBottom']);
  }

  return height;
}

var leftEdge = function(el) {
  var styles = elementStyles(el);
  var boxModel = styles['boxSizing'];
  var result = el.getBoundingClientRect().left;

  if (boxModel === 'border-box') {
    result -= parseDimension(styles['paddingLeft']);
  }
  return result
};

var rightEdge = function(el) {
  var styles = elementStyles(el);
  var boxModel = styles['boxSizing'];
  var result = el.getBoundingClientRect().right;

  if (boxModel === 'border-box') {
    result += parseDimension(styles['paddingRight']);
  }
  return result
};

var topEdge = function(el) {
  var styles = elementStyles(el);
  var boxModel = styles['boxSizing'];
  var result = el.getBoundingClientRect().top;

  if (boxModel === 'border-box') {
    result -= parseDimension(styles['paddingTop']);
  }
  return result
};

var bottomEdge = function(el) {
  var styles = elementStyles(el);
  var boxModel = styles['boxSizing'];
  var result = el.getBoundingClientRect().bottom;

  if (boxModel === 'border-box') {
    result += parseDimension(styles['paddingBottom']);
  }
  return result
};

module.exports = {
  innerWidth, innerHeight, leftEdge, rightEdge, topEdge, bottomEdge
};