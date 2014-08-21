"use strict";

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');

var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var sketch = require("gulp-sketch");

var fontName = 'mediacat-icons';


gulp.task('icon', function(){
  return gulp.src("./static/fonts/mediacat/master/*.sketch")
    .pipe(sketch({
      export: 'artboards',
      formats: 'svg'
    }))
    .pipe(iconfontCss({
      fontName: fontName,
      path: 'css',
      targetPath: '../icons.css',
      fontPath: './fonts/'
    }))    
    .pipe(iconfont({
      fontName: 'mediacat-icons',
      appendCodepoints: false
    }))
    .pipe(gulp.dest('./mediacat/static/mediacat/fonts/'));
});