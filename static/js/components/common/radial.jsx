var React = require('react/addons');
var PureRenderMixin = require('react').addons.PureRenderMixin;

var RadialLoader = React.createClass({
  mixins: [PureRenderMixin],
  
  render: function() {
    return (
      <div className="mediacat-radialloader">
        <div className="mediacat-radialloader__container mediacat-radialloader__container--a">
          <div className="mediacat-radialloader__circle mediacat-radialloader__circle--a"></div>
          <div className="mediacat-radialloader__circle mediacat-radialloader__circle--b"></div>
          <div className="mediacat-radialloader__circle mediacat-radialloader__circle--c"></div>
          <div className="mediacat-radialloader__circle mediacat-radialloader__circle--d"></div>
        </div>
        <div className="mediacat-radialloader__container mediacat-radialloader__container--b">
          <div className="mediacat-radialloader__circle mediacat-radialloader__circle--e"></div>
          <div className="mediacat-radialloader__circle mediacat-radialloader__circle--f"></div>
          <div className="mediacat-radialloader__circle mediacat-radialloader__circle--g"></div>
          <div className="mediacat-radialloader__circle mediacat-radialloader__circle--h"></div>
        </div>
        <div className="mediacat-radialloader__container mediacat-radialloader__container--c">
          <div className="mediacat-radialloader__circle mediacat-radialloader__circle--i"></div>
          <div className="mediacat-radialloader__circle mediacat-radialloader__circle--j"></div>
          <div className="mediacat-radialloader__circle mediacat-radialloader__circle--k"></div>
          <div className="mediacat-radialloader__circle mediacat-radialloader__circle--l"></div>
        </div>
      </div>
    );
  }
});

module.exports = RadialLoader;