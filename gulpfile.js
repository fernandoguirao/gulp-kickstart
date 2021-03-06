/* global require */
'use strict';

// VARIABLES

var gulp = require('gulp'),
    less = require('gulp-less'),
    // jade = require('gulp-jade'),
    jade = require('gulp-jade-php'),
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
  .pipe(gulp.dest('../lovster/assets/css/'))
  .pipe(browserSync.reload({stream:true}))
  .pipe(notify({ message: 'less compiled' }));
});
 

// JADE

gulp.task('templates', function() {
  return gulp.src('./lib/*.jade')
    .pipe(jade({
      pretty: true,
      locals: {
        title: 'OMG THIS IS THE TITLE'
      }
    }))
    .pipe(gulp.dest('../lovster/'))
    .pipe(notify({ message: 'jade compiled' }));
});

// IMAGES

// minify new images
gulp.task('imagemin', function() {
  var imgSrc = './src/images/**/*',
      imgDst = '../lovster/assets/images';
 
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
  gulp.watch('./lib/**/*.jade', ['templates']);
  // Watch Sass files
  gulp.watch('./src/less/**/*', ['less']);
  // Watch JS files
  // gulp.watch('src/js/**/*', ['js']);

  // Watch image files
  // gulp.watch('src/images/raster/*', ['images']);
  // // Watch SVG files
  // gulp.watch('src/images/vector/*', ['svgs']);
  // Watch HTML
  // gulp.watch('./dist/*.html', reload);
  gulp.watch('../lovster/*.php', reload);
});

gulp.task('browser-sync', function() {
    browserSync.init(['../lovster/assets/css/**.*', '../lovster/assets/js/**.*'], {
        // SI NO HAY SERVIDOR EXTERNO:
        // server: {
        //     baseDir: './dist/'
        // },
        proxy: {
          host: "localhost",
          port:8888
        }
    });
});

// DEFAULTS

gulp.task('default', ['less','templates','imagemin','watch','browser-sync']);