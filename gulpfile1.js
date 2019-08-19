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
	uglifyCSS = require('gulp-uglifycss'),
	clean = require('gulp-clean'),
	zip = require('gulp-zip'),
	size = require('gulp-size'),
	concat = require('gulp-concat'),
	gulpUtil = require('gulp-util'),
	svgSprite = require('gulp-svg-sprite');
  
config = {
shape: {
	// dimension		: {			// Set maximum dimensions
	//   maxWidth	: 32,
	//   maxHeight	: 32
	// },
	// spacing			: {			// Add padding
	//   padding		: 10
	// },
	dest: "out/intermediate-svg" // Keep the intermediate files
},
mode: {
	view: {
	// Activate the «view» mode
	bust: false,
	render: {
		scss: true // Activate Sass output (with default options)
	}
	},
	symbol: true // Activate the «symbol» mode
},
svg: {
	xmlDeclaration: false
}
};

gulp.task("live-sprites", function() {
gulp
	.src("./admin/ICO_Live/**/*.svg")
	.pipe(svgSprite(config))
	.pipe(gulp.dest("./admin/sprites_live"));
});

gulp.task("live-new-sprites", function() {
gulp
	.src("./admin/ICO_Live-new/**/*.svg")
	.pipe(svgSprite(config))
	.pipe(gulp.dest("./admin/sprites_live_new"));
});

gulp.task("ico-test", function() {
gulp
	.src("./admin/ICO-test/**/*.svg")
	.pipe(svgSprite(config))
	.pipe(gulp.dest("./admin/sprites_test"));
});

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

/** LIVE BUILDER */

var live_admin_js_src = [ 
	'admin/js/builderlive/Rexlive_MediaUploader.js',
	'admin/js/3-Rexpansive_Builder_Admin_TextEditor.js',
	'admin/js/builderlive/Rexlive_Modals_Utils.js',
	'admin/js/builderlive/Rexlive_Insert_Video_Modal.js',
	'admin/js/builderlive/Rexlive_LayoutGrid_Modal.js',
	'admin/js/builderlive/Rexlive_Section_Width_Modal.js',
	'admin/js/builderlive/Rexlive_Section_Separators_Modal.js',
	'admin/js/builderlive/Rexlive_SectionMargins_Modal.js',
	'admin/js/builderlive/Rexlive_Section_Photoswipe_Modal.js',
	'admin/js/builderlive/Rexlive_Section_Fullheight.js',
	'admin/js/builderlive/Rexlive_SectionName_Modal.js',
	'admin/js/builderlive/Rexlive_Top_Tools.js',
	'admin/js/builderlive/Rexlive_Section_CustomClasses_Modal.js',
	'admin/js/builderlive/Rexlive_Section_Modal.js',
	'admin/js/builderlive/Rexlive_Background_Section_Color_Modal.js',
	'admin/js/builderlive/Rexlive_Overlay_Color_Section_Modal.js',
	'admin/js/builderlive/Rexlive_Section_Background_Image_Modal.js',
	'admin/js/builderlive/Rexlive_Section_Video_Modal.js',
	'admin/js/builderlive/Rexlive_Section_Background_Modal.js',
	'admin/js/builderlive/Rexlive_CSS_Editor_Modal.js',
	'admin/js/builderlive/Rexlive_Html_Editor_Modal.js',
	'admin/js/builderlive/Rexlive_Background_Block_Color_Modal.js',
	'admin/js/builderlive/Rexlive_Overlay_Color_Block_Modal.js',
	'admin/js/builderlive/Rexlive_Block_Background_Image_Modal.js',
	'admin/js/builderlive/Rexlive_Block_Background_Image_Setting.js',
	'admin/js/builderlive/Rexlive_Block_Video_Background_Modal.js',
	'admin/js/builderlive/Rexlive_Block_ContentPosition_Modal.js',
	'admin/js/builderlive/Rexlive_Block_ContentPosition_Setting.js',
	'admin/js/builderlive/Rexlive_Block_ImagePosition_Modal.js',
	'admin/js/builderlive/Rexlive_Block_ImagePosition_Setting.js',
	'admin/js/builderlive/Rexlive_Block_Paddings_Modal.js',
	'admin/js/builderlive/Rexlive_Block_Custom_Classes_Modal.js',
	'admin/js/builderlive/Rexlive_Block_Image_Editor_Modal.js',
	'admin/js/builderlive/Rexlive_Block_Url_Modal.js',
	'admin/js/builderlive/Rexlive_Block_Options_Modal.js',
	'admin/js/builderlive/Rexlive_Model_Modal.js',
	'admin/js/builderlive/Rexlive_Open_Models_Warning.js',
	'admin/js/builderlive/Rexlive_CustomLayout_Modal.js',
	'admin/js/builderlive/Rexlive_Model_Edit_Modal.js',
	'admin/js/builderlive/Rexbuilder_RexSlider.js',
	'admin/js/builderlive/Rexlive_ChangeLayout_Modal.js',
	'admin/js/builderlive/Rexlive_LockedOption_Mask.js',
	'admin/js/builderlive/Rexlive_Model_Import.js',
	'admin/js/builderlive/Rexlive_Modals.js',
	'admin/js/builderlive/Rexlive_Base_Settings.js',
	'admin/js/builderlive/Rexbuilder_Util_Admin_Editor.js',
	'admin/js/builderlive/Rexbuilder_Starting.js'
];

