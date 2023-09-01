const { src, dest, watch } = require('gulp');
const { series, parallel } = require('gulp');
const exec = require('child_process').exec;
const clean = require('gulp-clean');
const zip = require('gulp-zip');
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const saveLicense = require('uglify-save-license')
const size = require('gulp-size');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const gulpUtil = require('gulp-util');
const svgSprite = require('gulp-svg-sprite');
const sourcemaps = require('gulp-sourcemaps');
const mode = require('gulp-mode')();
// const ts = require('gulp-typescript');
// const tsProject = ts.createProject('tsconfig.json');

const fs = require('fs');

// If mode.production() returns the passed string, we are in production mode
const production = 'test' === mode.production('test');

// To use with cross-env
// if ('undefined' === typeof process.env.NODE_ENV) throw new Error();
// const production = 'production' === process.env.NODE_ENV;
const filePath = 'rexpansive-builder.php';

fs.readFile(filePath, 'utf8', (err, data) => {
	if (err) throw err;

	const newString = `define( 'REXPANSIVE_BUILDER_PRODUCTION_SCRIPTS', ${production} );`;
	const result = data.replace(/define\(\s*\'REXPANSIVE_BUILDER_PRODUCTION_SCRIPTS\'\,\s*\w+\s*\)\;/, newString);

	fs.writeFile(filePath, result, 'utf8', function (err) {
		if (err) return console.log(err);
	});
});

const sassConfig = {
	// Default: nested
	// Values: nested, expanded, compact, compressed
	outputStyle: production ? 'compressed' : 'expanded'
};

/** LIVE BUILDER */
/** SPRITES TASKS */

var config = {
	shape: {
		// dimension		: {			// Set maximum dimensions
		//   maxWidth	: 32,
		//   maxHeight	: 32
		// },
		// spacing			: {			// Add padding
		//   padding		: 10
		// },
		dest: 'out/intermediate-svg' // Keep the intermediate files
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

// function compileTs() {
// 	return tsProject
// 		.src()
// 		.pipe(tsProject())
// 		.js.pipe(
// 			dest(function (params) {
// 				console.log(arguments);
// 			})
// 		);
// }

// LIVE e ADMIN
function liveSprites(cb) {
	return src('./admin/ICO_Live-new/**/*.svg').pipe(svgSprite(config)).pipe(dest('./admin/sprites-live'));
	cb();
}

exports.liveSprites = liveSprites;

/** END SPRITES TASKS */

// LIVE
// Not used in development or production tasks
function liveBuilderStyle(cb) {
	return src('admin/scss/rexlive/live-def.scss')
		.pipe(
			sass({
				sourcemap: false,
				outputStyle: 'compressed'
			})
		)
		.pipe(plumber())
		.pipe(
			autoprefixer({
				browsers: ['last 3 versions', 'ie >= 9', 'and_chr >= 2.3']
			})
		)
		.pipe(plumber.stop())
		.pipe(size({ title: 'LiveBuilder CSS' }))
		.pipe(dest('admin/css'));
	cb();
}

exports.liveBuilderStyle = liveBuilderStyle;

// ADMIN
function adminBuilderStyle(cb, dev) {
	return src('admin/scss/rexlive/tools-def.scss')
		.pipe(mode.development(sourcemaps.init()))
		.pipe(mode.development(sourcemaps.identityMap()))
		.pipe(sass(sassConfig))
		.pipe(mode.development(sourcemaps.write()))
		.pipe(plumber())
		.pipe(
			autoprefixer({
				browsers: ['last 3 versions', 'ie >= 9', 'and_chr >= 2.3']
			})
		)
		.pipe(plumber.stop())
		.pipe(size({ title: 'LiveBuilder Admin CSS' }))
		.pipe(dest('admin/css'));
	cb();
}

// Watching admin styles
function watchAdminBuilderStyle(cb) {
	watch(['./admin/scss/rexlive/**/*.scss'], { ignoreInitial: false }, adminBuilderStyle.bind(null, cb, true));
	cb();
}

// ADMIN JS
var builderlive_admin = [
	'admin/js/builderlive/drag-drop.js',
	'admin/js/builderlive/Rexbuilder_Admin_Templates.js',
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
	'admin/js/builderlive/Rexlive_Block_Photoswipe_Setting.js',
	'admin/js/builderlive/Rexlive_SectionMargins_Modal.js',
	'admin/js/builderlive/Rexlive_Section_Photoswipe_Modal.js',
	'admin/js/builderlive/Rexlive_Section_Hold_Grid_Modal.js',
	'admin/js/builderlive/Rexlive_Section_NavLabel_Modal.js',
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
	'admin/js/builderlive/Rexlive_Block_Photoswipe_Modal.js',
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
	'admin/js/builderlive/Rexlive_SectionOrderChanged_Modal.js',
	'admin/js/builderlive/Rexlive_Inline_SVG.js',
	'admin/js/builderlive/Rexlive_PostEdit.js',
	'admin/js/builderlive/Rexlive_PostEdit_MediaList.js',
	'admin/js/builderlive/Rexlive_LockedOption_Mask.js',
	'admin/js/builderlive/Rexlive_Model_Import.js',
	'admin/js/builderlive/Rexlive_Button_Import.js',
	'admin/js/builderlive/Rexlive_Edit_Button.js',
	'admin/js/builderlive/Rexlive_Form_Import.js',
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
	'admin/js/builderlive/Rexlive_Delete_Model_Modal.js',
	'admin/js/builderlive/Rexlive_Resynch_Content_Modal.js',
	'admin/js/builderlive/Rexbuilder_Starting.js'
];

function adminScript(cb) {
	cb();
	return src(builderlive_admin)
		.pipe(plumber())
		.pipe(concat('builderlive-admin.js'))
		.pipe(uglify({ mangle: true }))
		.pipe(size({ title: 'ADMIN JS:' }))
		.pipe(dest('./admin/js'));
}

function watchAdminScript(cb) {
	watch(builderlive_admin, adminScript);
	cb();
}

// LIVE JS
var builderlive_public_editor = [
	'public/js/vendor/tippy.all.min.js',
	'public/js/vendor/rangy-1.3.0/rangy-core.js',
	'public/js/vendor/rangy-1.3.0/rangy-classapplier.js',
	'public/js/vendor/rangy-1.3.0/rangy-selectionsaverestore.js',
	'public/js/vendor/rangy-1.3.0/rangy-textrange.js',
	'public/js/vendor/spectrum.js',
	// 'public/js/vendor/medium-editor.js',
	// 'public/js/vendor/medium-editor-toolbar-states.min.js',
	'public/js/vendor/ckeditor5/ckeditor5-bundle.umd.js',
	'public/js/live/0-Rexbuilder_Array_Utilities.js',
	'public/js/live/0-Rexbuilder_Gradient_Utils.js',
	'public/js/live/0-Rexbuilder_Live_Templates.js',
	'public/js/live/0-Rexbuilder_Live_Utilities.js',
	'public/js/live/0-Rexbuilder_RexEditedData.js',
	'public/js/live/1-Rexbuilder_Color_Palette.js',
	'public/js/live/1-Rexbuilder_Overlay_Palette.js',
	// 'public/js/live/2-Text_Editor.js',
	'public/js/live/2-CKEditor_Handler.js',
	'public/js/live/1-Rexbuilder_Section.js',
	'public/js/live/1-Rexbuilder_Section_Editor.js',
	'public/js/live/1-Rexbuilder_Block.js',
	'public/js/live/1-Rexbuilder_Block_Editor.js',
	'public/js/live/4-modals.js',

	'public/js/live/4-Rexbuilder_Live_Post_Edit.js',
	// 'public/js/vendor/jquery.requestanimationframe.min.js',
	'public/js/vendor/tmpl.min.js',
	'public/Photoswipe/photoswipe.min.js',
	'public/Photoswipe/photoswipe-ui-default.min.js',
	'public/js/vendor/jquery.mb.YTPlayer.min.js',
	'public/js/vendor/store.legacy.min.js',
	'public/js/build/0-Rexbuilder_Public_Templates.js',
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
	'public/js/vendor/anime.min.js',
	'public/js/build/99-Rexbuilder_App.js',
	'public/js/rexbuilder-public.js'
];

function builderliveEditor(cb) {
	cb();
	return src(builderlive_public_editor)
		.pipe(uglify({ /*preserveComments: 'license'*/output:{comments: saveLicense} }).on('error', gulpUtil.log))
		.pipe(concat('builderlive-editor.js'))
		.pipe(size({ title: 'Builderlive Editor' }))
		.pipe(dest('public/js'));
}

function watchBuilderliveEditor(cb) {
	watch(builderlive_public_editor, builderlive);
	cb();
}

// PUBLIC JS
var builderlive_public = [
	'public/js/live/0-Rexbuilder_Array_Utilities.js',
	'public/js/vendor/intersection-observer.js',
	// 'public/js/vendor/jquery.requestanimationframe.min.js',
	'public/js/vendor/tmpl.min.js',
	'public/Photoswipe/photoswipe.min.js',
	'public/Photoswipe/photoswipe-ui-default.min.js',
	'public/js/vendor/jquery.mb.YTPlayer.min.js',
	'public/js/vendor/store.legacy.min.js',
	'public/js/build/0-Rexbuilder_Public_Templates.js',
	'public/js/build/1-Rexbuilder_Util.js',
	'public/js/build/1-Rexbuilder_Photoswipe.js',
	'public/js/live/1-Rexbuilder_Util_Editor.js',
	'public/js/live/1-Rexbuilder_Dom_Util.js',
	'public/js/build/1-Rexbuilder_Rexbutton.js',

	'public/js/build/1-Rexbuilder_Rexelement.js',
	'public/js/build/1-Rexbuilder_Rexwpcf7.js',

	'public/js/vendor/rex-grid.js',
	'public/js/build/3-Navigator.js',
	'public/js/vendor/flickity.pkgd.min.js',
	'public/js/vendor/bg-lazyload.js',
	'public/js/build/2-RexSlider.js',
	'public/js/vendor/2-jquery.textFill.js',
	'public/js/build/8-VimeoVideo.js',
	'public/js/build/5-Rexbuilder_FormFixes.js',
	'public/js/vendor/4-jquery.rexScrolled.js',
	'public/js/vendor/jquery.rexAccordion.js',
	// 'public/js/vendor/6-jquery.rexIndicator.js',
	'public/js/vendor/utilities.js',
	'public/js/vendor/anime.min.js',
	'public/js/vendor/4-jquery.rexScrollify.js',
	'public/js/build/99-Rexbuilder_App.js',
	'public/js/rexbuilder-public.js'
];

function builderlive(cb) {
	return src(builderlive_public)
		.pipe(uglify({ output:{comments:saveLicense} }/*preserveComments: 'license'*/ ).on('error', gulpUtil.log))
		.pipe(concat('builderlive-public.js'))
		.pipe(size({ title: 'Builderlive' }))
		.pipe(dest('public/js'));
	cb();
}

function watchBuilderLive(cb) {
	watch(builderlive_public, builderlive);
	cb();
}

// LIVE CSS
function builderliveEditorStyle(cb, dev) {
	return src('live/builderlive-editor.scss')
		.pipe(mode.development(sourcemaps.init()))
		.pipe(mode.development(sourcemaps.identityMap()))
		.pipe(sass(sassConfig))
		.pipe(mode.development(sourcemaps.write()))
		.pipe(plumber())
		.pipe(
			autoprefixer({
				browsers: ['last 3 versions', 'ie >= 9', 'and_chr >= 2.3']
			})
		)
		.pipe(plumber.stop())
		.pipe(size({ title: 'Live CSS' }))
		.pipe(dest('live/css'));
	cb();
}

// Watching live & admin styles
function watchBuilderliveEditorStyle(cb) {
	watch(
		['./public/scss/**/*.scss', './admin/scss/rexlive/**/*.scss'],
		{ ignoreInitial: false },
		builderliveEditorStyle.bind(null, cb, true)
	);
	cb();
}

// PUBLIC CSS
function builderliveStyle(cb, dev) {
	return src('public/builderlive-public.scss')
		.pipe(mode.development(sourcemaps.init()))
		.pipe(mode.development(sourcemaps.identityMap()))
		.pipe(sass(sassConfig))
		.pipe(mode.development(sourcemaps.write()))
		.pipe(plumber())
		.pipe(
			autoprefixer({
				browsers: ['last 3 versions', 'ie >= 9', 'and_chr >= 2.3']
			})
		)
		.pipe(plumber.stop())
		.pipe(size({ title: 'Public CSS' }))
		.pipe(dest('public/css'));
	cb();
}

// Watching public styles
function watchBuilderliveStyle(cb) {
	watch(
		['./public/scss/**/*.scss', './public/builderlive-public.scss'],
		{ ignoreInitial: false },
		builderliveStyle.bind(null, cb, true)
	);
	cb();
}

// PUBLIC
var effects_js_src = [
	'public/js/vendor/jquery.rexEffect.js',
	'public/js/vendor/6-jquery.rexSlideshow.js',
	'public/js/vendor/sticky-section.js',
	// 'public/js/vendor/scroll-css-animation.js',
	'public/js/vendor/reveal-opacity-on-scroll.js',
	'public/js/vendor/distance-accordion.js',
	'public/js/vendor/popup-content.js',
	'public/js/vendor/popup-video.js',
	'public/js/vendor/split-scrollable.js',
	'public/js/vendor/jquery.rexAccordion.js',
	'public/js/vendor/particle-swarm.js',
 	'public/js/vendor/rex-indicator.js',
	'public/js/build/fast-load.js',
	'public/js/vendor/4-jquery.rexScrolled.js'
];

function minifyExternal(cb) {
	effects_js_src.forEach(function (effect_src) {
		return src(effect_src)
			.pipe(uglify({ /*preserveComments: 'license'*/output:{comments:saveLicense} }).on('error', gulpUtil.log))
			.pipe(rename({ suffix: '.min' }))
			.pipe(dest('public/js/vendor'));
	});
	cb();
}

exports.minifyExternal = minifyExternal;

// FIX CF7
function rxcf7(cb) {
	return src('public/scss/rxcf7.scss')
		.pipe(
			sass({
				sourcemap: false,
				outputStyle: 'compressed'
			})
		)
		.pipe(plumber())
		.pipe(
			autoprefixer({
				browsers: ['last 3 versions', 'ie >= 9', 'and_chr >= 2.3']
			})
		)
		.pipe(plumber.stop())
		.pipe(size({ title: 'RXCF7 CSS' }))
		.pipe(dest('public/css'));
	cb();
}

exports.rxcf7 = rxcf7;

exports.dev = parallel(watchAdminBuilderStyle, watchBuilderliveEditorStyle, watchBuilderliveStyle, watchAdminScript, watchBuilderLive);
exports.build = series(
	minifyExternal,
	parallel(adminScript, builderliveEditor, builderlive),
	parallel(
		adminBuilderStyle.bind(null, null, false),
		builderliveEditorStyle.bind(null, null, false),
		builderliveStyle.bind(null, null, false)
	)
);

/* ---- BUILD LIVE PLUGIN VERSION ----- */
var live_zip_name = 'Premium-220-Rexpansive-Builder.zip';
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
	'live/**/*',
	// 'public/css/images',
	'public/css/animate.css',
	'public/css/builderlive-public.css',
	'public/css/default-skin.png',
	'public/css/default-skin.svg',
	'public/css/flickity.min.css',
	'public/css/gridstack.css',
	'public/css/jquery-ui.min.css',
	// 'public/css/medium-editor.css',
	'public/js/vendor/ckeditor5/ckeditor5-bundle.css',
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
	'public/js/rexbuilder-public.js',
	'public/partials/**/*',
	'public/Photoswipe/**/*',
	'public/templates/**/*',
	'public/class-rexbuilder-public.php',
	'public/index.php',
	'shared/**/*',
	'shortcodes/**/*',
	'index.php',
	'LICENSE',
	'README.txt',
	'rexpansive-builder.php',
	'uninstall.php',
	'wpml-config.xml'
];

/**
 * Creating the plugin folder
 * @param {Function} cb callback
 */
function createTempLiveFolder(cb) {
	return src(live_file_map, { base: './' }).pipe(dest(live_folder_name + '/'));
	cb(err);
}

/**
 * Removing the plugin folder
 * @param {Function} cb callback
 */
function removeTempLiveFolder(cb) {
	return src(live_folder_name, { read: false }).pipe(clean());
	cb(err);
}

/**
 * Zip the folder
 * @param {Function} cb callback
 */
function standardZip(cb) {
	return src(live_folder_name + '/**/*', { base: './' })
		.pipe(zip(live_zip_name))
		.pipe(dest('./'));
	cb(err);
}

/**
 * Zip the folder on macOS
 * @param {Function} cb callback
 */
function macZip(cb) {
	exec('zip -r ' + live_zip_name + ' ' + live_folder_name + ' -x "*.DS_Store"', function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
}

exports.createTempLiveFolder = createTempLiveFolder;
exports.removeTempLiveFolder = removeTempLiveFolder;
exports.macZip = macZip;
exports.standardZip = standardZip;

// Final build tasks
exports.standardBuild = series(createTempLiveFolder, standardZip, removeTempLiveFolder);
exports.macBuild = series(createTempLiveFolder, macZip, removeTempLiveFolder);

// Deploy tasks
exports.deployWin = series(exports.build, exports.standardBuild);
exports.deployMac = series(exports.build, exports.macBuild);
