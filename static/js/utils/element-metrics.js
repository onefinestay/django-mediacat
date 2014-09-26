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

module.exports = {
  innerWidth, innerHeight
};