gulp.task('live-admin-scripts-build', function() {
	return gulp.src(live_admin_js_src)
		.pipe(uglify({preserveComments: 'license'}).on('error', gulpUtil.log))
		.pipe(concat('live-admin.js'))
		.pipe(size({title:'Admin JS'}))
		.pipe(gulp.dest('admin/js'))
});

gulp.task('live-builder-style', function() {
	sass('admin/scss/rexlive/live-def.scss',{
		sourcemap: false,
		style:'compressed'
	})
	.pipe(plumber())
    .pipe(autoprefixer({
      browsers: ["last 3 versions", "ie >= 9", "and_chr >= 2.3"]
  	}))
    .pipe(plumber.stop())
	.pipe(size({title: 'LiveBuilder CSS'}))
    .pipe(gulp.dest('admin/css'));
});

gulp.task('admin-builder-style', function() {
	sass('admin/scss/rexlive/tools-def.scss',{
		sourcemap: false,
		style:'compressed'
	})
	.pipe(plumber())
    .pipe(autoprefixer({
      browsers: ["last 3 versions", "ie >= 9", "and_chr >= 2.3"]
  	}))
    .pipe(plumber.stop())
	.pipe(size({title: 'LiveBuilder Admin CSS'}))
    .pipe(gulp.dest('admin/css'));
});

