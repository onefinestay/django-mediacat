var namespace = 'mediacat'

function cx(classNames, options) {
  var classes;
  var states;
  var bemClasses = [];
  var baseClassName;
  var stateClassName;

  if (typeof classNames == 'object') {
    classes = Object.keys(classNames).filter(function(className) {
      return classNames[className];
    });
  } else {
    classes = classNames;
  }

  classes.forEach(function(className) {
    baseClassName = namespace + '-' + className;
    bemClasses.push(baseClassName);

    if (options && options['theme']) {
      bemClasses.push(baseClassName + '--theme-' + options['theme']);
    }

    if (options && options['states']) {
      states = options['states'];

      if (typeof states == 'object') {
        states = Object.keys(states).filter(function(stateName) {
          return states[stateName];
        });
      }

      states.forEach(function(state) {
        bemClasses.push(baseClassName + '--is-' + state);
        if (options.theme) {
          bemClasses.push(baseClassName + '--theme-' + options.theme + '--is-' + state);
        }
      });
    }
  });

  return bemClasses.join(' ');;
}

module.exports = cx;