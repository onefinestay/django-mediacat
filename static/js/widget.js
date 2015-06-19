require('../css/widget');

(function ($, window, document, undefined) {
  "use strict";

  var pluginName = "mediacat",
    defaults = {
      callback: null,
      category: null
    };

  // The actual plugin constructor
  function Plugin(element, options) {
    this.element = element;

    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.options = $.extend({}, defaults, options);

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var $el = $(this.element);
      this.input = $el.find('input');
      this.button = $el.find('.mediacat-mediainput-widget__trigger');
      this.preview = $el.find('.mediacat-mediainput-widget__preview');
      this.button.on('click', $.proxy(this.click, this));
      this.ul = null;
    },

    openLibrary: function(crops) {
      var width  = screen.width * 0.75;
      var height = screen.height * 0.75;
      var left   = (screen.width - width) / 2;
      var top    = (screen.height - height) / 2;
      var params = 'width=' + width + ', height=' + height;
      params += ', top=' + top + ', left=' + left;

      var libraryURL = '/mediacat/';

      var category = $(this.element).data('category');
      var categoryOverride = $(this.element).data('image-path');

      if (categoryOverride) {
        category = categoryOverride;
      }

      if (category) {
        libraryURL += category + '/';
      }
      libraryURL += '?select';

      var previewWidth = $(this.element).data('preview-width');
      var cropId = this.input.val();

      if (cropId) {
        libraryURL += '&selectedCrop=' + cropId;
      }

      if (crops) {
        libraryURL += '&crops=' + crops;
      }

      if (previewWidth) {
        libraryURL += '&previewWidth=' + previewWidth;
      }

      var newwindow = window.open(libraryURL, 'name', params);

      var self = this;

      window.dismissMediaLibrary = function(win, pk, url) {
        self.input.val(pk);
        self.input.trigger('change');
        self.preview.attr('src', url);

        if (self.options.callback) {
          self.options.callback(pk, url);
        }

        win.close();
        delete window.dismissMediaLibrary;
      };

      if (window.focus) {
        newwindow.focus();
      }
    },

    click: function(event) {
      event.preventDefault();
      var self = this;
      var crops = $(this.element).data('crops');
      this.openLibrary(crops);
    }
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
      }
    });
  };

})(jQuery, window, document );
