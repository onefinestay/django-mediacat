function cx(classNames, namespace, theme) {
  var classes;
  var bemClasses = [];

  if (typeof classNames == 'object') {
    classes = Object.keys(classNames).filter(function(className) {
      return classNames[className];
    });
  } else {
    classes = classNames;
  }

  classes.forEach(function(className) {
    var baseClassName = namespace + '-' + className;
    bemClasses.push(baseClassName);

    if (theme) {
      bemClasses.push(baseClassName + '--theme-' + theme);
    }
  });

  return bemClasses.join(' ');;
}

module.exports = cx;