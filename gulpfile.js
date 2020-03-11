var gulp = require('gulp'),
	sass = require('gulp-sass'),
	// sass = require('gulp-ruby-sass'),
	watch = require('gulp-watch'),
	minifyCSS = require('gulp-minify-css'),
	autoprefixer = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	rename = require('gulp-rename'),
	header = require('gulp-header'),
	pkg = require('./package.json'),
	uglify = require('gulp-uglify'),
	uglifyCSS = require('gulp-uglifycss'),
	clean = require('gulp-clean'),
	zip = require('gulp-zip'),
	size = require('gulp-size'),
	concat = require('gulp-concat'),
	gulpUtil = require('gulp-util'),
	svgSprite = require('gulp-svg-sprite');

var	config = {
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

var banner = ['/**',
' * <%= pkg.name %> v<%= pkg.version %>',
' * <%= pkg.description %>',
' * <%= pkg.author %> <<%= pkg.author.email %>>',
' */',
''].join('\n');

/** SPRITES TASKS */

gulp.task("live-new-sprites", function() {
	gulp
	.src("./admin/ICO_Live-new/**/*.svg")
	.pipe(svgSprite(config))
	.pipe(gulp.dest("./admin/sprites-live"));
});

gulp.task('sprites', function() {
	gulp.src('./admin/ICO/**/*.svg')
	.pipe(svgSprite(config))
	.pipe(gulp.dest('./admin/sprites'));
});

/** end SPRITES TASKS */

gulp.task('minify-css', function() {
	gulp.src('./admin/css/main.css')
	.pipe(minifyCSS({compatibility: 'ie8'}))
	.pipe(header(banner, {pkg: pkg}))
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('./admin/css/'));
});

