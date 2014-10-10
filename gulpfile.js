"use strict";

var gulp = require("gulp");
var rename = require("gulp-rename");
var sketch = require("gulp-sketch");
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');

var fontName = 'mediacat-icons';

gulp.task('icon', function() {
  return gulp.src('./static/fonts/icons.sketch')
  .pipe(sketch({
    export: 'artboards',
    compact: true,
    clean: true,
    formats: 'svg'
  }))
  .pipe(iconfont({
    fontName: fontName
  }))
  .on('codepoints', function(codepoints) {
    var options = {
      glyphs: codepoints,
      fontName: fontName,
      fontPath: '../fonts/build/', // set path to font (from your CSS file if relative)
      className: 'icon' // set class name in your CSS
    };
    gulp.src('./static/fonts/template.scss')
      .pipe(consolidate('lodash', options))
      .pipe(rename({basename: '_icon' }))
      .pipe(gulp.dest('./static/css/generated/')); // set path to export your CSS
  })
  .pipe(gulp.dest('./static/fonts/build/')); // set path to export your fonts
});

gulp.task('watch', function() {
  gulp.watch(paths.sketch, ['icon']);
});