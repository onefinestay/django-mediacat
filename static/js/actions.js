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
      var request = response.req;
      this.dispatch(Constants.FETCH_IMAGES_SUCCESS, {data, request});
    },

    fetchError: function(response) {
      console.log(response);
    }
  },

  crop: {
    select: function(crop, media) {
      this.dispatch(Constants.CROP_SELECTED, {crop, media});
    },

    deselect: function(crop, media) {
      this.dispatch(Constants.CROP_DESELECTED, {crop, media});
    },

    move: function(crop, dX, dY) {
      this.dispatch(Constants.CROP_MOVE, {crop, dX, dY});
    },

    resize: function(crop, dX, dY, position) {
      this.dispatch(Constants.CROP_RESIZE, {crop, dX, dY, position});
    },
  },

  categories: {
    select: function(category) {
      this.dispatch(Constants.CATEGORY_SELECTED, {category});
    },

    open: function(category) {
      this.dispatch(Constants.CATEGORY_OPEN, {category});
    },

    close: function(category) {
      this.dispatch(Constants.CATEGORY_CLOSE, {category});
    },    

    fetchChildrenSuccess: function(response) {
      var data = response.body;
      var request = response.req;
      this.dispatch(Constants.FETCH_CATEGORY_CHILDREN_SUCCESS, {data, request});
    },

    fetchChildrenError: function(response) {
      console.log(response);
    },

    loadChildren: function(category) {
      this.dispatch(Constants.CATEGORY_LOAD_CHILDREN, {category});
    }
  },

  uploads: {
    add: function(file, category) {
      this.dispatch(Constants.UPLOAD_ADD, {file, category});
    }
  }
};

module.exports = Actions;