gulp.task('peter', ['live-builder-style','admin-builder-style'] ,function() {
	gulp.watch('admin/scss/rexlive/**/*.scss', ['live-builder-style']);
	gulp.watch('admin/scss/rexlive/**/*.scss', ['admin-builder-style']);
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

/**
 * BUILDERLIVE file concatenation logic
 * @since 2.0.0
 */

var builderlive_public_editor = [
	'public/js/vendor/tippy.all.min.js',
	'public/js/vendor/rangy-1.3.0/rangy-core.js',
	'public/js/vendor/rangy-1.3.0/rangy-classapplier.js',
	'public/js/vendor/rangy-1.3.0/rangy-selectionsaverestore.js',
	'public/js/vendor/rangy-1.3.0/rangy-textrange.js',
	'public/js/vendor/spectrum.js',
	'public/js/vendor/medium-editor.js',
	'public/js/vendor/medium-editor-toolbar-states.min.js',
	// 'public/js/vendor/handlebars.runtime.js',
	// 'public/js/vendor/jquery.fileupload.js',
	// 'public/js/vendor/jquery.cycle2.min.js',
	// 'public/js/vendor/jquery.cycle2.center.min.js',
	// 'public/js/vendor/medium-editor-insert-plugin.js',
	'public/js/live/1-Rexbuilder_Util_Editor_Utilities.js',
	'public/js/live/0-Rexbuilder_Array_Utilities.js',
	'public/js/live/1-Rexbuilder_Color_Palette.js',
	'public/js/live/1-Rexbuilder_Overlay_Palette.js',
	'public/js/live/2-Text_Editor.js',
	'public/js/live/1-Rexbuilder_Section.js',
	'public/js/live/1-Rexbuilder_Section_Editor.js',
	'public/js/live/1-Rexbuilder_Block.js',
	'public/js/live/1-Rexbuilder_Block_Editor.js',
	'public/js/live/4-modals.js',
];

var builderlive_public = [
	'public/js/live/0-Rexbuilder_Array_Utilities.js',
	'public/js/vendor/jquery.requestanimationframe.min.js',
	'public/js/vendor/tmpl.min.js',
	'public/Photoswipe/photoswipe.min.js',
	'public/Photoswipe/photoswipe-ui-default.min.js',
	'public/js/vendor/jquery.mb.YTPlayer.min.js',
	'public/js/vendor/store.legacy.min.js',
	'public/js/build/1-Rexbuilder_Util.js',
	'public/js/live/1-Rexbuilder_Util_Editor.js',
	'public/js/live/1-Rexbuilder_Dom_Util.js',
	'public/js/build/1-Rexbuilder_Rexbutton.js',
	// 'public/js/live/1-Rexbuilder_CreateBlocks.js',
	// 'public/js/live/2-Rex_Save_Listeners.js',
	'public/js/vendor/jquery-ui.min.js',
	'public/js/vendor/jquery.ui.touch-punch.js',
	'public/js/vendor/lodash.js',
	'public/js/vendor/gridstack.js-0.4.0/src/gridstack.js',
	'public/js/vendor/gridstack.js-0.4.0/src/gridstack.jQueryUI.js',
	'public/js/build/3-Navigator.js',
	// 'public/js/build/5-Rexbuilder_FormFixes.js',
	'public/js/vendor/flickity.pkgd.min.js',
	'public/js/build/2-RexSlider.js',
	'public/js/vendor/2-jquery.textFill.js',
	'public/js/build/8-VimeoVideo.js',
	'public/js/vendor/4-jquery.rexScrolled.js',
	'public/js/vendor/6-jquery.rexAccordion.js',
	'public/js/vendor/6-jquery.rexIndicator.js',
	'public/js/vendor/pixi.min.js',
	'public/js/vendor/odometer.min.js',
	'public/js/vendor/6-jquery.rexSlideshow.js',
	'public/js/vendor/jquery.rexEffect.js',
	'public/js/vendor/utilities.js',
	// 'public/js/vendor/spectrum.js',
	// 'public/js/vendor/jquery.overlayScrollbars.min.js',
	'public/js/live/2-jquery.perfectGridGalleryEditor.js',
	'public/js/vendor/3-velocity.min.js',
	'public/js/vendor/3-velocity.ui.min.js',
	'public/js/vendor/4-jquery.rexScrollify.js',
	'public/js/build/rexbuilder-public.js',
];

var builderlive_public_editor_style = [
	// 'admin/rexpansive-font/font.css',
	'admin/public/css/builder.css',
	'admin/css/rex-custom-editor-buttons.css',
	'admin/spectrum/spectrum.css',
	'public/css/medium-editor.css',
	'public/css/medium-editor-insert-plugin-frontend.css',
	'public/Photoswipe/default-skin/default-skin.css',
	'public/jquery.mb.YTPlayer/css/jquery.mb.YTPlayer.min.css',
	'public/css/animate.css',
	'public/css/textFill.css',
	'public/css/jquery-ui.min.css',
	'public/css/gridstack.css',
	'public/css/input-spinner.css',
	'public/css/public-editor.css',
	'admin/css/live-def.css'
];

var builderlive_public_style = [
	'public/Photoswipe/default-skin/default-skin.css',
	'public/jquery.mb.YTPlayer/css/jquery.mb.YTPlayer.min.css',
	'public/css/animate.css',
	'public/css/textFill.css',
	'public/css/jquery-ui.min.css',
	'public/css/gridstack.css',
	'public/css/input-spinner.css',
	'public/css/public.css',
	'admin/css/live-def.css'
];

var public_res = builderlive_public_editor.concat(builderlive_public);
var public_editor_res = builderlive_public_editor_style;

gulp.task('public-editor-css', function() {
	sass('public/public-editor.scss',{
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

gulp.task('builderlive-editor', function() {
	return gulp.src(public_res)
		.pipe(uglify({preserveComments: 'license'}).on('error', gulpUtil.log))
		.pipe(concat('builderlive-editor.js'))
		.pipe(size({title:'Builderlive Editor'}))
		.pipe(gulp.dest('public/js'))
});

gulp.task('builderlive', function() {
	return gulp.src(builderlive_public)
		.pipe(uglify({preserveComments: 'license'}).on('error', gulpUtil.log))
		.pipe(concat('builderlive.js'))
		.pipe(size({title:'Builderlive'}))
		.pipe(gulp.dest('public/js'))
});

gulp.task('builderlive-editor-style', function() {
	return gulp.src(public_editor_res)
		.pipe(concat('builderlive-editor.css'))
		.pipe(uglifyCSS({preserveComments: 'license'}).on('error', gulpUtil.log))
		.pipe(size({title:'Builderlive Editor Style'}))
		.pipe(gulp.dest('admin/css'))
});

gulp.task('builderlive-style', function() {
	return gulp.src(builderlive_public_style)
		.pipe(concat('builderlive.css'))
		.pipe(uglifyCSS({preserveComments: 'license'}).on('error', gulpUtil.log))
		.pipe(size({title:'Builderlive Style'}))
		.pipe(gulp.dest('public/css'))
});

gulp.task('live-production', ['builderlive-editor','builderlive','builderlive-editor-style','builderlive-style']);

gulp.task('watch-live-production', ['builderlive-editor','builderlive'] ,function() {
	gulp.watch(['public/js/build/**/*.js','public/js/live/**/*.js','public/js/vendor/**/*.js'], ['builderlive-editor']);
	gulp.watch(['public/js/build/**/*.js','public/js/live/**/*.js','public/js/vendor/**/*.js'], ['builderlive']);
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
	'public/js/vendor/6-jquery.rexAccordion.js',
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
		.pipe(uglify({preserveComments: 'license'}).on('error', function(e){
            console.log(e);
         }))
		.pipe(concat('plugins.js'))
		.pipe(size({title:'Public JS Plugins'}))
		.pipe(gulp.dest('public/js'))
});

gulp.task('public-js-build', function() {
	return gulp.src(public_js_logic_src)
		.pipe(uglify({preserveComments: 'license'}).on('error', function(e){
            console.log(e);
         }))		
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
	'admin/sprite-list.json',
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

/* ---- BUILD LIVE PLUGIN VERSION ----- */
var live_zip_name = 'Premium-200-Rexpansive-Builder.zip';
var live_folder_name = 'rexpansive-builder';

var live_file_map = [
	'admin/ace/**/*',
	'admin/css/**/*',
	'admin/default-models/**/*',
	'admin/font-awesome-4.3.0/**/*',
	'admin/grapick/**/*',
	'admin/img/**/*.*',
	'admin/js/**/*',
	'admin/lib/**/*',
	// 'admin/models/**/*',
	'admin/partials/**/*',
	'admin/required-plugins/**/*',
	'admin/rexpansive-font/**/*.*',
	'admin/spectrum/**/*',
	'admin/sprites/symbol/svg/sprite.symbol.svg',
	'admin/sprites_live_new/symbol/svg/sprite.symbol.svg',
	'admin/class-importheme-import-utilities.php',
	'admin/class-importheme-import-xml-content.php',
	'admin/class-rexbuilder-admin.php',
	'admin/class-rexbuilder-meta-box.php',
	'admin/index.php',
	// 'admin/sprite-list.json',
	'includes/**/*',
	'languages/**/*',
	'Licensing/**/*',
	'public/css/**/*',
	'public/img/**/*',
	'public/jquery.mb.YTPlayer/**/*',
	'public/js/build/**/*',
	'public/js/live/**/*',
	'public/js/vendor/**/*',
	'public/js/builderlive-editor.js',
	'public/js/builderlive.js',
	'public/partials/**/*',
	'public/Photoswipe/**/*',
	// 'public/rangy-1.3.0/**/*',
	'public/templates/**/*',
	'public/class-rexbuilder-public.php',
	'public/index.php',
	'shared/**/*',
	'shortcodes/**/*',
	'index.php',
	'LICENSE.txt',
	'README.txt',
	'rexpansive-builder.php',
	'uninstall.php',
	'wpml-config.xml',
];

gulp.task('create-temp-live-folder', function(cb) {
	return gulp.src(live_file_map, { base: './' })
		.pipe(gulp.dest(live_folder_name + '/'));
	cb(err);
});

gulp.task('remove-temp-live-folder', ['create-temp-live-folder','mac-live-zip'], function(cb) {
	return gulp.src(live_folder_name, {read: false})
		.pipe(clean());
	cb(err);
});

gulp.task('create-live-zip', ['create-temp-live-folder'], function(cb) {
	return gulp.src(live_folder_name + '/**/*', { base: './'})
		.pipe(zip(live_zip_name))
		.pipe(gulp.dest(''));
	cb(err);
});

gulp.task('build', ['create-temp-live-folder', 'create-live-zip', 'remove-temp-live-folder']);

var exec = require('child_process').exec;

gulp.task('mac-live-zip', ['create-temp-live-folder'], function (cb) {
  exec('zip -r ' + live_zip_name + ' ' + live_folder_name + ' -x "*.DS_Store"', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('build-live-mac', ['create-temp-live-folder', 'mac-live-zip', 'remove-temp-live-folder']);