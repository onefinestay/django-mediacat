import React from 'react/addons';
import cx from 'classnames';

const PureRenderMixin = React.addons.PureRenderMixin;


const Icon = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    glyph: React.PropTypes.string.isRequired,
    size: React.PropTypes.oneOf(['large', 'medium', 'small'])
  },

  getDefaultProps() {
    return {
      size: 'medium',
    };
  },

  render() {
    var {glyph, size, ...props} = this.props;

    var classes = cx({
      ['mediacat-Icon']: true,
      [`mediacat-Icon--${ glyph }`]: true,
      [`mediacat-Icon--${ size }`]: true,
    });

    return (
      <div className={classes} {...props}>
        <svg className="mediacat-Icon__Container" dangerouslySetInnerHTML={{__html:
          `<use xlink:href=\"#mediacat-icons--${ glyph }\"></use>`
        }} />
      </div>
    );
  }
});

export default Icon;
