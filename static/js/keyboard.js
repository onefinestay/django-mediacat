var Mousetrap = require('mousetrap');
var Immutable = require('immutable');

class Keyboard {
  constructor() {
    this.keyStack = Immutable.fromJS([[]]);
  }

  push() {
    this.keyStack = this.keyStack.push(Immutable.fromJS([]));
    Mousetrap.reset();
  }

  pop() {
    if (this.keyStack.count() > 1) {
      Mousetrap.reset();      
      this.keyStack = this.keyStack.pop();
      this.keyStack.last().forEach(function(k) {
        Mousetrap.bind(k.key, k.action);
      })
    } else {
      throw new Error('Cannot pop the last level of keyboard bindings.');
    }
  }

  on(key, action) {
    this.keyStack = this.keyStack.updateIn([-1], keys => keys.push({key, action}));
    Mousetrap.bind(key, action);
  }

  off(key) {
    var index = this.keyStack.last().findIndex(k => k.key === key);

    if (index >= 0) {
      this.keyStack = this.keyStack.updateIn([-1], keys => keys.remove(index));
    }
    Mousetrap.unbind(key);
  }

  trigger(key) {
    Mousetrap.trigger(key);
  }
}

module.exports = Keyboard;