gulp.task('builder-front', function() {
	return gulp.src('public/scss/rexbuilder-public.scss')
	.pipe(sass({outputStyle:'compressed'}))
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
		outputStyle:'compressed'
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
	'admin/js/builderlive/nprogress.js',
	'admin/spectrum/spectrum.js',
	'admin/grapick/grapick.min.js',
	'admin/js/builderlive/jquery.actual.min.js',
	'admin/js/builderlive/Photoswipe/photoswipe.min.js',
	'admin/js/builderlive/Photoswipe/photoswipe-ui-default.min.js',
	'admin/js/builderlive/tippy.all.min.js',
	'public/js/jquery.rexAccordion.js',
	'public/js/vendor/tmpl.min.js',
	'admin/ace/src-min-noconflict/ace.js',
	'admin/ace/src-min-noconflict/mode-css.js',
	'admin/ace/src-min-noconflict/mode-html.js',
	'admin/js/builderlive/Rexlive_MediaUploader.js',
	'admin/js/builderlive/Rexlive_RexSlider_TextEditor.js',
	'admin/js/builderlive/Rexlive_Ajax_Calls.js',
	'admin/js/builderlive/Rexlive_Color_Palette.js',
	'admin/js/builderlive/Rexlive_Overlay_Palette.js',
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
	'admin/js/builderlive/Rexlive_Section_Background_Gradient.js',
	'admin/js/builderlive/Rexlive_Section_Overlay_Gradient.js',
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
	'admin/js/builderlive/Rexlive_Block_Accordion.js',
	'admin/js/builderlive/Rexlive_Block_Slideshow.js',
	'admin/js/builderlive/Rexlive_Block_Background_Gradient.js',
	'admin/js/builderlive/Rexlive_Text_Gradient.js',
	'admin/js/builderlive/Rexlive_Block_Overlay_Gradient.js',
	'admin/js/builderlive/Rexlive_Block_Url_Modal.js',
	'admin/js/builderlive/Rexlive_Block_Options_Modal.js',
	'admin/js/builderlive/Rexlive_Model_Modal.js',
	'admin/js/builderlive/Rexlive_Open_Models_Warning.js',
	'admin/js/builderlive/Rexlive_CustomLayout_Modal.js',
	'admin/js/builderlive/Rexlive_Model_Edit_Modal.js',
	'admin/js/builderlive/Rexbuilder_RexSlider.js',
	'admin/js/builderlive/Rexlive_ChangeLayout_Modal.js',
	'admin/js/builderlive/Rexlive_Inline_SVG.js',
	'admin/js/builderlive/Rexlive_PostEdit.js',
	'admin/js/builderlive/Rexlive_PostEdit_MediaList.js',
	'admin/js/builderlive/Rexlive_LockedOption_Mask.js',
	'admin/js/builderlive/Rexlive_Model_Import.js',
	'admin/js/builderlive/Rexlive_Button_Import.js',
	'admin/js/builderlive/Rexlive_Edit_Button.js',
	'admin/js/builderlive/Rexlive_Lateral_Menu.js',
	'admin/js/builderlive/Rexlive_Modals.js',
	'admin/js/builderlive/Rexlive_Base_Settings.js',
	'admin/js/builderlive/Rexbuilder_Util_Admin_Editor.js',
	'admin/js/builderlive/Rexlive_UpdateVideoInline.js',
	'admin/js/builderlive/Rexlive_Gradient_Utils.js',
	'admin/js/builderlive/Rexlive_Page_Margins.js',
	'admin/js/builderlive/Rexlive_Page_Settings_Modal.js',
	'admin/js/builderlive/Rexbuilder_Starting.js',
];

gulp.task('live-admin-scripts-build', function() {
	return gulp.src(live_admin_js_src)
	.pipe(uglify({preserveComments: 'license'}).on('error', gulpUtil.log))
	.pipe(concat('live-admin.js'))
	.pipe(size({title:'Admin JS'}))
	.pipe(gulp.dest('admin/js'))
});

gulp.task('live-builder-style', function() {
	return gulp.src('admin/scss/rexlive/live-def.scss')
	.pipe(sass({
		sourcemap: false,
		outputStyle:'compressed'
	}))
	.pipe(plumber())
	.pipe(autoprefixer({
		browsers: ["last 3 versions", "ie >= 9", "and_chr >= 2.3"]
	}))
	.pipe(plumber.stop())
	.pipe(size({title: 'LiveBuilder CSS'}))
	.pipe(gulp.dest('admin/css'));
});

gulp.task('admin-builder-style', function() {
	return gulp.src('admin/scss/rexlive/tools-def.scss')
	.pipe(sass({
		sourcemap: false,
		outputStyle:'compressed'
	}))
	.pipe(plumber())
	.pipe(autoprefixer({
		browsers: ["last 3 versions", "ie >= 9", "and_chr >= 2.3"]
	}))
	.pipe(plumber.stop())
	.pipe(size({title: 'LiveBuilder Admin CSS'}))
	.pipe(gulp.dest('admin/css'));
});

gulp.task('peter', ['live-builder-style','admin-builder-style', 'prepare-effects'] ,function() {
	gulp.watch('admin/scss/rexlive/**/*.scss', ['live-builder-style']);
	gulp.watch('admin/scss/rexlive/**/*.scss', ['admin-builder-style']);
});

var effects_js_src = [
	'public/js/vendor/jquery.rexEffect.js',
	'public/js/vendor/6-jquery.rexSlideshow.js',
	'public/js/vendor/sticky-section.js',
	'public/js/vendor/scroll-css-animation.js',
	'public/js/vendor/distance-accordion.js',
	'public/js/vendor/popup-content.js',
	'public/js/vendor/split-scrollable.js',
	'public/js/vendor/jquery.rexAccordion.js',
	'public/js/vendor/particle-swarm.js'
];

gulp.task('prepare-effects', function() {
	effects_js_src.forEach( function( effect_src ) {
		return gulp.src(effect_src)
			.pipe(uglify({preserveComments: 'license'}).on('error', gulpUtil.log))
			.pipe(rename({suffix: '.min'}))
			.pipe(gulp.dest('public/js/vendor'))
	})
});

gulp.task('fast-load', function() {
	return gulp.src('public/js/build/fast-load.js')
		.pipe(uglify({preserveComments: 'license'}).on('error', gulpUtil.log))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('public/js/vendor'))
})

gulp.task('rxcf7', function() {
	return gulp.src('public/scss/rxcf7.scss')
		.pipe(sass({
			sourcemap: false,
			outputStyle:'compressed'
		}))
		.pipe(plumber())
		.pipe(autoprefixer({
			browsers: ["last 3 versions", "ie >= 9", "and_chr >= 2.3"]
		}))
		.pipe(plumber.stop())
		.pipe(size({title: 'RXCF7 CSS'}))
		.pipe(gulp.dest('public/css'));
})

