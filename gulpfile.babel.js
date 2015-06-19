import gulp from "gulp";
import imagemin from 'gulp-imagemin';
import rename from "gulp-rename";
import replace from 'gulp-replace';
import sketch from 'gulp-sketch';
import svgSprite from "gulp-svg-sprite";

const fontName = 'mediacat-icons';

const iconConfig = {
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

const imageMinOptions = {
  svgoPlugins: [
    { removeTitle: true },
    { removeDesc: true },
    { removeUselessStrokeAndFill: false },
  ]
};

gulp.task('icons', () =>
  gulp.src('./static/icons/**/*.svg')
    .pipe(imagemin(imageMinOptions))
    .pipe(svgSprite(iconConfig))
    .pipe(replace(' fill="#000"', ''))
    .pipe(rename('mediacat-icons.svg'))
    .pipe(gulp.dest("./mediacat/templates/mediacat")));

gulp.task('sketch', () =>
  gulp.src('./static/icons/*.sketch')
    .pipe(sketch({
      export: 'artboards',
      formats: 'svg'
    }))
    .pipe(gulp.dest('./static/icons/mediacat-icons')));

gulp.task('icon-pipeline', ['sketch', 'icons']);
