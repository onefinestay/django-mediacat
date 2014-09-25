var parseDimension = function(d) {
  return parseFloat(d) || 0
};


var elementStyles = function(el) {
  return window.getComputedStyle(el);
};


var innerWidth = function(el) {
  var styles = elementStyles(el);
  var boxModel = styles['box-sizing'];
  var width = parseDimension(styles['width']);

  if (boxModel === 'border-box') {
    width -= parseDimension(styles['padding-left']);
    width -= parseDimension(styles['padding-right']);
  }

  return width;
}

var innerHeight = function(el) {
  var styles = elementStyles(el);
  var boxModel = styles['box-sizing'];
  var height = parseDimension(styles['height']);

  if (boxModel === 'border-box') {
    height -= parseDimension(styles['padding-top']);
    height -= parseDimension(styles['padding-bottom']);
  }

  return height;
}

module.exports = {
  innerWidth, innerHeight
};