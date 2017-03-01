var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
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
  return gulp.src(['../../../../uploads/**/*.{png,PNG,jpg,JPG,jpeg,JPEG,gif,GIF}'], {
      base: '.'
    })
    .pipe($.newer('../../../../uploads'))
    .pipe($.imagemin())
    .pipe(gulp.dest('../../../../uploads'))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  return gulp.src([
    '../../node_modules/glidejs/dist/glide.js',
    '../../node_modules/magnific-popup/dist/jquery.magnific-popup.js',
    '../../node_modules/velocity-animate/velocity.js',
    '../../node_modules/waypoints/lib/jquery.waypoints.js',
    '../js/plugins.js',
    '../js/acf-google-maps.js',
    '../js/main.js'
  ])
    .pipe($.concat('main.js', {
      newLine: ';'
    }))
    .pipe(gulp.dest('../js/concat/'))
    .pipe($.uglify(false))
    .pipe($.rename('main.min.js'))
    .pipe(gulp.dest('../js/compiled'))
    .pipe(browserSync.stream());
});

gulp.task('sass', function() {
  return gulp.src(['../scss/master.scss', '../scss/login.scss'])
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'compressed'
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: AUTOPREFIXER_BROWSERS
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('../css'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function() {
  gulp.watch(['../../**/*.html', '../../**/*.php']).on('change', browserSync.reload);
  gulp.watch(['../../../../uploads/**/*'], ['img']);
  gulp.watch(['../js/*.js', '../js/vendor/*.js'], ['js']);
  gulp.watch(['../scss/**/*.scss', '../core/scss/**/*.scss'], ['sass']);
});

gulp.task('browserSync', function() {
  browserSync.init({
    proxy: 'tweek.dev', // change this to match your host
    watchTask: true
  });
});

gulp.task('default', ['browserSync', 'watch']);
