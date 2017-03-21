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
// Require our dependencies
const $ = require('gulp-load-plugins')();
const autoprefixer = require( 'autoprefixer' );
const bourbon = require( 'bourbon' ).includePaths;
const browserSync = require( 'browser-sync' );
const del = require( 'del' );
const gulp = require( 'gulp' );
const merge = require( 'merge-stream' );
const mqpacker = require( 'css-mqpacker' );
const neat = require( 'bourbon-neat' ).includePaths;
const reload = browserSync.reload;

// Set assets paths.
const paths = {
  'css': [ 'assets/css/*.css', '!assets/css/*.min.css' ],
  'fonts': 'assets/fonts/*',
  'images': [ 'assets/img/*', '!assets/img/**/*.svg'],
  'logos': 'assets/img/svg-logos/*.svg',
  'php': [ './**/*.php', '!node_modules/**/*.php' ],
  'sass': 'assets/scss/**/*.scss',
  'scripts': 'assets/js/scripts/*.js',
  'js': [ 'assets/js/*.js', '!assets/js/*.min.js' ]
};

/**
 * Handle errors and alert the user.
 */
function handleErrors () {
  const args = Array.prototype.slice.call( arguments );

  $.notify.onError( {
    'title': 'Task Failed [<%= error.message %>',
    'message': 'See console.',
    'sound': 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
  } ).apply( this, args );

  $.util.beep(); // Beep 'sosumi' again.

  // Prevent the 'watch' task from stopping.
  this.emit( 'end' );
}

/**
 * Delete css before we minify and optimize.
 */
gulp.task( 'clean:styles', () =>
  del( 'assets/css/*' )
);

/**
 * Compile Sass and run stylesheet through PostCSS.
 *
 * https://www.npmjs.com/package/gulp-sass
 * https://www.npmjs.com/package/gulp-postcss
 * https://www.npmjs.com/package/gulp-autoprefixer
 * https://www.npmjs.com/package/css-mqpacker
 */
gulp.task( 'postcss', [ 'clean:styles', 'copy:fonts' ], () =>
  gulp.src( paths.sass )

    // Deal with errors.
    .pipe( $.plumber( { 'errorHandler': handleErrors } ) )

    // Wrap tasks in a sourcemap.
    .pipe( $.sourcemaps.init() )

      // Compile Sass using LibSass.
      .pipe( $.sass( {
        'includePaths': [
          // Include paths for any npm package to use @import
          'node_modules/slick-carousel/slick/',
          'node_modules/font-awesome/scss',
          'node_modules/magnific-popup/dist/',
          'node_modules/normalize.css/',
          'node_modules/animate-sass/',
          'node_modules/family.scss/source/src/',
          'node_modules/include-media/dist/'
        ].concat( bourbon, neat ),
        'errLogToConsole': true,
        'outputStyle': 'expanded' // Options: nested, expanded, compact, compressed
      } ) )

      // Parse with PostCSS plugins.
      .pipe( $.postcss( [
        autoprefixer( {
          'browsers': [ 'last 2 version' ]
        } ),
        mqpacker( {
          'sort': true
        } )
      ] ) )

    // Create sourcemap.
    .pipe( $.sourcemaps.write() )

    // Create style.css.
    .pipe( gulp.dest( 'assets/css' ) )
    .pipe( browserSync.stream() )
);

/**
 * Minify and optimize style.css.
 *
 * https://www.npmjs.com/package/gulp-cssnano
 */
gulp.task( 'cssnano', [ 'postcss' ], () =>
  gulp.src( paths.css )
    .pipe( $.plumber( { 'errorHandler': handleErrors } ) )
    .pipe( $.cssnano( {
      'safe': true // Use safe optimizations.
    } ) )
    .pipe( $.rename( { 'suffix': '.min' } ) )
    .pipe( gulp.dest( 'assets/css' ) )
    .pipe( browserSync.stream() )
);

/**
 * Copy font assets.
 *
 * https://www.npmjs.com/package/merge-stream
 */
gulp.task('copy:fonts', function() {
  var toAssetsCss = gulp.src([
      'node_modules/slick-carousel/slick/ajax-loader.gif'
    ])
    .pipe(gulp.dest('assets/css'));

  var toAssetsFonts = gulp.src([
      'node_modules/slick-carousel/slick/fonts/*',
      'node_modules/font-awesome/fonts/*'
    ])
    .pipe(gulp.dest('assets/fonts'));

  return merge(toAssetsCss, toAssetsFonts);
});



/**
 * Concatenate and transform JavaScript.
 *
 * https://www.npmjs.com/package/gulp-concat
 * https://github.com/babel/gulp-babel
 * https://www.npmjs.com/package/gulp-sourcemaps
 */
gulp.task( 'concat', () =>
  gulp.src( [
      'node_modules/slick-carousel/slick/slick.js',
      'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
      'node_modules/velocity-animate/velocity.js',
      'node_modules/waypoints/lib/jquery.waypoints.js',
      'node_modules/headroom.js/dist/headroom.js',
      'node_modules/headroom.js/dist/jQuery.headroom.js',
      paths.scripts
    ])

gulp.task('watch', function() {
  gulp.watch(['**/*.html', '**/*.php']).on('change', browserSync.reload);
  gulp.watch(['../../uploads/**/*'], ['img']);
  gulp.watch(['assets/js/*.js', 'assets/js/vendor/*.js'], ['js']);
  gulp.watch(['assets/scss/**/*.scss', 'assets/core/scss/**/*.scss'], ['sass']);
});
    // Deal with errors.
    .pipe( $.plumber( { 'errorHandler': handleErrors } ) )

gulp.task('browserSync', function() {
  browserSync.init({
    proxy: 'tweek.dev', // change this to match your host
    watchTask: true
  });
});
    // Start a sourcemap.
    .pipe( $.sourcemaps.init() )

    // Convert ES6+ to ES2015.
    .pipe( $.babel( {
      presets: [ 'es2015' ]
    } ) )

    // Concatenate partials into a single script.
    .pipe( $.concat( 'project.js' ) )

    // Append the sourcemap to project.js.
    .pipe( $.sourcemaps.write() )

    // Save project.js
    .pipe( gulp.dest( 'assets/js' ) )
    .pipe( browserSync.stream() )
);

/**
  * Minify compiled JavaScript.
  *
  * https://www.npmjs.com/package/gulp-uglify
  */
gulp.task( 'uglify', [ 'concat' ], () =>
  gulp.src( paths.js )
    .pipe( $.rename( { 'suffix': '.min' } ) )
    .pipe( $.uglify( { 'mangle': false } ) )
    .pipe( gulp.dest( 'assets/js' ) )
);


gulp.task('default', ['browserSync', 'watch']);
