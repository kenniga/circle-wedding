var gulp         = require('gulp');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var sass         = require('gulp-sass');
var concat       = require('gulp-concat');
var minify       = require('gulp-minify-css');
var merge        = require('merge-stream');
var autoprefixer = require('gulp-autoprefixer');
var order        = require('gulp-order');
var cssimport    = require('gulp-cssimport');


var PATHS = {
  scripts: [
    'node_modules/jquery/dist/jquery.js',
    'semantic/dist/semantic.js',
    'node_modules/flickity/dist/flickity.pkgd.js',
    'node_modules/fullpage.js/dist/jquery.fullpage.js',
    'src/js/script.js'
  ]
};

gulp.task('styles', function () {

  var cssStream = gulp.src([
          'semantic/dist/semantic.css',
          'node_modules/flickity/css/flickity.css',
          'node_modules/fullpage.js/dist/jquery.fullpage.css'
        ])
        .pipe(concat('all.css'));

  var customSassStream = gulp.src(['src/sass/main.scss'])
        .pipe(concat('custom.css'))
        .pipe(sass());

  var mergedStream = merge(customSassStream, cssStream)
        .pipe(order(['all.css', 'custom.css']))
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({
          suffix: ".min",
          extname: ".css"
        }))
        .pipe(gulp.dest('dist/css/'));

  return mergedStream;
});

gulp.task('watch', function () {
    gulp.watch('src/sass/**/*.scss', function() {
        gulp.run('styles');
    });
});

gulp.task('icons', function () {
  return gulp.src(['semantic/src/themes/basic/assets/fonts/icons.eot', 'semantic/src/themes/basic/assets/fonts/icons.ttf', 'semantic/src/themes/basic/assets/fonts/icons.woff', 'node_modules/trumbowyg/dist/ui/icons.svg'])
           .pipe(gulp.dest('dist/fonts'));
});

gulp.task('scripts', function () {
  return gulp.src(PATHS.scripts)
          .pipe(concat('script.js'))
          .pipe(gulp.dest('dist/js/'));
});

gulp.task('default', ['styles', 'scripts', 'icons', 'watch']);
