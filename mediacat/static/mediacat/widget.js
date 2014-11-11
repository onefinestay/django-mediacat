/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/*!*****************************!*\
  !*** ./static/js/widget.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(/*! ../css/widget */ 14);
	
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
	      var left   = (screen.width  - width) / 2;
	      var top    = (screen.height - height) / 2;
	      var params = 'width='+width+', height='+height;
	      params += ', top='+top+', left='+left;
	
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
	        libraryURL += '&crops=' + crops
	      }
	
	      if (previewWidth) {
	        libraryURL += '&previewWidth=' + previewWidth;
	      }
	
	      var newwindow = window.open(libraryURL,'name', params);
	
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

/***/ },

/***/ 14:
/*!********************************!*\
  !*** ./static/css/widget.scss ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(/*! !./~/extract-text-webpack-plugin/loader.js?{"remove":true}!./~/css-loader?sourceMap=true!./~/autoprefixer-loader!./~/sass-loader?precision=10&outputStyle=expanded&sourceMap=true!./static/css/widget.scss */ 15);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(/*! ./~/style-loader/addStyles.js */ 27)(content);
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/andrewingram/environments/onefinestay/src/django-mediacat/node_modules/extract-text-webpack-plugin/loader.js?{\"remove\":true}!/Users/andrewingram/environments/onefinestay/src/django-mediacat/node_modules/css-loader/index.js?sourceMap=true!/Users/andrewingram/environments/onefinestay/src/django-mediacat/node_modules/autoprefixer-loader/index.js!/Users/andrewingram/environments/onefinestay/src/django-mediacat/node_modules/sass-loader/index.js?precision=10&outputStyle=expanded&sourceMap=true!/Users/andrewingram/environments/onefinestay/src/django-mediacat/static/css/widget.scss", function() {
			var newContent = require("!!/Users/andrewingram/environments/onefinestay/src/django-mediacat/node_modules/extract-text-webpack-plugin/loader.js?{\"remove\":true}!/Users/andrewingram/environments/onefinestay/src/django-mediacat/node_modules/css-loader/index.js?sourceMap=true!/Users/andrewingram/environments/onefinestay/src/django-mediacat/node_modules/autoprefixer-loader/index.js!/Users/andrewingram/environments/onefinestay/src/django-mediacat/node_modules/sass-loader/index.js?precision=10&outputStyle=expanded&sourceMap=true!/Users/andrewingram/environments/onefinestay/src/django-mediacat/static/css/widget.scss");
			if(typeof newContent === 'string') newContent = [module.id, newContent, ''];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 15:
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./~/extract-text-webpack-plugin/loader.js?{"remove":true}!./~/css-loader?sourceMap=true!./~/autoprefixer-loader!./~/sass-loader?precision=10&outputStyle=expanded&sourceMap=true!./static/css/widget.scss ***!
  \*****************************************************************************************************************************************************************************************************************/
/***/ function(module, exports, __webpack_require__) {

	// removed by extract-text-webpack-plugin

/***/ },

/***/ 27:
/*!*************************************!*\
  !*** ./~/style-loader/addStyles.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {};
	
	module.exports = function(list) {
		if(true) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
		var styles = listToStyles(list);
		addStylesToDom(styles);
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j]));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j]));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			// var sourceMap = item[3];
			var part = {css: css, media: media/*, sourceMap: sourceMap*/};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function addStyle(obj) {
		var styleElement = document.createElement("style");
		var head = document.head || document.getElementsByTagName("head")[0];
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		applyToTag(styleElement, obj);
		return function(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media /*&& newObj.sourceMap === obj.sourceMap*/)
					return;
				applyToTag(styleElement, obj = newObj);
			} else {
				head.removeChild(styleElement);
			}
		};
	};
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		// var sourceMap = obj.sourceMap;
	
		// No browser support
		// if(sourceMap && typeof btoa === "function") {
			// try {
				// css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
			// } catch(e) {}
		// }
		if(media) {
			styleElement.setAttribute("media", media)
		}
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	
	}


/***/ }

/******/ })
//# sourceMappingURL=widget.js.map