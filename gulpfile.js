var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  merge = require('merge-stream'),
  browserSync = require('browser-sync').create();

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('img', function() {
  return gulp.src(['../../uploads/**/*.{png,PNG,jpg,JPG,jpeg,JPEG,gif,GIF}'], {
      base: '.'
    })
    .pipe($.newer('../../uploads'))
    .pipe($.imagemin())
    .pipe(gulp.dest('../uploads'))
    .pipe(browserSync.stream());
});

gulp.task('assets', function() {
  var css = gulp.src([
      'node_modules/slick-carousel/slick/ajax-loader.gif'
    ])
    .pipe(gulp.dest('assets/css'));

  var fonts = gulp.src([
      'node_modules/slick-carousel/slick/fonts/*',
      'node_modules/font-awesome/fonts/*'
    ])
    .pipe(gulp.dest('assets/fonts'));

  return merge(css, fonts);
});

gulp.task('js', function() {
  return gulp.src([
    'node_modules/slick-carousel/slick/slick.js',
    'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
    'node_modules/velocity-animate/velocity.js',
    'node_modules/waypoints/lib/jquery.waypoints.js',
    'node_modules/headroom.js/dist/headroom.js',
    'node_modules/headroom.js/dist/jQuery.headroom.js',
    'assets/js/plugins.js',
    'assets/js/acf-google-maps.js',
    'assets/js/main.js'
  ])
    .pipe($.concat('main.js', {
      newLine: ';'
    }))
    .pipe(gulp.dest('assets/js/concat'))
    .pipe($.uglify(false))
    .pipe($.rename('main.min.js'))
    .pipe(gulp.dest('assets/js/compiled'))
    .pipe(browserSync.stream());
});

gulp.task('sass', function() {
  return gulp.src([
      'assets/scss/master.scss',
      'assets/scss/login.scss'
    ])
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: [
        'node_modules/slick-carousel/slick/',
        'node_modules/font-awesome/scss',
        'node_modules/magnific-popup/dist/',
        'node_modules/normalize.css/',
        'node_modules/animate-sass/'
      ],
      outputStyle: 'compressed'
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: AUTOPREFIXER_BROWSERS
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function() {
  gulp.watch(['**/*.html', '**/*.php']).on('change', browserSync.reload);
  gulp.watch(['../../uploads/**/*'], ['img']);
  gulp.watch(['assets/js/*.js', 'assets/js/vendor/*.js'], ['js']);
  gulp.watch(['assets/scss/**/*.scss', 'assets/core/scss/**/*.scss'], ['sass']);
});

gulp.task('browserSync', function() {
  browserSync.init({
    proxy: 'tweek.dev', // change this to match your host
    watchTask: true
  });
});

gulp.task('default', ['browserSync', 'watch']);
