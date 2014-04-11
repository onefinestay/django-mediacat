"use strict";

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var sass = require('gulp-sass')
var browserify = require('browserify-middleware');
var factor = require('factor-bundle')
var mkpath = require('mkpath');
var glob = require('glob');

var baseScripts = 'mediacat/static/mediacat/js/src/';
var baseBuild = 'mediacat/static/mediacat/js/build/';

var paths = {
  tests: baseScripts + '/**/__tests__/**/*.{js,jsx}',
  scripts: baseScripts + '/**/*.{js,jsx}',
  entryScripts: baseScripts + '/**/init.{js,jsx}',
  scss: 'mediacat/static/mediacat/css/'
};

gulp.task('test', function () {
  var jsdom = require('jsdom');

  global.initDOM = function () {
    var jsdom = require('jsdom');
    global.window = jsdom.jsdom().createWindow('<html><body></body></html>');
    global.document = window.document;
    global.navigator = window.navigator;
  }

  global.cleanDOM = function() {
    delete global.window;
    delete global.document;
    delete global.navigator;
  }

  // Allows us to import .jsx files without going through browserify
  require('node-jsx').install({extension: '.jsx'});
  return gulp.src(paths.tests)
  .pipe(jasmine({
    verbose: true
  }));
});

gulp.task('build', function(cb) {
  glob(paths.entryScripts, function(err, files) {
    if (err) {
      cb(err);
    }

    var bundle = browserify({
      debug: false,
      basedir: './',
      entries: files.map(function(f) { return './' + f}),
      extensions: ['.js', '.json', '.jsx']
    });

    bundle.transform(require('reactify'));

    mkpath.sync('./' + baseBuild);

    glob(paths.tests, function(err, testFiles) {
      testFiles.forEach(function(f) {
        var sourcePath = './' + f;
        bundle.exclude(sourcePath);
      });
    });

    files.forEach(function(f) {
      var sourcePath = './' + f;
      var module = path.dirname(f).replace(baseScripts, '');
      bundle.require(sourcePath, {expose: module});
    });

    var dest = fs.createWriteStream('./' + baseBuild + 'bundle.js');
    var stream = bundle.bundle().pipe(dest);

    stream.on('close', function() {
      cb();
    });
  });
});

gulp.task('sass', function () {
    gulp.src(paths.scss+ '*.scss')
        .pipe(sass())
        .pipe(gulp.dest(paths.scss));
});

gulp.task("watch", function() {
  return gulp.watch(paths.scripts, function() {
    gulp.run("build");
  });
});