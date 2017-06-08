'use strict';

var gulp = require('gulp'),
  watch = require('gulp-watch'),
  prefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),
  gutil = require('gulp-util'),
  //rjs = require("gulp-rjs"),
  //amdOptimize = require('amd-optimize'),
  concat = require('gulp-concat'),
  //plumber = require('gulp-plumber'),
  //imagemin = require('gulp-imagemin');
  sass = require('gulp-sass'),
  cssmin = require('gulp-minify-css');
   
var path = {
  build: {
    html:  'build/',
    php:   'build/',
    htm:  'build/assets/js/',
    js:    'build/assets/js/',
    css:   'build/assets/css/',
    img:   'build/assets/images/',
    fonts: 'build/assets/font/'
  },

  src: {
    html:  'src/**/*.html',
    php:   'src/**/*.php',
    htm:  'src/js/**/*.htm',
    js:    'src/js/**/*.js',
    style: 'src/scss/main.scss',
    img:   'src/images/**/*.*',
    fonts: 'src/font/**/*.*'
  },

  watch: {
    html:  'src/**/*.html',
    php:   'src/**/*.php',
    htm:  'src/js/**/*.htm',
    js:    'src/js/**/*.js',
    style: 'src/scss/**/*.scss',
    img:   'src/img/**/*.*',
    fonts: 'src/font/**/*.*'
  },

  clean: './build'
};

gulp.task('html:build', function () {
  gulp.src(path.src.html)
    .pipe(gulp.dest(path.build.html));
});

gulp.task('php:build', function () {
  gulp.src(path.src.php)
    .pipe(gulp.dest(path.build.php));
});

gulp.task('htm:build', function () {
  gulp.src(path.src.htm)
    .pipe(gulp.dest(path.build.htm));
});

gulp.task('js:build', function () {
  gulp.src(path.src.js)
    //.pipe(sourcemaps.init())
    //.pipe(uglify())
    //.pipe(concat('main.js'))
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.js));
});

gulp.task('css:build', function () {
  gulp.src(path.src.style)
    //.pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(prefixer())
    .pipe(cssmin())
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css));
});

gulp.task('image:build', function () {
  gulp.src(path.src.img)
    //.pipe(plumber())
    //.pipe(imagemin({
    //    progressive: true,
    //    svgoPlugins: [{removeViewBox: false}],
    //    use: [pngquant()],
    //    interlaced: true
    //}))
    //.pipe(plumber.stop())
    .pipe(gulp.dest(path.build.img));
});

gulp.task('fonts:build', function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts));
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('build', [
  'html:build',
  'php:build',
  'htm:build',
  'js:build',
  'css:build',
  'fonts:build',
  'image:build'
]);

gulp.task('watch', function(){
  watch([path.watch.html], function(event, cb) {
    gulp.start('html:build');
  });
  watch([path.watch.php], function(event, cb) {
    gulp.start('php:build');
  });
  watch([path.watch.htm], function(event, cb) {
    gulp.start('htm:build');
  });
  watch([path.watch.style], function(event, cb) {
    gulp.start('css:build');
  });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js:build');
  });
  watch([path.watch.img], function(event, cb) {
    gulp.start('image:build');
  });
  watch([path.watch.fonts], function(event, cb) {
    gulp.start('fonts:build');
  });
});

gulp.task('default', ['build', 'watch']);