/** -------- */

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

/**
 * BUILDERLIVE file concatenation logic
 * @since 2.0.0
 */

var builderlive_admin = [
	// 'admin/js/builderlive/nprogress.js',
	// 'admin/spectrum/spectrum.js',
	// 'admin/grapick/grapick.min.js',
	// 'admin/js/builderlive/jquery.actual.min.js',
	// 'admin/js/builderlive/Photoswipe/photoswipe.min.js',
	// 'admin/js/builderlive/Photoswipe/photoswipe-ui-default.min.js',
	// 'admin/js/builderlive/tippy.all.min.js',
	// 'public/js/vendor/jquery.rexAccordion.js',
	// 'public/js/vendor/tmpl.min.js',
	// 'admin/ace/src-min-noconflict/ace.js',
	// 'admin/ace/src-min-noconflict/mode-css.js',
	// 'admin/ace/src-min-noconflict/mode-html.js',
	'admin/js/builderlive/Rexlive_MediaUploader.js',
	'admin/js/builderlive/Rexlive_RexSlider_TextEditor.js',
	'admin/js/builderlive/Rexlive_Ajax_Calls.js',
	'admin/js/builderlive/Rexlive_Color_Palette.js',
	'admin/js/builderlive/Rexlive_Overlay_Palette.js',
	'admin/js/builderlive/Rexlive_Modals_Utils.js',
	'admin/js/builderlive/Rexlive_Insert_Video_Modal.js',
	'admin/js/builderlive/Rexlive_LayoutGrid_Modal.js',
	'admin/js/builderlive/Rexlive_Section_Width_Modal.js',
	'admin/js/builderlive/Rexlive_Section_Separators_Modal.js',
	'admin/js/builderlive/Rexlive_SectionMargins_Modal.js',
	'admin/js/builderlive/Rexlive_Section_Photoswipe_Modal.js',
	'admin/js/builderlive/Rexlive_Section_Hold_Grid_Modal.js',
	'admin/js/builderlive/Rexlive_Section_Fullheight.js',
	'admin/js/builderlive/Rexlive_SectionName_Modal.js',
	'admin/js/builderlive/Rexlive_Top_Tools.js',
	'admin/js/builderlive/Rexlive_Section_CustomClasses_Modal.js',
	'admin/js/builderlive/Rexlive_Section_Modal.js',
	'admin/js/builderlive/Rexlive_Background_Section_Color_Modal.js',
	'admin/js/builderlive/Rexlive_Overlay_Color_Section_Modal.js',
	'admin/js/builderlive/Rexlive_Section_Background_Image_Modal.js',
	'admin/js/builderlive/Rexlive_Section_Video_Modal.js',
	'admin/js/builderlive/Rexlive_Section_Background_Gradient.js',
	'admin/js/builderlive/Rexlive_Section_Overlay_Gradient.js',
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
	'admin/js/builderlive/Rexlive_Block_Accordion.js',
	'admin/js/builderlive/Rexlive_Block_Slideshow.js',
	'admin/js/builderlive/Rexlive_Block_Background_Gradient.js',
	'admin/js/builderlive/Rexlive_Text_Gradient.js',
	'admin/js/builderlive/Rexlive_Block_Overlay_Gradient.js',
	'admin/js/builderlive/Rexlive_Block_Url_Modal.js',
	'admin/js/builderlive/Rexlive_Block_Options_Modal.js',
	'admin/js/builderlive/Rexlive_Model_Modal.js',
	'admin/js/builderlive/Rexlive_Model_Edit_Name_Modal.js',
	'admin/js/builderlive/Rexlive_Open_Models_Warning.js',
	'admin/js/builderlive/Rexlive_CustomLayout_Modal.js',
	'admin/js/builderlive/Rexlive_Model_Edit_Modal.js',
	'admin/js/builderlive/Rexbuilder_RexSlider.js',
	'admin/js/builderlive/Rexlive_ChangeLayout_Modal.js',
	'admin/js/builderlive/Rexlive_Inline_SVG.js',
	'admin/js/builderlive/Rexlive_PostEdit.js',
	'admin/js/builderlive/Rexlive_PostEdit_MediaList.js',
	'admin/js/builderlive/Rexlive_LockedOption_Mask.js',
	'admin/js/builderlive/Rexlive_Model_Import.js',
	'admin/js/builderlive/Rexlive_Button_Import.js',
	'admin/js/builderlive/Rexlive_Edit_Button.js',
	'admin/js/builderlive/Rexlive_Element_Import.js',
	'admin/js/builderlive/Rexlive_Element_Choose.js',
	'admin/js/builderlive/Rexlive_Wpcf7_Add_Content.js',
	'admin/js/builderlive/Rexlive_Wpcf7_Edit_Content.js',
	'admin/js/builderlive/Rexlive_Wpcf7_Edit_Form.js',
	'admin/js/builderlive/Rexlive_Lateral_Menu.js',
	'admin/js/builderlive/Rexlive_Modals.js',
	'admin/js/builderlive/Rexlive_Base_Settings.js',
	'admin/js/builderlive/Rexbuilder_Util_Admin_Editor.js',
	'admin/js/builderlive/Rexlive_UpdateVideoInline.js',
	'admin/js/builderlive/Rexlive_Gradient_Utils.js',
	'admin/js/builderlive/Rexlive_Page_Margins.js',
	'admin/js/builderlive/Rexlive_Page_Settings_Modal.js',
	'admin/js/builderlive/Rexbuilder_Starting.js',
];

