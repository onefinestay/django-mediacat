import React from 'react/addons';

import cx from '../../bem-cx';
import ThemeMixin from '../../mixins/theme-mixin';

const PureRenderMixin = React.addons.PureRenderMixin;


var Toolbar = React.createClass({
  mixins: [ThemeMixin, PureRenderMixin],

  getInitialState() {
    return {
      open: true
    };
  },

  render() {
    var classes = {
      'toolbar': true
    };
    var theme = this.getTheme();

    return (
      <div className={cx(classes, {theme})}>
        {this.props.children}
      </div>
    );
  }
});

export default Toolbar;
