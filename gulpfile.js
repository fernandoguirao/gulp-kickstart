/* global require */
'use strict';

// VARIABLES

var gulp = require('gulp'),
    less = require('gulp-less'),
    jade = require('gulp-jade'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    combineMediaQueries = require('gulp-combine-media-queries'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin = require('gulp-cssmin'),
    notify = require('gulp-notify'),
    imagemin = require('gulp-imagemin'),
    changed = require('gulp-changed'),
    pngcrush = require('imagemin-pngcrush');


// LESS

gulp.task('less', function() {
  gulp.src('./src/less/app.less')
  .pipe(less({
    compress: true
  }))
  .pipe(combineMediaQueries())
  .pipe(autoprefixer())
  .pipe(cssmin())
  .pipe(gulp.dest('./dist/assets/css/'))
  .pipe(browserSync.reload({stream:true}))
  .pipe(notify({ message: 'less compiled' }));
});
 

// JADE

gulp.task('jade', function() {
  return gulp.src('./lib/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(notify({ message: 'jade compiled' }));
});

// IMAGES

// minify new images
gulp.task('imagemin', function() {
  var imgSrc = './src/images/**/*',
      imgDst = './dist/assets/images';
 
  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngcrush()]
      }))
    .pipe(gulp.dest(imgDst));
});

// SERVER

// Watch files for changes
gulp.task('watch', ['browser-sync'], function() {
  // Watch JADE files
  gulp.watch('./lib/**/*.jade', ['jade']);
  // Watch Sass files
  gulp.watch('./src/less/**/*', ['less']);
  // Watch JS files
  // gulp.watch('src/js/**/*', ['js']);

  // Watch image files
  // gulp.watch('src/images/raster/*', ['images']);
  // // Watch SVG files
  // gulp.watch('src/images/vector/*', ['svgs']);
  // Watch HTML
  gulp.watch('./dist/*.html', reload);
});

gulp.task('browser-sync', function() {
    browserSync.init(['./dist/assets/css/**.*', './dist/assets/js/**.*'], {
        server: {
            baseDir: './dist/'
        }
    });
});

// DEFAULTS

gulp.task('default', ['less','jade','imagemin','watch','browser-sync']);