function adminJSScript(cb) {
  return gulp.src(builderlive_admin)
    .pipe(plumber())
    .pipe(concat('builderlive-admin.js'))
    .pipe(uglify({ mangle: true }))
    .pipe(size({title: 'ADMIN JS:'}))
    .pipe(gulp.dest('./admin/js'))
  cb();
}

gulp.task( 'adminJS', adminJSScript )

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
	'public/js/live/0-Rexbuilder_Array_Utilities.js',
	'public/js/live/0-Rexbuilder_Live_Utilities.js',
	'public/js/live/1-Rexbuilder_Color_Palette.js',
	'public/js/live/1-Rexbuilder_Overlay_Palette.js',
	'public/js/live/2-Text_Editor.js',
	'public/js/live/1-Rexbuilder_Section.js',
	'public/js/live/1-Rexbuilder_Section_Editor.js',
	'public/js/live/1-Rexbuilder_Block.js',
	'public/js/live/1-Rexbuilder_Block_Editor.js',
	'public/js/live/4-modals.js',

	'public/js/live/4-Rexbuilder_Live_Post_Edit.js',
	'public/js/vendor/jquery.requestanimationframe.min.js',
	'public/js/vendor/tmpl.min.js',
	'public/Photoswipe/photoswipe.min.js',
	'public/Photoswipe/photoswipe-ui-default.min.js',
	'public/js/vendor/jquery.mb.YTPlayer.min.js',
	'public/js/vendor/store.legacy.min.js',
	'public/js/build/1-Rexbuilder_Util.js',
	'public/js/build/1-Rexbuilder_Photoswipe.js',
	'public/js/live/1-Rexbuilder_Util_Editor.js',
	'public/js/live/1-Rexbuilder_CreateBlocks.js',
	'public/js/live/1-Rexbuilder_Dom_Util.js',
	'public/js/live/1-Rexbuilder_Color_Palette.js',
	'public/js/build/1-Rexbuilder_Rexbutton.js',
	'public/js/build/1-Rexbuilder_Rexelement.js',
	'public/js/live/1-Rexbuilder_Rexelement_Editor.js',
	'public/js/build/1-Rexbuilder_Rexwpcf7.js',
	'public/js/live/1-Rexbuilder_Rexwpcf7_Editor.js',
	'public/js/live/1-Rexbuilder_Overlay_Palette.js',
	'public/js/live/2-Rex_Save_Listeners.js',
	'public/js/vendor/jquery-ui.min.js',
	'public/js/vendor/jquery.ui.touch-punch.js',
	'public/js/vendor/lodash.js',
	'public/gridstack/dist/gridstack.js',
	'public/gridstack/dist/gridstack.jQueryUI.js',
	'public/js/build/3-Navigator.js',
	'public/js/vendor/flickity.pkgd.min.js',
	'public/js/build/2-RexSlider.js',
	'public/js/vendor/2-jquery.textFill.js',
	'public/js/build/8-VimeoVideo.js',
	'public/js/vendor/jquery.rexAccordion.js',
	'public/js/vendor/utilities.js',
	'public/js/live/2-jquery.perfectGridGalleryEditor.js',
	'public/js/vendor/3-velocity.min.js',
	'public/js/vendor/3-velocity.ui.min.js',
	'public/js/build/rexbuilder-public.js'
];

