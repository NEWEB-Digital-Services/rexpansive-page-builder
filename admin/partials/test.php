<style>
#spritesContainer,
#svgContainer {
	display: none;
}
.icon {
	display: inline-block;
    width: 1em;
    height: 1em;
    vertical-align: -0.1em;
    line-height: 1;
}
.icon > svg {
    display: inline-block;
	width: 1em;
	height: 1em;
	fill: #000;
	vertical-align: -0.1em;
	-webkit-transition: fill 600ms ease-out;
	-o-transition: fill 600ms ease-out;
	transition: fill 600ms ease-out;
}
h1 {
	font-size: 90px;
	text-align: center;
}
.demo-icon {
	cursor: pointer;
}
.demo-icon > svg {
	fill: green;
}
.demo-icon:hover > svg {
	fill: royalblue;
}
</style>
<div>
	<h1>
		<i class="icon demo-icon">
			<svg>
				<use xlink:href="#thumb-up"></use>
			</svg>
		</i>
	</h1>
</div>
<div id="svgContainer">
	<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 19.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
<g>
<g>
	<g>
		<path d="M507.113,428.415L287.215,47.541c-6.515-11.285-18.184-18.022-31.215-18.022c-13.031,0-24.7,6.737-31.215,18.022
			L4.887,428.415c-6.516,11.285-6.516,24.76,0,36.044c6.515,11.285,18.184,18.022,31.215,18.022h439.796
			c13.031,0,24.7-6.737,31.215-18.022C513.629,453.175,513.629,439.7,507.113,428.415z M481.101,449.441
			c-0.647,1.122-2.186,3.004-5.202,3.004H36.102c-3.018,0-4.556-1.881-5.202-3.004c-0.647-1.121-1.509-3.394,0-6.007
			L250.797,62.559c1.509-2.613,3.907-3.004,5.202-3.004c1.296,0,3.694,0.39,5.202,3.004L481.1,443.434
			C482.61,446.047,481.748,448.32,481.101,449.441z"/>
		<rect x="240.987" y="166.095" width="30.037" height="160.197"/>
		<circle cx="256.005" cy="376.354" r="20.025"/>
	</g>
</g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>

</div>
<div id="spritesContainer"></div>
<script>
;(function() {
	var container = document.getElementById('svgContainer');
	var svgHTML = container.innerHTML;
	var spritesContainer = document.getElementById('spritesContainer');

	var config = {
		full: true,
		plugins: [
			{cleanupAttrs					: true}, // cleanup attributes from newlines, trailing, and repeating spaces
			{removeDoctype					: true}, // remove doctype declaration
			{removeXMLProcInst				: true}, // remove XML processing instructions
			{removeComments					: true}, // remove comments
			{removeMetadata					: true}, // remove <metadata>
			{removeTitle						: true}, // remove <title>
			{removeDesc						: true}, // remove <desc>
			{removeUselessDefs				: true}, // remove elements of <defs> without id
			{removeXMLNS						: true}, // removes xmlns attribute (for inline svg, disabled by default)
			{removeEditorsNSData				: true}, // remove editors namespaces, elements, and attributes
			{removeEmptyAttrs				: true}, // remove empty attributes
			{removeHiddenElems				: true}, // remove hidden elements
			{removeEmptyText					: true}, // remove empty Text elements
			{removeEmptyContainers			: true}, // remove empty Container elements
			{removeViewBox					: true}, // remove viewBox attribute when possible
			{cleanupEnableBackground			: true}, // remove or cleanup enable-background attribute when possible
			{minifyStyles					: false}, // minify <style> elements content with CSSO
			{convertStyleToAttrs				: false}, // convert styles into attributes
			{ inlineStyles: false }, // Move <style> definitions to inline style attributes where possible
			{convertColors					: true}, // convert colors (from rgb() to #rrggbb, from #rrggbb to #rgb)
			{convertPathData					: true}, // convert Path data to relative or absolute (whichever is shorter), convert one segment to another, trim useless delimiters, smart rounding, and much more
			{convertTransform				: true}, // collapse multiple transforms into one, convert matrices to the short aliases, and much more
			{removeUnknownsAndDefaults		: true}, // remove unknown elements content and attributes, remove attrs with default values
			{removeNonInheritableGroupAttrs	: true}, // remove non-inheritable group's "presentation" attributes
			{removeUselessStrokeAndFill		: true}, // remove useless stroke and fill attrs
			{removeUnusedNS					: true}, // remove unused namespaces declaration
			{cleanupIDs						: true}, // remove unused and minify used IDs
			{cleanupNumericValues			: true}, // round numeric values to the fixed precision, remove default px units
			{cleanupListOfValues				: true}, // round numeric values in attributes that take a list of numbers (like viewBox or enable-background)
			{moveElemsAttrsToGroup			: true}, // move elements' attributes to their enclosing group
			{ moveGroupAttrsToElems: true }, // move some group attributes to the contained elements
			{collapseGroups					: true}, // collapse useless groups
			{removeRasterImages				: true}, // remove raster images (disabled by default)
			{mergePaths						: true}, // merge multiple Paths into one
			{convertShapeToPath				: true}, // convert some basic shapes to <path>
			{sortAttrs						: true}, // sort element attributes for epic readability (disabled by default)
			{removeDimensions				: true}, // remove width/height attributes if viewBox is present (opposite to removeViewBox, disable it first) (disabled by default)
			{removeAttrs						: true}, // remove attributes by pattern (disabled by default)
			{removeElementsByAttr			: true}, // remove arbitrary elements by ID or className (disabled by default)
			{addClassesToSVGElement			: true}, // add classnames to an outer <svg> element (disabled by default)
			{addAttributesToSVGElement		: true}, // adds attributes to an outer <svg> element (disabled by default)
			{removeStyleElement				: false}, // remove <style> elements (disabled by default)
			{removeScriptElement				: true}, // remove <script> elements (disabled by default)
		]
	};
	window.svgoInstance = new SVGO( config );
	var optimized = svgoInstance.optimize(svgHTML);
	
	optimized.then((optimized) => {
		spritesContainer.innerHTML = optimized.data;
		spritesContainer.children[0].setAttribute('id', 'thumb-up');
	})
}());
</script>