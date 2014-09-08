var React = require('react/addons');
var _ = require('underscore');

var MediacatPicker = React.createClass({

  handleClick: function(key) {
    var width  = screen.width * 0.75;
    var height = screen.height * 0.75;
    var left   = (screen.width  - width) / 2;
    var top    = (screen.height - height) / 2;
    var params = 'width='+width+', height='+height;
    params += ', top='+top+', left='+left;

    var libraryURL = '/media-library/';

    var category = this.props.category;

    if (category) {
      libraryURL += category + '/';
    }
    libraryURL += '?select';

    var previewWidth = this.props.previewWidth;
    var cropId = this.props.value.crop_id;
    var imageId = this.props.value.image_id;

    if (cropId && imageId) {
      libraryURL += '&selectedCropId=' + cropId;
      libraryURL += '&selectedImageId=' + imageId;
    }

    if (this.props.cropKey) {
      libraryURL += '&key=' + this.props.cropKey;
    }

    if (previewWidth) {
      libraryURL += '&previewWidth=' + previewWidth;
    }

    var newWindow = window.open(libraryURL,'name', params);

    window.dismissMediaLibrary = function(win, pk, url, image_pk) {
      if (this.props.onChange) {
        this.props.onChange(pk, url);
      }
      win.close();
      delete window.dismissMediaLibrary;
    }.bind(this);

    if (window.focus) {
      newWindow.focus();
    }
  },

  render: function() {
    var value = this.props.value;
    var ratio = this.props.ratio;

    var style = {
      width: '100%',
      'padding-bottom': (100 / ratio) + '%'
    };

    return (
      <div className="mediainput-widget">
        <div className="module-image-placeholder" style={style} />
        <img width="100%" className="mediainput-preview" src={value.previewURL} />
        <a onClick={this.handleClick} className="mediainput-library"><span className="icon-pencil"></span></a>
        <input
          ref="image"
          value={value.id}
          type="hidden"
          />
      </div>
    );
  }
});

module.exports = MediacatPicker;