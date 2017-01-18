'use strict';

var gulp = require('gulp'),
  watch = require('gulp-watch'),
  prefixer = require('gulp-autoprefixer'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  cssmin = require('gulp-minify-css'),
  imagemin = require('gulp-imagemin');
  //amdOptimize = require('amd-optimize'),
  //concat = require('gulp-concat');
  //rigger = require('gulp-rigger'),
  //plumber = require('gulp-plumber'),
  /* //server
  browserSync = require("browser-sync"),
  reload = browserSync.reload;
  */
   
var path = {
  build: {
    html: 'build/',
    php: 'build/',
    js: 'build/assets/js/',
    css: 'build/assets/css/',
    img: 'build/assets/images/',
    fonts: 'build/assets/font/'
  },

  src: {
    html: 'src/**/*.html',
    php: 'src/**/*.php',
    js: 'src/js/**/*.js',
    style: 'src/scss/main.scss',
    img: 'src/images/**/*.*',
    fonts: 'src/font/**/*.*'
  },

  watch: {
    html: 'src/**/*.html',
    php: 'src/**/*.php',
    js: 'src/js/**/*.js',
    style: 'src/scss/**/*.scss',
    img: 'src/img/**/*.*',
    fonts: 'src/font/**/*.*'
  },

  clean: './build'
};

/*
var config = {
  server: {
    baseDir: "./build"
  },
  tunnel: true,
  host: 'localhost',
  port: 9000,
  logPrefix: "Frontend_Devil"
};
*/


gulp.task('html:build', function () {
  gulp.src(path.src.html)
    //.pipe(rigger())
    .pipe(gulp.dest(path.build.html));
    //.pipe(reload({stream: true}));
});

gulp.task('php:build', function () {
  gulp.src(path.src.php)
    .pipe(gulp.dest(path.build.php));
    //.pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
  gulp.src(path.src.js)
    //.pipe(rigger())
    //.pipe(sourcemaps.init())
    //.pipe(uglify())
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.js));
    //.pipe(reload({stream: true}));
});

gulp.task('css:build', function () {
  gulp.src(path.src.style)
    //.pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(prefixer())
    .pipe(cssmin())
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css));
    //.pipe(reload({stream: true}));
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
    //.pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts));
    //.pipe(reload({stream: true}));
});

gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

gulp.task('build', [
  'html:build',
  'php:build',
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