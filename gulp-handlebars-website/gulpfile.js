'use strict';

 /*
  * @author dcliment
  * version 0.0.1
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
// Templates / Handlebars
var inlinesource    = require('gulp-inline-source');
var fs              = require('fs');
var handlebars      = require('gulp-hb');
var htmlmin         = require('gulp-htmlmin');
var layouts         = require('handlebars-layouts');
var path            = require('path');
var replace         = require('gulp-replace');
var yaml            = require('js-yaml'); // load yml template 

//handlebars.Handlebars.registerHelper(layouts(handlebars.Handlebars));

// Destination ~ note: if you use relative ./ it wont work in watch if you add new file
var src={
    root:"src/",
    sass:"src/sass/",
    css:"src/css/",
    js:"src/js/",
    jsLib:"src/js/lib/",
    handlebars: "src/handlebars/",
    data:"src/data/",
    images:"src/img/"
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
  Fonts
*/
gulp.task('fonts', function() {
  return gulp.src('src/font/*')
    .pipe(plumber())
    .pipe(gulp.dest(dist.fonts));
});

/*
  Templates AKA Handlebars
*/
gulp.task('templates:old', function() {
  //var templateData = yaml.safeLoad(fs.readFileSync('data.yml', 'utf-8'));
  var templateData = requireJsons(["data"]);
  //console.log(templateData);
  var cardsData = require('./src/data/cards.json');
  var options = {
    ignorePartials: false, //ignores the unknown footer2 partial in the handlebars template, defaults to false
    batch: [src.handlebars+'layouts/', src.handlebars+'partials/', src.data],
    helpers: {
      capitals: function(str) {
        return str.toUpperCase();
      },
    },
  };

  return gulp.src(src.handlebars+'pages/**/*.hbs')
    .pipe(plumber())
    .pipe(handlebars(templateData, options))
    .pipe(rename(function(path) {
      path.extname = '.html';
    }))
    .pipe(gulp.dest(dist.root));
});

// Advanced 
 
gulp.task('templates', function () {
  var hbStream = handlebars()
    // Partials 
    .partials('./src/handlebars/layouts/**/*.{hbs,js}')
    .partials('./src/handlebars/partials/**/*.{hbs,js}')
    .partials({
      boo: '{{#each boo}}{{greet}}{{/each}}',
      far: '{{#each far}}{{length}}{{/each}}'
    })

    // Helpers 
    .helpers(require('handlebars-layouts'))
    .helpers('./helpers/**/*.js')
    //.helpers({
      //foo: function () { ... },
      //bar: function () { ... }
    //})

    // Decorators 
    //.decorators('./decorators/**/*.js')
    //.decorators({
     // baz: function () { ... },
      //qux: function () { ... }
    //})

    // Data 
    .data('data.json')
    .data('./src/data/**/*.{js,json}')
    .data({
      lorem: 'dolor',
      ipsum: 'sit amet'
    });

  return gulp
    .src(src.handlebars+'pages/**/*.hbs')
    .pipe(plumber())
    .pipe(hbStream)
    .pipe(rename(function(path) {
      path.extname = '.html';
    }))
    .pipe(gulp.dest(dist.root));
});


/* =-=-=-=-=-=-=-=-=-=-=---==-=-=-=-=-=-=-=-=-=-= */
gulp.task('templates:optimized', ['templates'], function() {
  return gulp.src('./dist/**/*.html')
    .pipe(inlinesource())
    .pipe(replace(/\.\.\//g, ''))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
    }))
    .pipe(gulp.dest(dist.root));
});

function requireJsons(fileNames) {
  return fileNames.reduce(function(jsons, fileName) {
    jsons[fileName] = require(fileNames[i] + '.json');
    return jsons;
  }, {});
}
/*
  Tasks
*/
gulp.task('clean', function(cb) {
  return rimraf(dist.root, cb);
});

/*
  Gulp Tasks
*/
gulp.task('deploy', ['build:optimized']);

gulp.task('watch', function() {
  gulp.watch([src.handlebars + 'pages/**/*.hbs', src.handlebars + 'layouts/**/*.hbs', src.handlebars + 'partials/**/*.hbs', src.data+"**/*.json", "data.json"], ['templates'], reload);
  gulp.watch('src/sass/**/*.scss', ['sass'], reload);
  gulp.watch('src/img/**/*', ['images'], reload);
  gulp.watch([src.js+'**/*.js', 'gulpfile.js'], ['js'], reload);
  gulp.watch(src.css+'**/*.css', ['css'], reload);
});

gulp.task('build', function (cb) {
  return runSequence('clean', ['sass', 'css', 'images', 'fonts', 'js', 'templates'], cb);
});

gulp.task('build:optimized', function(cb) {
  return runSequence('clean',
    ['sass:optimized', 'css', 'images:optimized', 'fonts', 'js', 'templates:optimized'],
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