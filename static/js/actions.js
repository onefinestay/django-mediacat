"use strict";

var Constants = require('./constants');

var Actions = {
  media: {
    select: function(media) {
      this.dispatch(Constants.MEDIA_SELECTED, {media});
    },

    fetch: function(category, filters) {
      this.dispatch(Constants.FETCH_IMAGES, {category, filters});
    },

    fetchSuccess: function(response) {
      var data = response.body;
      this.dispatch(Constants.FETCH_IMAGES_SUCCESS, {data});
    },

    fetchError: function(response) {
      console.log(response);
    }
  },

  categories: {
    select: function(category) {
      this.dispatch(Constants.CATEGORY_SELECTED, {category});
    }
  }
};

module.exports = Actions;