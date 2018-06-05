var gulp = require('gulp'),
	// sass = require('gulp-sass'),
	sass = require('gulp-ruby-sass'),
	watch = require('gulp-watch'),
	minifyCSS = require('gulp-minify-css'),
	rename = require('gulp-rename'),
	header = require('gulp-header'),
	autoprefixer = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	pkg = require('./package.json'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	clean = require('gulp-clean'),
	zip = require('gulp-zip'),
	size = require('gulp-size'),
	concat = require('gulp-concat'),
	gulpUtil = require('gulp-util'),
	sourcemaps = require('gulp-sourcemaps');

var banner = ['/**',
	' * <%= pkg.name %> v<%= pkg.version %>',
	' * <%= pkg.description %>',
	' * <%= pkg.author %> <<%= pkg.author.email %>>',
	' */',
	''].join('\n');

gulp.task('minify-css', function() {
	gulp.src('./admin/css/main.css')
		.pipe(minifyCSS({compatibility: 'ie8'}))
		.pipe(header(banner, {pkg: pkg}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./admin/css/'));
});

gulp.task('jshint', function() {
	var path = './public/js/**/*.js';
	return gulp.src(path)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('builder-front', function() {
	sass('public/scss/rexbuilder-public.scss',{
			style:'compressed'
		})
	.pipe(plumber())
	.pipe(autoprefixer({
		browsers: ["last 3 versions", "ie >= 9", "and_chr >= 2.3"]
		}))
	.pipe(plumber.stop())
	.pipe(size({title: 'Front CSS'}))
	.pipe(gulp.dest('public/css/'));
});

gulp.task('default', ['builder-front', 'watch:scss']);

/* --- BUILD ADMIN SCRIPTS AND STYLES ------ */
gulp.task('admin-builder', function() {
	return gulp.src('admin/scss/builder.scss')
		.pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
		.pipe(gulp.dest('admin/scss'))
});

gulp.task('admin-css-build', function() {
	sass('admin/admin.scss',{
		style:'compressed'
	})
	.pipe(plumber())
    .pipe(autoprefixer({
      browsers: ["last 3 versions", "ie >= 9", "and_chr >= 2.3"]
  	}))
    .pipe(plumber.stop())
	.pipe(size({title: 'Admin CSS'}))
    .pipe(gulp.dest('admin/css'));
});

var admin_js_src = [ 
	'admin/js/jquery.gridster.js', 
	'admin/spectrum/spectrum.js', 
	'admin/materialize/js/materialize.js', 
	'admin/js/rexbuilder.js', 
];

gulp.task('admin-plugins-build', function() {
	return gulp.src(admin_js_src)
		.pipe(uglify({preserveComments: 'license'}).on('error', gulpUtil.log))
		.pipe(concat('plugins.js'))
		.pipe(size({title:'Admin JS'}))
		.pipe(gulp.dest('admin/js'))
});

/* --- BUILD PUBLIC SCRIPTS AND STYLES ------ */

gulp.task('public-css-build', function() {
	sass('public/public.scss',{
		style:'compressed'
	})
	.pipe(plumber())
    .pipe(autoprefixer({
      browsers: ["last 3 versions", "ie >= 9", "and_chr >= 2.3"]
  	}))
    .pipe(plumber.stop())
	.pipe(size({title: 'Public CSS'}))
    .pipe(gulp.dest('public/css'));
});

var public_js_src = [
	'public/js/0-isotope.pkgd.min.js',
	'public/js/1-jquery.mCustomScrollbar.concat.min.js',
	'public/js/2-jquery.perfectGridGallery.js',
	'public/js/2-jquery.textFill.js',
	//'public/js/2-TextResize.js',
	'public/js/3-velocity.min.js',
	'public/js/3-velocity.ui.min.js',
	'public/js/4-jquery.rexScrollify.js',
	'public/js/5-flickity.pkgd.min.js',
	'public/Photoswipe/photoswipe.min.js',
	'public/Photoswipe/photoswipe-ui-default.min.js',
	'public/jquery.mb.YTPlayer/jquery.mb.YTPlayer.min.js',
	//'public/js/wow.min.js',
	//'public/js/underscore-min.js',
	//'public/js/jquery.getVideoThumbnail.js'
];

var public_js_logic_src = [
	'public/js/1-Util.js',
	'public/js/2-RexSlider.js',
	'public/js/8-VimeoVideo.js',
	'public/js/rexbuilder-public.js',
	//'public/js/TextResize.js',
];

gulp.task('public-plugins-build', function() {
	return gulp.src(public_js_src)
		//.pipe(uglify({preserveComments: 'license'}))
		.pipe(concat('plugins.js'))
		.pipe(size({title:'Public JS Plugins'}))
		.pipe(gulp.dest('public/js'))
});

gulp.task('public-js-build', function() {
	return gulp.src(public_js_logic_src)
		//.pipe(uglify({preserveComments: 'license'}))		
		//.pipe(uglify({preserveComments: 'all'}))	
		.pipe(concat('public.js'))
		.pipe(size({title:'Public JS'}))
		.pipe(gulp.dest('public/js'))
});

/* ----- BUILD PLUGIN ------- */

gulp.task('dev', ['admin-plugins-build', 'public-plugins-build', 'public-js-build'] ,function() {
	//livereload.listen();
	//gulp.watch(admin_js_src, ['admin-plugins-build']);
	//gulp.watch('admin/css/builder.css', ['admin-css-build']);
	//gulp.watch('public/scss/**/*.scss', ['builder-front']);
	gulp.watch(['public/scss/**/*.scss'], ['public-css-build']);
	gulp.watch(public_js_src, ['public-plugins-build']);
	gulp.watch(public_js_logic_src, ['public-js-build']);
	//gulp.watch('./**/*.php').on('change', function(file) {
	//	livereload.changed(file.path);
	//});
	//gulp.watch('./**/*.html').on('change', function(file) {
	//	livereload.changed(file);
	//});
});


/* ---- BUIL CLEAN PLUGIN VERSION ----- */
var premium_plugin_zip_name = 'Premium-1015-Rexpansive-Builder.zip';
var premium_plugin_folder_name = 'rexpansive-builder';

var plugin_premium_file_map = [
	'admin/ace/src-min-noconflict/*.*',
	'admin/css/admin.css',
	'admin/font-awesome-4.3.0/**/*.*',
	'admin/img/**/*.*',
	'admin/js/embed-video.js',
	'admin/js/plugins.js',
	'admin/js/rexbuilder-admin.js',
	'admin/js/textfill-button.js',
	'admin/lib/**/*.*',
	'admin/partials/**/*.*',
	'admin/rexpansive-font/**/*.*',
	'admin/class-rexbuilder-admin.php',
	'admin/class-rexbuilder-meta-box.php',
	'admin/index.php',
	'includes/**/*.*',
	'languages/**/*.*',
	'Licensing/**/*.*',
	'public/css/public.css',
	'public/img/**/*',
	'public/js/plugins.js',
	'public/js/public.js',
	'public/partials/**/*.*',
	'public/Photoswipe/**/*.*',
	'public/jquery.mb.YTPlayer/**/*.*',
	'public/class-rexbuilder-public.php',
	'public/index.php',
	'index.php',
	'LICENSE.txt',
	'README.txt',
	'rexpansive-builder.php',
	'uninstall.php',
];

gulp.task('create-temp-folder', function(cb) {
	return gulp.src(plugin_premium_file_map, { base: './' })
		.pipe(gulp.dest(premium_plugin_folder_name + '/'));
	cb(err);
});

gulp.task('remove-temp-folder', ['create-temp-folder','mac-zip'], function(cb) {
	return gulp.src(premium_plugin_folder_name, {read: false})
		.pipe(clean());
	cb(err);
});

gulp.task('create-zip', ['create-temp-folder'], function(cb) {
	return gulp.src(premium_plugin_folder_name + '/**/*', { base: './'})
		.pipe(zip(premium_plugin_zip_name))
		.pipe(gulp.dest(''));
	cb(err);
});

gulp.task('build', ['create-temp-folder', 'create-zip', 'remove-temp-folder']);

var exec = require('child_process').exec;

gulp.task('mac-zip', ['create-temp-folder'], function (cb) {
  exec('zip -r ' + premium_plugin_zip_name + ' ' + premium_plugin_folder_name + ' -x "*.DS_Store"', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('build-mac', ['create-temp-folder', 'mac-zip', 'remove-temp-folder']);