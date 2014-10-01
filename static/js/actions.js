"use strict";

var Constants = require('./constants');
var RestService = require('./services/rest-service');
var CropService = require('./services/crop-service');


var restRoot = '/mediacat';


var associationsService = new RestService({
  root: restRoot,
  resource: 'associations'
});

var categoryService = new RestService({
  root: restRoot,
  resource: 'categories'
});

var cropService = new CropService({
  root: restRoot,
  resource: 'crops'
});

var mediaService = new RestService({
  root: restRoot,
  resource: 'images'
});




var Actions = {
  media: {
    select: function(media) {
      this.dispatch(Constants.MEDIA_SELECTED, {media});

      var query = {
        image: media.get('id')
      };

      var request = cropService.get(query).then(function(response) {
        var data = response.body;     
        this.dispatch(Constants.CROP_GET_SUCCESS, {data, request, mediaId: media.get('id')});
      }.bind(this));
      this.dispatch(Constants.CROP_GET_START, {media, request});
    },

    setRating: function(media, rating) {
      mediaService.patch(media.get('id'), {rating})
      this.dispatch(Constants.MEDIA_SET_RATING, {media, rating});
    },

    moveBefore: function(media, target) {
      this.dispatch(Constants.MEDIA_MOVE_BEFORE,  {media, target});
    },

    moveAfter: function(media, target) {
      this.dispatch(Constants.MEDIA_MOVE_AFTER,  {media, target});
    },

    addAssociation: function(category, media) {
      this.dispatch(Constants.ADD_ASSOCIATION, {category, media});
    },

    addAssociationError: function(response) {
      console.log(response);
    },

    addAssociationSuccess: function(response, categoryPath) {
      this.dispatch(Constants.ADD_ASSOCIATION_SUCCESS, {response, categoryPath});
    },

    setViewMode: function(mode) {
      this.dispatch(Constants.SET_VIEW_MODE, {mode});
    },

    setSort: function(sort) {
      this.dispatch(Constants.SET_MEDIA_SORT, {sort});
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
      var request = cropService.update(crop.get('uuid'), crop.toJS()).then(function(response) {
        var data = response.body;
        this.dispatch(Constants.CROP_SAVE_SUCCESS, {data, request, cropId: crop.get('uuid')});
      }.bind(this));
      this.dispatch(Constants.CROP_SAVE_START, {request, crop});
    },

    pick: function(crop, previewWidth) {
      if (window.opener) {
        var request = cropService.pick(crop.get('uuid'), previewWidth).then(function(response) {
          var data = response.body;
          window.opener.dismissMediaLibrary(window, data.crop_id, data.url);
          this.dispatch(Constants.CROP_PICK_SUCCESS, {data, request, cropId: crop.get('uuid')});
        }.bind(this));
        this.dispatch(Constants.CROP_PICK_START, {request, crop}); 
      }
    },
  },

  categories: {
    select: function(category) {
      if (category.get('accepts_images')) {
        var categoryPath = category.get('path');
        var content_type_id = category.get('content_type_id');
        var object_id = category.get('object_id');

        var query = {
          content_type_id: content_type_id,
          object_id: object_id,
        };

        var request = mediaService.get(query).then(function(response) {
          var data = response.body;     
          this.dispatch(Constants.MEDIA_GET_SUCCESS, {data, request, categoryPath});
        }.bind(this));
        this.dispatch(Constants.MEDIA_GET_START, {category, request});
      }
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
  },

  dragging: {
    dragStart: function(media, x, y) {
      this.dispatch(Constants.DRAG_MEDIA_START, {media, x, y});
    },
    dragMove: function(x, y) {
      this.dispatch(Constants.DRAG_MEDIA_MOVE, {x, y});
    },
    dragEnd: function(x, y) {
      this.dispatch(Constants.DRAG_MEDIA_END, {x, y});
    }
  }
};

module.exports = Actions;
