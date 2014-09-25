 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');
var request = require('superagent');
var django = require('../utils/superagent-django');

var Constants = require('../constants');

var ascSorter = function(a, b) {
  // Sort ascending, null values come first
  if (a === b) {
    return 0;
  }
  if (a === null || a < b) {
    return -1;
  }
  if (b === null || a > b) {
    return 1;
  }
  return 0;
};

var descSorter = function(a, b) {
  // Sort descending, null values come last
  if (a === b) {
    return 0;
  }    

  if (b === null || b < a) {
    return -1;
  }
  if (a === null || b > a) {
    return 1;
  }
  return 0;
};


var MediaStore = Fluxxor.createStore({
  actions: {
    CATEGORY_SELECTED: 'onCategorySelect',
    MEDIA_SELECTED: 'onMediaSelect',
    FETCH_IMAGES_SUCCESS: 'onFetchImagesSuccess',
    UPLOAD_COMPLETE: 'onUploadComplete',
    ADD_ASSOCIATION: 'onAddAssociation',
    SET_VIEW_MODE: 'onSetViewMode',
    CROP_SELECTED: 'onCropSelect',
    SET_MEDIA_SORT: 'onSetSort',
    MEDIA_SET_RATING: 'onSetRating',
    MEDIA_MOVE_BEFORE: 'onMoveBefore',
    MEDIA_MOVE_AFTER: 'onMoveAfter'
  },

  initialize: function(options) {
    this.setMaxListeners(0);
    this.state = Immutable.fromJS(options);
  },

  sortOptions: Immutable.fromJS([
    {value: 'manual_asc', label: 'Manual'},
    {value: 'rating_desc', label: 'Rating (Highest First)'},
    {value: 'rating_asc', label: 'Rating (Lowest First)'},
    {value: 'date_desc', label: 'Date Uploaded (Newest First)'},
    {value: 'date_asc', label: 'Date Uploaded (Oldest First)'}
  ]),

  sorters: {
    manual_asc: (a, b) => ascSorter(a.get('rank'), b.get('rank')),
    rating_asc: (a, b) => ascSorter(a.get('rating'), b.get('rating')),
    rating_desc: (a, b) => descSorter(a.get('rating'), b.get('rating')),
    date_asc: (a, b) => ascSorter(new Date(a.get('date_created')), new Date(b.get('date_created'))),
    date_desc: (a, b) => descSorter(new Date(a.get('date_created')), new Date(b.get('date_created')))
  },

  getSortedMedia: function() {
    var sort = this.state.get('sortBy');

    return this.state.get('media').sort(this.sorters[sort]);
  },

  getFetchRequest: function(category, filters) {
    var categoryPath = null;
    var content_type_id = null;
    var object_id = null;

    if (category) {
      categoryPath = category.get('path');
      content_type_id = category.get('content_type_id');
      object_id = category.get('object_id');
    }

    var query = {
      content_type_id: content_type_id,
      object_id: object_id,
    };

    var onSuccess = function(response) {
      this.flux.actions.media.fetchSuccess(response, categoryPath);
    }.bind(this);

    return request
      .get('/mediacat/images/')
      .query(query)
      .set('Accept', 'application/json')
      .on('error', this.flux.actions.media.fetchError)
      .end(onSuccess);
  },

  getPatchRequest: function(media, data) {
    var url = '/mediacat/images/' + media.get('id') + '/';

    var onSuccess = function(response) {
      this.flux.actions.media.saveSuccess(response, media);
    }.bind(this);    

    return request
      .patch(url)
      .send(data)
      .set('Accept', 'application/json')
      .on('error', this.flux.actions.media.saveError)
      .end(onSuccess);
  },

  getBatchPatchRequest: function(data) {
    var url = '/mediacat/images/';

    var onSuccess = function(response) {
      //this.flux.actions.media.batchSaveSuccess(response);
    }.bind(this);    

    return request
      .patch(url)
      .send(data)
      .set('Accept', 'application/json')
      .on('error', this.flux.actions.media.batchSaveError)
      .end(onSuccess);    
  },

  getSelectedMedia: function() {
    var id = this.state.get('selectedMedia');

    if (!id) {
      return null;
    }
    return this.state.get('media').find(m => m.get('id') === id);
  },

  onSetRating: function(payload) {
    var index = this.state.get('media').indexOf(payload.media);
    this.getPatchRequest(payload.media, {rating: payload.rating});
    this.state = this.state.updateIn(['media', index], media => media.set('rating', payload.rating));
    this.emit('change');
  },

  reorderMedia: function(sortedMedia, oldIndex, newIndex) {
    var idList = sortedMedia.map(m => m.get('id'));
    var newIdList;

    var el = idList.get(oldIndex);
    newIdList = idList.splice(oldIndex, 1).splice(newIndex, 0, el);

    var media = this.state.get('media').map((m, i) => m.set('rank', newIdList.indexOf(m.get('id'))));
    this.state = this.state.set('media', media);

    this.emit('change');    

    var data = media.map(function(media, i) {
      return {
        id: media.get('id'), 
        rank: media.get('rank')
      }; 
    });
    this.getBatchPatchRequest(data.toJS());
  },  

  onMoveBefore: function(payload) {
    var sortedMedia = this.getSortedMedia();

    var media = payload.media;
    var target = payload.target;

    var startIndex = sortedMedia.indexOf(media);
    var endIndex = sortedMedia.indexOf(target);

    if (startIndex !== null && endIndex !== null) {
      if (startIndex !== endIndex - 1) {
        if (endIndex > startIndex) {
          endIndex --;
        }
        this.reorderMedia(sortedMedia, startIndex, endIndex);
      }
    }
  },

  onMoveAfter: function(payload) {
    var sortedMedia = this.getSortedMedia();

    var media = payload.media;
    var target = payload.target;

    var startIndex = sortedMedia.indexOf(media);
    var endIndex = sortedMedia.indexOf(target);

    if (startIndex !== null && endIndex !== null) {
      if (endIndex < startIndex) {
        endIndex ++;
      }      
      if (startIndex !== endIndex) {
        this.reorderMedia(sortedMedia, startIndex, endIndex);
      }
    }    
  },

  onSetViewMode: function(payload) {
    this.state = this.state.set('viewMode', payload.mode);
    this.emit('change');
  },

  onSetSort: function(payload) {
    this.state = this.state.set('sortBy', payload.sort);
    this.emit('change');
  },

  onCropSelect: function(payload) {
    var mode = this.state.get('viewMode');

    if (mode === 'grid') {
      this.state = this.state.set('viewMode', 'filmstrip');  
      this.emit('change');
    }   
  },

  onFetchImagesSuccess: function(payload) {
    var categoryPath = payload.categoryPath;

    var req = payload.request;
    var media = Immutable.fromJS(payload.data);

    var requests = this.state.get('fetchRequests');
    var key = requests.findKey((v, k) => v === req);
    requests = requests.delete(key);
    this.state = this.state.set('fetchRequests', requests);

    if (payload.categoryPath === this.flux.stores['Categories'].state.get('selectedPath')) {
      this.state = this.state.set('media', media);
    }
    this.emit('change');
  },

  onMediaSelect: function(payload) {
    this.state = this.state.withMutations(function(state) {
      state.set('selectedMedia', payload.media.get('id')).set('selectedCrop', null);
    });
    this.emit('change');
  },

  onCategorySelect: function(payload) {
    if (payload.category.get('accepts_images')) {
      var mode = this.state.get('viewMode');

      if (mode === 'detail') {
        this.state = this.state.set('viewMode', 'grid');  
      }

      var req = this.getFetchRequest(payload.category, null);

      var requests = this.state.get('fetchRequests');

      if (!requests) {
        requests = Immutable.Map();
      }
      requests = requests.set(payload.category.get('path'), req);

      this.state = this.state.withMutations(function(state) {
        state
          .set('media', Immutable.Sequence())
          .set('fetchRequests', requests);
      });
    } else {
      this.state = this.state.set('media', Immutable.Sequence());
    }

    this.state = this.state.set('selectedMedia', null);
    this.state = this.state.set('selectedCrop', null);

    this.emit('change');
  },

  onUploadComplete: function(payload) {
    var categoryPath = payload.categoryPath;
    var newImage;

    if (payload.categoryPath === this.flux.stores['Categories'].state.get('selectedPath')) {
      newImage = Immutable.fromJS(payload.response.body);
      this.state = this.state.updateIn(['media'], media => media.push(newImage));
      this.emit('change');
    }
  },

  onAddAssociation: function(payload) {
    var categoryPath = payload.category.get('path')
    var image = payload.media;

    var data = {
      content_type: payload.category.get('content_type_id'),
      object_id: payload.category.get('object_id'),
      image: image.get('id')
    };

    var onSuccess = function(response) {
      this.flux.actions.media.addAssociationSuccess(response, categoryPath);
    }.bind(this);

    if (image.get('associations').count() === 0) {
      var index = this.state.get('media').findIndex(m => m.get('id') === image.get('id'));
      if (index > -1) {
        this.state = this.state.update('media', media => media.remove(index));
        this.emit('change');
      }
    }    

    return request
      .post('/mediacat/associations/')
      .use(django)
      .send(data)
      .set('Accept', 'application/json')
      .on('error', this.flux.actions.media.addAssociationError)
      .end(onSuccess);
  }
});

module.exports = MediaStore;
