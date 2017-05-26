const gulp = require('gulp'),
  watch = require('gulp-watch'),
  pug = require('gulp-pug'),
  sass = require('gulp-sass'),
  prettify = require('gulp-prettify'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  minifyJS = require('gulp-minify'),
  minifyCSS = require('gulp-clean-css'),
  // cssBase64 = require('gulp-css-base64'),
  babel = require('gulp-babel'),
  del = require('del'),
  vinylPaths = require('vinyl-paths'),
  plumber = require('gulp-plumber'),
  runSequence = require('run-sequence'),
  htmlreplace = require('gulp-html-replace'),
  browserSync = require('browser-sync').create();

const pathSource = './src',
  pathBuild = './build',
  pathBuildCSS = `${pathBuild}/css`,
  pathBuildJS = `${pathBuild}/js`,
  pathViewsWatch = [
    `${pathSource}/views/**/*.pug`,
    `${pathSource}/components/**/*.pug`,
    `${pathSource}/metadata/**/*.pug`
  ],
  pathViewsInput = `${pathSource}/views/**/*.pug`,
  pathViewsOutput = `${pathSource}`,
  pathStylesWatch = [
    `${pathSource}/css/**/*.scss`,
    `${pathSource}/components/**/*.scss`
  ],
  pathStylesInput = `${pathSource}/css/style.scss`,
  pathStylesOutput = `${pathSource}/css`,
  pathScriptsComponentsWatch = [
    `${pathSource}/components/**/*.js`
  ],
  pathScriptsComponentsInput = [
    `${pathSource}/components/**/*.js`
  ],
  pathScriptsOutput = `${pathSource}/js`;

gulp.task('browserReload', function() {
  browserSync.reload();
});

gulp.task('viewCompailer', function () {
  return gulp.src(pathViewsInput)
      .pipe(plumber())
      .pipe(pug())
      .pipe(prettify({
        indent_inner_html: false,
        indent_size: 4
      }))
      .pipe(gulp.dest(pathViewsOutput));
});

gulp.task('styleCompailer', function () {
  return gulp.src(pathStylesInput)
      .pipe(plumber())
      .pipe(sass.sync())
      .pipe(autoprefixer())
      .pipe(gulp.dest(pathStylesOutput));
      // .pipe(browserSync.stream()); // reload browser in style stream
});

gulp.task('scriptComponentsCompailer', function () {
  return gulp.src(pathScriptsComponentsInput)
      .pipe(plumber())
      .pipe(concat('components.js'))
      .pipe(gulp.dest(pathScriptsOutput));
});

gulp.task('cleanBuild', function() {
  return gulp.src(pathBuild + '/*')
      .pipe(plumber())
      .pipe(vinylPaths(del));
});

gulp.task('viewBuild', function() {
  return gulp.src(pathViewsOutput + '/*.html')
      .pipe(plumber())
      .pipe(gulp.dest(pathBuild));
});

gulp.task('styleBuild', function() {
  return gulp.src(pathStylesOutput + '/**/*.css')
      .pipe(plumber())
      .pipe(concat('style.css'))
      /*.pipe(cssBase64({
        baseDir: pathSource + '/img',
       }))*/
      .pipe(gulp.dest(pathBuildCSS))
      .pipe(concat('style-min.css'))
      .pipe(minifyCSS())
      .pipe(gulp.dest(pathBuildCSS));
});

gulp.task('scriptBuild', function() {
  return gulp.src([
        pathScriptsOutput + '/libs/jquery.min.js',
        pathScriptsOutput + '/libs/**/*.js', 
        pathScriptsOutput + '/plugins/**/*.js',
        pathScriptsOutput + '/*.js'
      ])
      .pipe(plumber())
      .pipe(babel({presets: ['es2015']}))
      .pipe(concat('script.js'))
      .pipe(gulp.dest(pathBuildJS))
      .pipe(minifyJS())
      .pipe(gulp.dest(pathBuildJS));
});

gulp.task('fontsBuild', function() {
  return gulp.src(pathStylesOutput + '/fonts/**/*.*',
       { base: pathStylesOutput })
      .pipe(plumber())
      .pipe(gulp.dest(pathBuildCSS));
});

gulp.task('mediaBuild', function() {
  return gulp.src([
        pathSource + '/img/**/*.*', 
        pathSource + '/media/**/*.*'
      ], { base: pathSource })
      .pipe(plumber())
      .pipe(gulp.dest(pathBuild));
});

gulp.task('includeMinFiles', function() {
  gulp.src(pathBuild + '/*.html')
    .pipe(plumber())
    .pipe(htmlreplace({
      js: {
        src: null,
        tpl: '<script src="js/script-min.js" async></script>'
      },
      css: {
        src: null,
        tpl: '<link rel="stylesheet" href="css/style-min.css" media="all">'
      }
    }))
    .pipe(gulp.dest(pathBuild));
});

gulp.task('init', [
  'viewCompailer', 
  'styleCompailer', 
  'scriptComponentsCompailer'
]);

gulp.task('processBuild', [
  'viewBuild', 
  'styleBuild',
  'scriptBuild',
  'fontsBuild',
  'mediaBuild'
]);

gulp.task('build', function() {
  runSequence(
    'init', 
    'cleanBuild', 
    'processBuild', 
    'includeMinFiles'
  );
});

gulp.task('serve', function() {
  browserSync.init({
    server: pathSource,
    port: 8080
  });

  watch(pathViewsWatch, function() {
    runSequence('viewCompailer', 'browserReload');
  });

  watch(pathStylesWatch, function() {
    runSequence('styleCompailer', 'browserReload');
  });

  watch(pathScriptsComponentsWatch, function() {
    runSequence('scriptComponentsCompailer', 'browserReload');
  });
});

gulp.task('default', ['init', 'serve']);