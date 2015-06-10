"use strict";

var gulp = require("gulp");
var rename = require("gulp-rename");
var consolidate = require('gulp-consolidate');

var fontName = 'mediacat-icons';


var imageMinOptions = {
  svgoPlugins: [
    { removeTitle: true },
    { removeDesc: true },
    { removeUselessStrokeAndFill: false },
  ]
};

gulp.task('icons', function () {
  var imagemin = require('gulp-imagemin');
  var replace = require('gulp-replace');
  var svgSprite = require("gulp-svg-sprite");
  var rename = require("gulp-rename");

  var config = {
    mode: {
      symbol: {
        inline: true,
        prefix: "#mediacat-icon-%s",
        example: false
      }
    },
    shape: {
      dimension: {
        attributes: true
      }
    }
  };

  return gulp.src('./static/icons/**/*.svg')
    .pipe(imagemin(imageMinOptions))
    .pipe(svgSprite(config))
    .pipe(replace(' fill="#000"', ''))
    .pipe(rename('mediacat-icons.svg'))
    .pipe(gulp.dest("./mediacat/templates/mediacat"));
});

gulp.task('sketch', function() {
  var sketch = require('gulp-sketch');

  return gulp.src('./static/icons/*.sketch')
    .pipe(sketch({
      export: 'artboards',
      formats: 'svg'
    }))
    .pipe(gulp.dest('./static/icons/mediacat-icons'));
});

gulp.task('icon-pipeline', ['sketch', 'icons']);