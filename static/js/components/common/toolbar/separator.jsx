import React from 'react/addons';

import cx from '../../bem-cx';
import ThemeMixin from '../../mixins/theme-mixin';

const PureRenderMixin = React.addons.PureRenderMixin;


var ToolbarSeparator = React.createClass({
	mixins: [ThemeMixin, PureRenderMixin],

  render() {
    var classes = {
      'toolbar__separator': true
    };
    var theme = this.getTheme();

    return (
      <div className={cx(classes, {theme})} />
    );
  }
});

export default ToolbarSeparator;