var builderlive_public = [
	'public/js/live/0-Rexbuilder_Array_Utilities.js',
	'public/js/live/0-Rexbuilder_Live_Utilities.js',
	'public/js/vendor/intersection-observer.js',
	'public/js/vendor/jquery.requestanimationframe.min.js',
	'public/js/vendor/tmpl.min.js',
	'public/Photoswipe/photoswipe.min.js',
	'public/Photoswipe/photoswipe-ui-default.min.js',
	'public/js/vendor/jquery.mb.YTPlayer.min.js',
	'public/js/vendor/store.legacy.min.js',
	'public/js/build/1-Rexbuilder_Util.js',
	'public/js/build/1-Rexbuilder_Photoswipe.js',
	'public/js/live/1-Rexbuilder_Util_Editor.js',
	'public/js/live/1-Rexbuilder_Dom_Util.js',
	'public/js/build/1-Rexbuilder_Rexbutton.js',

	'public/js/build/1-Rexbuilder_Rexelement.js',
	'public/js/build/1-Rexbuilder_Rexwpcf7.js',
	
	// 'public/js/live/1-Rexbuilder_CreateBlocks.js',
	// 'public/js/live/2-Rex_Save_Listeners.js',
	// 'public/js/vendor/jquery-ui.min.js',
	// 'public/js/vendor/jquery.ui.touch-punch.js',
	'public/js/vendor/lodash.js',
	'public/gridstack/dist/gridstack.js',
	// 'public/gridstack/dist/gridstack.jQueryUI.js',
	'public/js/build/3-Navigator.js',
	// 'public/js/build/5-Rexbuilder_FormFixes.js',
	'public/js/vendor/flickity.pkgd.min.js',
	'public/js/vendor/bg-lazyload.js',
	'public/js/build/2-RexSlider.js',
	'public/js/vendor/2-jquery.textFill.js',
	'public/js/build/8-VimeoVideo.js',
	'public/js/vendor/4-jquery.rexScrolled.js',
	'public/js/vendor/jquery.rexAccordion.js',
	'public/js/vendor/6-jquery.rexIndicator.js',
	// 'public/js/vendor/pixi.min.js',
	// 'public/js/vendor/jquery.rexEffect.js',
	// 'public/js/vendor/odometer.min.js',
	// 'public/js/vendor/6-jquery.rexSlideshow.js',
	// 'public/js/build/sticky-section.js',
	// 'public/js/build/scroll-css-animation.js',
	// 'public/js/build/distance-accordion.js',
	'public/js/vendor/utilities.js',
	// 'public/js/vendor/spectrum.js',
	// 'public/js/vendor/jquery.overlayScrollbars.min.js',
	'public/js/live/2-jquery.perfectGridGalleryEditor.js',
	'public/js/vendor/3-velocity.min.js',
	'public/js/vendor/3-velocity.ui.min.js',
	'public/js/vendor/4-jquery.rexScrollify.js',
	'public/js/build/rexbuilder-public.js',
	// 'public/js/build/fast-load.js',
];

