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

    fetchSuccess: function(response, categoryPath) {
      var data = response.body;
      var request = response.req;
      this.dispatch(Constants.FETCH_IMAGES_SUCCESS, {data, request, categoryPath});
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

    move: function(crop, media, dX, dY) {
      this.dispatch(Constants.CROP_MOVE, {crop, media, dX, dY});
    },

    resize: function(crop, media, dX, dY, position) {
      this.dispatch(Constants.CROP_RESIZE, {crop, media, dX, dY, position});
    },

    add: function(media, cropType) {
      this.dispatch(Constants.CROP_ADD, {media, cropType});
    },

    save: function(crop) {
      this.dispatch(Constants.CROP_SAVE, {crop});
    },

    saveSuccess: function(response, cropId) {
      var data = response.body;
      var request = response.req;      
      this.dispatch(Constants.CROP_SAVE_SUCCESS, {data, request, cropId})
    },

    fetch: function(response,  mediaId) {
      var data = response.body;
      var request = response.req;
      this.dispatch(Constants.CROP_FETCH, {data, request, mediaId});
    },

    fetchError: function(response) {
      console.log(response);
    }    
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
    },

    progress: function(event, id, file, categoryPath) {
      this.dispatch(Constants.UPLOAD_PROGRESS, {event, id, file, categoryPath});
    },

    load: function(event, id, file, categoryPath) {
      this.dispatch(Constants.UPLOAD_LOAD, {event, id, file, categoryPath});
    },

    complete: function(response, id, file, categoryPath) {
      this.dispatch(Constants.UPLOAD_COMPLETE, {response, id, file, categoryPath});      
    }
  }
};

module.exports = Actions;