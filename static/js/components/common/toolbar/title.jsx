import React from 'react/addons';

import cx from '../../bem-cx';
import ThemeMixin from '../../mixins/theme-mixin';

const PureRenderMixin = React.addons.PureRenderMixin;


var ToolbarTitle = React.createClass({
	mixins: [ThemeMixin, PureRenderMixin],

  render() {
    var classes = {
      'toolbar__title': true
    };
    var theme = this.getTheme();

    return (
      <div className={cx(classes, {theme})}>{this.props.children}</div>
    );
  }
});

export default ToolbarTitle;
