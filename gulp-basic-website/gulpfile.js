'use strict';

 /*
  * @author dcliment
  * version 0.0.2
  *
  */

// Global
var gulp            = require('gulp');
var plumber         = require('gulp-plumber'); 
var util            = require('gulp-util');
var rename          = require('gulp-rename');
var rimraf          = require('rimraf'); // remove (clean) dir
var runSequence     = require('run-sequence');
var sourcemaps      = require('gulp-sourcemaps');
// Built in Node
var fs              = require('fs');
var path            = require('path');
// Sync
var browserSync     = require('browser-sync').create();
var reload          = browserSync.reload;
// sass
var autoprefixer    = require('gulp-autoprefixer');
var cssnano         = require('gulp-cssnano');
var sass            = require('gulp-sass');
var scsslint        = require('gulp-scss-lint');
// JS
var jscs            = require('gulp-jscs');
var jshint          = require('gulp-jshint');
var uglify          = require('gulp-uglify');
// images
var imagemin        = require('gulp-imagemin');


// Destination ~ note: if you use relative ./ it wont work in watch if you add new file
var src={
    root:"src/",
    sass:"src/sass/",
    css:"src/css/",
    js:"src/js/",
    jsLib:"src/js/lib/",
    images:"src/img/",
    html:"src/html/"
};

var dist={
    root:"./dist/",
    css:'./dist/css/',
    js:'./dist/js/',
    images: "./dist/img",
    fonts: "./dist/font"
};

/* 
  SASS 
*/
gulp.task('sass:lint', function() {
  gulp.src(src.sass+'*.scss')
    .pipe(plumber())
    .pipe(scsslint());
});

gulp.task('sass:build', function() {
  gulp.src(src.sass+'**/*.scss')
    .pipe(rename({suffix: '.min'}))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
    }))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist.css));
});

gulp.task('sass:optimized', function() {
  return gulp.src(src.sass+'**/style.scss')
    .pipe(rename({suffix: '.min'}))
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'compressed',
    }))
    .pipe(autoprefixer())
    .pipe(cssnano({compatibility: 'ie8'}))
    .pipe(gulp.dest(dist.css));
});

gulp.task('sass', ['sass:lint', 'sass:build']);


/* 
  Already built CSS
    NOTE: add a css:build that checks if it is a minified version already, if not minify it. 
*/
gulp.task('css', function(){
  gulp.src(src.css+"*.css")
    .pipe(gulp.dest(dist.css+"lib/"));
});
/* 
  JS
*/
gulp.task('js:build', function() {
  return gulp.src(src.js+'**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist.js));
});

gulp.task('js:lint', function() {
  return gulp.src([src.js+'**/*.js', '!'+src.jsLib+'**/*.js', 'gulpfile.js'])
    .pipe(plumber())
    .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('js', ['js:lint', 'js:build']);

/* 
  Images
*/
gulp.task('images', function() {
  return gulp.src(src.images + '**/*')
    .pipe(plumber())
    .pipe(imagemin({
      progressive: true,
    }))
    .pipe(gulp.dest(dist.images));
});

gulp.task('images:optimized', function() {
  return gulp.src(src.images + '**/*')
    .pipe(plumber())
    .pipe(imagemin({
      progressive: true,
      multipass: true,
    }))
    .pipe(gulp.dest(dist.images));
});

/* 
  HTML processing
*/
gulp.task('html', function () {
  return gulp.src(src.html+"**/*.html")
    .pipe(gulp.dest(dist.root));
});

/* NOTES ADD MINIMIXING OR UGLYING HERE */
gulp.task('html:optimized', function(){
  return gulp.src(src.html)
    .pipe(gulp.dest(dist.root));
})

/*
  Fonts
*/
gulp.task('fonts', function() {
  return gulp.src('src/font/*')
    .pipe(plumber())
    .pipe(gulp.dest(dist.fonts));
});


/*
  GLOBAL Tasks
*/
gulp.task('clean', function(cb) {
  return rimraf(dist.root, cb);
});

/*
  Gulp Tasks
*/
gulp.task('deploy', ['build:optimized']);

gulp.task('watch', function() {
  gulp.watch([src.html+'**/*.html'], ['html'], reload);
  gulp.watch(src.sass+'**/*.scss', ['sass'], reload);
  gulp.watch(src.images+'**/*', ['images'], reload);
  gulp.watch([src.js+'**/*.js', 'gulpfile.js'], ['js'], reload);
  gulp.watch(src.css+'**/*.css', ['css'], reload);
});

gulp.task('build', function (cb) {
  return runSequence('clean', ['sass', 'css', 'images', 'fonts', 'js', 'html'], cb);
});

gulp.task('build:optimized', function(cb) {
  return runSequence('clean',
    ['sass:optimized', 'css', 'images:optimized', 'fonts', 'js', 'html:optimized'],
    cb);
});

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['build'], function() {

  // Serve files from the root of this project
  browserSync.init(['./dist/**/*'], {
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false,
    },
    server: {
      baseDir: './dist',
    },
  });

  // add browserSync.reload to the tasks array to make
  // all browsers reload after tasks are complete.
  gulp.start(['watch']);
});

gulp.task('default', ['serve']);

/* 
  Handle Errors 
*/
function handleError(err)
{
  console.log(err.toString());
  //this.emit('end');
  util.beep(3);
}


function errorHandler(error){
  util.beep(3);
  return true;
}