var builderlive_public_editor_style = [
	// 'admin/rexpansive-font/font.css',
	'admin/public/css/builder.css',
	'admin/css/rex-custom-editor-buttons.css',
	'admin/spectrum/spectrum.css',
	'public/css/medium-editor.css',
	// 'public/css/medium-editor-insert-plugin-frontend.css',
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

// var public_res = builderlive_public_editor.concat(builderlive_public);
var public_res = builderlive_public_editor;
var public_editor_res = builderlive_public_editor_style;

gulp.task('public-editor-css', function() {
	return gulp.src('public/public-editor.scss')
		.pipe(sass({
			sourcemap: false,
			outputStyle:'compressed'
		}))
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
		.pipe(concat('builderlive-public.js'))
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
		.pipe(concat('builderlive-public.css'))
		.pipe(uglifyCSS({preserveComments: 'license'}).on('error', gulpUtil.log))
		.pipe(size({title:'Builderlive Style'}))
		.pipe(gulp.dest('public/css'))
});

gulp.task('build', ['prepare-effects','fast-load','public-css-build','builderlive-editor','builderlive','builderlive-editor-style','builderlive-style', 'adminJS']);

gulp.task('watch-live-production', ['prepare-effects','fast-load','builderlive-editor','builderlive'] ,function() {
	gulp.watch(['public/js/build/**/*.js','public/js/live/**/*.js','public/js/vendor/**/*.js'], ['builderlive-editor']);
	gulp.watch(['public/js/build/**/*.js','public/js/live/**/*.js','public/js/vendor/**/*.js'], ['builderlive']);
	gulp.watch(effects_js_src, ['prepare-effects']);
});

/* --- BUILD PUBLIC SCRIPTS AND STYLES ------ */

gulp.task('public-css-build', function() {
	return gulp.src('public/public.scss')
	.pipe(sass({
		outputStyle:'compressed'
	}))
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
	'public/js/vendor/jquery.rexAccordion.js',
	'public/js/vendor/photoswipe.min.js',
	'public/js/vendor/photoswipe-ui-default.min.js',
	'public/js/vendor/jquery.mb.YTPlayer.min.js',
	//'public/js/wow.min.js',
	//'public/js/underscore-min.js',
	//'public/js/jquery.getVideoThumbnail.js'
];

var public_js_logic_src = [
	'public/js/build/1-Rexbuilder_Util.js',
	'public/js/build/1-Rexbuilder_Photoswipe.js',
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

gulp.task('watch-public-js-build', function() {
	gulp.watch(public_js_logic_src, ['public-js-build']);
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

/* ---- BUILD LIVE PLUGIN VERSION ----- */
var live_zip_name = 'Premium-204-Rexpansive-Builder.zip';
// var live_folder_name = 'rexpansive-builder';		// old folder name
var live_folder_name = 'rexpansive-page-builder';

var live_file_map = [
	'admin/ace/src-min-noconflict/**/*',
	'admin/css/**/*',
	// 'admin/default-models/rexbuttons.json',
	'admin/font-awesome-4.3.0/**/*',
	'admin/grapick/**/*',
	'admin/img/**/*.*',
	'admin/js/**/*',
	'admin/lib/**/*',
	'admin/partials/**/*',
	'admin/required-plugins/**/*',
	'admin/rexpansive-font/**/*.*',
	'admin/spectrum/**/*',
	'admin/sprites/symbol/svg/sprite.symbol.svg',
	'admin/sprites-live/symbol/svg/sprite.symbol.svg',
	'admin/class-rexbuilder-admin.php',
	'admin/index.php',
	// 'admin/sprite-list.json',
	'includes/**/*',
	'languages/**/*',
	'Licensing/**/*',
	'public/css/images',
	'public/css/animate.css',
	'public/css/builderlive-public.css',
	'public/css/default-skin.png',
	'public/css/default-skin.svg',
	'public/css/flickity.min.css',
	'public/css/gridstack.css',
	'public/css/jquery-ui.min.css',
	'public/css/medium-editor.css',
	// 'public/css/medium-editor-insert-plugin-frontend.css',
	'public/css/preloader.gif',
	'public/css/public.css',
	'public/css/public-editor.css',
	'public/css/rex_buttons.css',
	'public/css/rxcf7.css',
	'public/css/spectrum.css',
	'public/css/textFill.css',
	'public/gridstack/dist/**/*',
	'public/img/**/*',
	'public/jquery.mb.YTPlayer/**/*',
	'public/js/build/**/*',
	'public/js/live/**/*',
	'public/js/vendor/**/*',
	'public/js/builderlive-editor.js',
	'public/js/builderlive-public.js',
	'public/partials/**/*',
	'public/Photoswipe/**/*',
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

gulp.task('build-zip', ['create-temp-live-folder', 'create-live-zip', 'remove-temp-live-folder']);

var exec = require('child_process').exec;

gulp.task('mac-live-zip', ['create-temp-live-folder'], function (cb) {
	exec('zip -r ' + live_zip_name + ' ' + live_folder_name + ' -x "*.DS_Store"', function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
});

gulp.task('build-live-mac', ['create-temp-live-folder', 'mac-live-zip', 'remove-temp-live-folder']);