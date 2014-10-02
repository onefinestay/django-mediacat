 "use strict";

var Fluxxor = require('fluxxor');
var Immutable = require('immutable');
var request = require('superagent');
var django = require('../utils/superagent-django');

var constants = require('../constants');

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

var sortChain = function() {
  /*
   * Chain sorting functions, so that if the result from one is zero (ie equal), we try the next one
   */
  return function(a, b) {
    var result;

    for (var f in arguments) {
      result = f(a, b);
      if (result !== 0) {
        return result;
      }
    }
    return result;
  }
};

var MediaStore = Fluxxor.createStore({
  initialize: function(options) {
    this.bindActions(
      constants.CATEGORY_SELECTED, this.onCategorySelect,
      constants.MEDIA_GET_START, this.onMediaGetStart,
      constants.MEDIA_GET_SUCCESS, this.onMediaGetSuccess,    
      constants.MEDIA_SELECTED, this.onMediaSelect,
      constants.UPLOAD_SUCCESS, this.onUploadSuccess,
      constants.ASSOCIATIONS_CREATE_START, this.onAssociationsCreateStart,
      constants.SET_VIEW_MODE, this.onSetViewMode,
      constants.CROP_SELECTED, this.onCropSelect,
      constants.SET_MEDIA_SORT, this.onSetSort,
      constants.MEDIA_SET_RATING, this.onSetRating,
      constants.MEDIA_MOVE_BEFORE, this.onMoveBefore,
      constants.MEDIA_MOVE_AFTER, this.onMoveAfter      
    );
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

  onMediaGetStart: function(payload) {
    var request = payload.request;
    var requests = this.state.get('fetchRequests');

    if (!requests) {
      requests = Immutable.Map();
    }
    requests = requests.set(payload.category.get('path'), request);

    this.state = this.state.set('fetchRequests', requests);
    this.emit('change');
  },  

  onMediaGetSuccess: function(payload) {
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
    this.state = this.state.withMutations(function(state) {
      if (payload.category.get('accepts_images') && state.get('viewMode') === 'detail') {
        state = state.set('viewMode', 'grid');  
      }
      state = state.set('media', Immutable.Sequence());
      state = state.set('selectedMedia', null);
      state = state.set('selectedCrop', null);      
    })
    this.emit('change');
  },

  onUploadSuccess: function(payload) {
    var categoryPath = payload.categoryPath;
    var newImage;

    if (payload.categoryPath === this.flux.stores['Categories'].state.get('selectedPath')) {
      newImage = Immutable.fromJS(payload.data);
      this.state = this.state.updateIn(['media'], media => media.push(newImage));
      this.emit('change');
    }
  }
});

module.exports = MediaStore;
