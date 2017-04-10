const gulp = require('gulp');
const concat = require('gulp-concat');
const changed = require('gulp-changed');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const runSequence = require('run-sequence');
const stylus = require('gulp-stylus');
const inject = require('gulp-inject');
const clean = require('gulp-clean');
const ngAnnotate = require('gulp-ng-annotate');
const uglify = require('gulp-uglifyjs');

const codebase = './public/build'
const htmlSource = ['./src/**/*.html', '!./src/index.html', '!./src/location.html']
const cssSource = ['./src/components/utils/*.styl', './src/pages/**/*.styl', './src/components/**/*.styl']
const jsSource = ['./app.js', './app-router.js',
  './src/pages/**/*.js', './src/services/**/*.js', './src/components/**/*.js'
]
let files = {};

gulp.task('clean', function() {
  return gulp.src(codebase, { read: false })
    .pipe(clean());
});

gulp.task('html', function() {
  gulp.src(htmlSource)
    .pipe(plumber())
    .pipe(changed(codebase))
    .pipe(gulp.dest(codebase))
});

gulp.task('src-js', function() {
  files.js =
    gulp.src(jsSource)
    .pipe(changed(codebase))
    .pipe(plumber())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('main.js'))
    .pipe(ngAnnotate())
    // .pipe(uglify())
    .pipe(gulp.dest(codebase))
});

gulp.task('src-styl', function() {
  files.css =
    gulp.src(cssSource)
    .pipe(changed(codebase))
    .pipe(concat('main.styl'))
    .pipe(stylus())
    .pipe(concat('main.css'))
    .pipe(gulp.dest(codebase))
});

gulp.task('inject', function() {
  gulp.src(['./src/index.html', './src/location.html'])
    .pipe(gulp.dest('./public'));
})

// 开发时，使用watch监测变化并重新build
gulp.task('default', ['build'], function() {
  gulp.watch(htmlSource, ['html']);
  gulp.watch(cssSource, ['src-styl']);
  gulp.watch(jsSource, ['src-js']);
});

gulp.task('build', function() {
  runSequence('clean', 'html', 'src-styl', 'src-js', 'inject')
})
