"use strict";

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');

var iconfont = require('gulp-iconfont');

gulp.task('icon', function(){
  gulp.src(['static/fonts/mediacat/svg/*.svg'])
    .pipe(iconfont({
      fontName: 'mediacat-icons', // required
      appendCodepoints: true // recommended option
    }))
      .on('codepoints', function(codepoints, options) {
        // CSS templating, e.g.
        console.log(codepoints, options);
      })
    .pipe(gulp.dest('static/fonts/mediacat/'));
});