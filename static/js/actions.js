"use strict";

var Constants = require('./constants');

var CropService = require('./services/crop-service');
var MediaService = require('./services/media-service');
var RestService = require('./services/rest-service');

var uuid = require('uuid-v4');

var restRoot = '/mediacat';


var associationService = new RestService({
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

var mediaService = new MediaService({
  root: restRoot,
  resource: 'images'
});


var Actions = {
  media: {
    select: function(media) {
      var mediaId = media.get('id');
      this.dispatch(Constants.MEDIA_SELECTED, {media});

      var query = {
        image: mediaId
      };

      var cropRequest = cropService.get(query).then(function(response) {
        var data = response.body;     
        this.dispatch(Constants.CROP_GET_SUCCESS, {data, request: cropRequest, mediaId});
      }.bind(this));
      this.dispatch(Constants.CROP_GET_START, {media, request: cropRequest});

      var associationRequest = associationService.get(query).then(function(response) {
        var data = response.body;
        this.dispatch(Constants.ASSOCIATION_GET_SUCCESS, {data, request: associationRequest, mediaId});
      }.bind(this));
      this.dispatch(Constants.ASSOCIATION_GET_START, {media, request: associationRequest});
    },

    setRating: function(media, rating) {
      mediaService.patch(media.get('id'), {rating})
      this.dispatch(Constants.MEDIA_SET_RATING, {media, rating});
    },

    moveBefore: function(media, target) {
      this.dispatch(Constants.MEDIA_MOVE_BEFORE, {media, target});

      var patchData = this.flux.store('Media').state.get('media').map(function(media) {
        return {
          id: media.get('id'), 
          rank: media.get('rank')
        };
      });
      
      // This is fire-and-forget, because the result of the action is already in the stores and UI
      mediaService.patchMany(patchData.toJS());
    },

    moveAfter: function(media, target) {
      this.dispatch(Constants.MEDIA_MOVE_AFTER, {media, target});

      var patchData = this.flux.store('Media').state.get('media').map(function(media) {
        return {
          id: media.get('id'), 
          rank: media.get('rank')
        }; 
      });

      // This is fire-and-forget, because the result of the action is already in the stores and UI
      mediaService.patchMany(patchData.toJS());
    },

    addAssociation: function(category, media) {
      var categoryPath = category.get('path');
      var mediaId = media.get('id');

      var data = {
        content_type: category.get('content_type_id'),
        object_id: category.get('object_id'),
        image: mediaId
      };

      var request = associationService.create(data).then(function(response) {
        var data = response.body;
        this.dispatch(Constants.ASSOCIATIONS_CREATE_SUCCESS, {data, request, categoryPath, mediaId});
      }.bind(this));
      this.dispatch(Constants.ASSOCIATIONS_CREATE_START, {category, media, request});
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

    delete: function(crop) {
      var request = cropService.delete(crop.get('uuid')).then(function(response) {
        var data = response.body;
        this.dispatch(Constants.CROP_DELETE_SUCCESS, {data, request, cropId: crop.get('uuid')});
      }.bind(this));
      this.dispatch(Constants.CROP_DELETE_START, {request, crop});
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
      var categoryPath = category.get('path');
      var categoryRequest = categoryService.getOne(categoryPath).then(function(response) {
        var data = response.body;
        this.dispatch(Constants.CATEGORY_GET_SUCCESS, {data, request: categoryRequest, categoryPath});
      }.bind(this));
      this.dispatch(Constants.CATEGORY_GET_START, {category, request: categoryRequest});

      if (category.get('accepts_images')) {
        var content_type_id = category.get('content_type_id');
        var object_id = category.get('object_id');

        var query = {
          content_type_id: content_type_id,
          object_id: object_id,
        };

        var mediaRequest = mediaService.get(query).then(function(response) {
          var data = response.body;     
          this.dispatch(Constants.MEDIA_GET_SUCCESS, {data, request: mediaRequest, categoryPath});
        }.bind(this));
        this.dispatch(Constants.MEDIA_GET_START, {category, request: mediaRequest});
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
      var categoryPath = category.get('path');
      var categoryRequest = categoryService.getOne(categoryPath).then(function(response) {
        var data = response.body;
        this.dispatch(Constants.CATEGORY_GET_SUCCESS, {data, request: categoryRequest, categoryPath});
      }.bind(this));
      this.dispatch(Constants.CATEGORY_GET_START, {category, request: categoryRequest});
    }
  },

  uploads: {
    add: function(file, category) {
      var id = uuid();
      var categoryPath = category.get('path');

      var onProgress = function(event) {
        this.dispatch(Constants.UPLOAD_PROGRESS, {event, id, file, categoryPath});
      }.bind(this);

      var onTransferComplete = function(event) {
        this.dispatch(Constants.UPLOAD_TRANSFER_COMPLETE, {event, id, file, categoryPath});
      }.bind(this);        

      var request = mediaService.upload(file, category, onProgress, onTransferComplete).then(function(response) {
        var data = response.body;
        this.dispatch(Constants.UPLOAD_SUCCESS, {data, id, file, categoryPath, request});
      }.bind(this));
      this.dispatch(Constants.UPLOAD_START, {id, file, categoryPath, request});
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
