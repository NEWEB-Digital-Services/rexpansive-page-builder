var gulp = require('gulp'),
	// sass = require('gulp-sass'),
	sass = require('gulp-ruby-sass'),
	watch = require('gulp-watch'),
	minifyCSS = require('gulp-minify-css'),
	autoprefixer = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	rename = require('gulp-rename'),
	header = require('gulp-header'),
	pkg = require('./package.json'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	clean = require('gulp-clean'),
	zip = require('gulp-zip'),
	size = require('gulp-size'),
	concat = require('gulp-concat'),
	gulpUtil = require('gulp-util'),
	svgSprite = require('gulp-svg-sprite');

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

gulp.task('live-builder-style', function() {
	sass('admin/scss/builder-live/live-editor.scss',{
		//style:'compressed'
	})
	.pipe(plumber())
    .pipe(autoprefixer({
      browsers: ["last 3 versions", "ie >= 9", "and_chr >= 2.3"]
  	}))
    .pipe(plumber.stop())
	.pipe(size({title: 'LiveBuilder CSS'}))
    .pipe(gulp.dest('admin/css'));
});


var admin_js_src = [ 
	'admin/js/jquery.gridster.js', 
	'admin/spectrum/spectrum.js', 
	'admin/materialize/js/materialize.js',
	'admin/js/0-Rexpansive_Builder_Admin_Config.js',
	'admin/js/0-Rexpansive_Builder_Admin_Utilities.js',
	'admin/js/1-Rexpansive_Builder_Admin_Modals.js',
	'admin/js/1-Rexpansive_Builder_Admin_Templates.js',
	'admin/js/2-Rexpansive_Builder_Admin_Hooks.js',
	'admin/js/3-Rexpansive_Builder_Admin_Lightbox.js',
	'admin/js/3-Rexpansive_Builder_Admin_ModelEditor.js',
	'admin/js/3-Rexpansive_Builder_Admin_PaddingEditor.js',
	'admin/js/3-Rexpansive_Builder_Admin_PositionEditor.js',
	'admin/js/3-Rexpansive_Builder_Admin_Rxcf.js',
	'admin/js/3-Rexpansive_Builder_Admin_TextEditor.js',
	'admin/js/3-Rexpansive_Builder_Admin_VideoEditor.js',
	'admin/js/4-Rexpansive_Builder_Admin_MediaUploader.js',
	'admin/js/4-Rexpansive_Builder_Admin_VideoUploader.js',
	'admin/js/5-Rexpansive_Builder_Admin_Section.js',
	'admin/js/rexbuilder.js', 
];

gulp.task('admin-plugins-build', function() {
	return gulp.src(admin_js_src)
		.pipe(uglify({preserveComments: 'license'}).on('error', gulpUtil.log))
		.pipe(concat('plugins.js'))
		.pipe(size({title:'Admin JS'}))
		.pipe(gulp.dest('admin/js'))
});

config	= {
	shape				: {
	  // dimension		: {			// Set maximum dimensions 
	  //   maxWidth	: 32,
	  //   maxHeight	: 32
	  // },
	  // spacing			: {			// Add padding 
	  //   padding		: 10
	  // },
	  dest			: 'out/intermediate-svg'	// Keep the intermediate files 
	},
	mode				: {
	  view			: {			// Activate the «view» mode 
		bust		: false,
		render		: {
		  scss	: true		// Activate Sass output (with default options) 
		}
	  },
	  symbol			: true		// Activate the «symbol» mode 
	},
	svg : {
	  xmlDeclaration		: false,
	}
  };
  
gulp.task('sprites', function() {
	gulp.src('./admin/ICO/**/*.svg')
		.pipe(svgSprite(config))
		.pipe(gulp.dest('./admin/sprites'));
});

/* --- BUILD PUBLIC SCRIPTS AND STYLES ------ */

gulp.task('public-css-build', function() {
	sass('public/public.scss',{
		//style:'compressed'
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
	'public/js/vendor/0-isotope.pkgd.min.js',
	'public/js/vendor/1-classie.js',
	'public/js/vendor/1-jquery.mCustomScrollbar.concat.min.js',
	'public/js/vendor/2-jquery.expandEffect.js',
	'public/js/vendor/2-jquery.perfectGridGallery.js',
	'public/js/vendor/2-jquery.textFill.js',
	'public/js/vendor/2-TextResize.js',
	'public/js/vendor/3-velocity.min.js',
	'public/js/vendor/3-velocity.ui.min.js',
	'public/js/vendor/4-jquery.rexScrolled.js',
	'public/js/vendor/4-jquery.rexScrollify.js',
	'public/js/vendor/5-flickity.pkgd.min.js',
	'public/js/vendor/5-jquery.rexIndicator.js',
	'public/js/vendor/photoswipe.min.js',
	'public/js/vendor/photoswipe-ui-default.min.js',
	'public/js/vendor/jquery.mb.YTPlayer.min.js',
	//'public/js/wow.min.js',
	//'public/js/underscore-min.js',
	//'public/js/jquery.getVideoThumbnail.js'
];

var public_js_logic_src = [
	'public/js/build/1-Rexbuilder_Util.js',
	'public/js/build/2-RexSlider.js',
	'public/js/build/5-Rexbuilder_FormFixes.js',
	'public/js/build/8-VimeoVideo.js',
	'public/js/build/rexbuilder-public.js',
	//'public/js/TextResize.js',
];

gulp.task('public-plugins-build', function() {
	return gulp.src(public_js_src)
		.pipe(uglify({preserveComments: 'license'}))
		.pipe(concat('plugins.js'))
		.pipe(size({title:'Public JS Plugins'}))
		.pipe(gulp.dest('public/js'))
});

gulp.task('public-js-build', function() {
	return gulp.src(public_js_logic_src)
		.pipe(uglify({preserveComments: 'license'}))		
		//.pipe(uglify({preserveComments: 'all'}))	
		.pipe(concat('public.js'))
		.pipe(size({title:'Public JS'}))
		.pipe(gulp.dest('public/js'))
});

/* ----- BUILD PLUGIN ------- */

gulp.task('dev', ['admin-plugins-build', 'admin-css-build', 'public-css-build', 'public-plugins-build', 'public-js-build'] ,function() {
	gulp.watch(admin_js_src, ['admin-plugins-build']);
	gulp.watch('admin/scss/admin/builder.scss', ['admin-css-build']);
	gulp.watch('public/scss/**/*.scss', ['public-css-build']);
	gulp.watch(public_js_src, ['public-plugins-build']);
	gulp.watch(public_js_logic_src, ['public-js-build']);
});

gulp.task('dev-live', ['live-builder-style'] ,function() {
	gulp.watch('admin/scss/builder-live/**/*.scss', ['live-builder-style']);
});


/* ---- BUIL CLEAN PLUGIN VERSION ----- */
var premium_plugin_zip_name = 'Premium-113-Rexpansive-Builder.zip';
var code_premium_plugin_zip_name = 'codecanyon-113-rexpansive-builder-wordpress-plugin';
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
	'admin/models/**/*',
	'admin/partials/**/*.*',
	'admin/required-plugins/**/*',
	'admin/rexpansive-font/**/*.*',
	'admin/sprites/symbol/svg/sprite.symbol.svg',
	'admin/class-importheme-import-utilities.php',
	'admin/class-importheme-import-xml-content.php',
	'admin/class-rexbuilder-admin.php',
	'admin/class-rexbuilder-meta-box.php',
	'admin/index.php',
	'includes/**/*',
	'languages/**/*',
	'Licensing/**/*',
	'public/css/public.css',
	'public/img/**/*',
	'public/js/plugins.js',
	'public/js/public.js',
	'public/partials/**/*',
	'public/templates/**/*',
	'public/Photoswipe/**/*',
	'public/jquery.mb.YTPlayer/**/*',
	'public/class-rexbuilder-public.php',
	'public/index.php',
	'shortcodes/**/*',
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

gulp.task('code-mac-zip', ['create-temp-folder'], function (cb) {
  exec('zip -r ' + code_premium_plugin_zip_name + ' ' + premium_plugin_folder_name + ' -x "*.DS_Store"', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('build-mac', ['create-temp-folder', 'mac-zip', 'remove-temp-folder']);