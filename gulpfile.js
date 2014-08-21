"use strict";

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');

var iconfont = require('gulp-iconfont');
var sketch = require("gulp-sketch");

gulp.task('icon', function(){
  return gulp.src("static/fonts/mediacat/master/*.sketch")
    .pipe(sketch({
      export: 'artboards',
      formats: 'svg'
    }))
    .pipe(iconfont({
      fontName: 'mediacat-icons', // required
      appendCodepoints: false // recommended option
    }))
      .on('codepoints', function(codepoints, options) {
        console.log(codepoints, options);
      })
    .pipe(gulp.dest('static/fonts/mediacat/'));
});