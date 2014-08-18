"use strict";

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var duration = require('gulp-duration');
var browserify = require('browserify');
var envify = require('envify/custom');
var mkpath = require('mkpath');
var glob = require('glob');
var watchify = require('watchify');
var reactify = require('reactify');
var prefix = require('gulp-autoprefixer');
var sass = require('gulp-sass')

var baseScripts = 'mediacat/static/mediacat/js/src/';
var baseBuild = 'mediacat/static/mediacat/js/build/';

var paths = {
  tests: baseScripts + '/**/__tests__/**/*.{js,jsx}',  
  scripts: baseScripts + '/**/*.{js,jsx}',
  entryScripts: baseScripts + '/**/init.{js,jsx}',
  scss: 'static/css/',
  cssOutput: 'mediacat/static/mediacat/css/'
};

var reactifyES6 = function(file) {
  return reactify(file, {
    es6: true,
    extension: ['jsx', 'js']
  });
};

gulp.task('sass', function () {
    gulp.src(paths.scss+ '*.scss')
        .pipe(sass())
        .pipe(prefix("last 1 version", "> 1%", "ie 9"))
        .pipe(gulp.dest(paths.cssOutput));
});

gulp.task("watch:css", function() {
  return gulp.watch(paths.scss + '*.scss', ['sass']);
});

gulp.task("watch", function() {
  gulp.run("watch:css");
  gulp.run("watch:js");
});