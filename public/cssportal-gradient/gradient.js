var markup; //Import Gradient Markup
var gradientType, posvalue, stops, pAspectRatio;
var shape;

var selectedPos, selectedSize;

var allLinearPos = ["top left",
					"top",
					"top right",
					"left",
					"right",
					"bottom left",
					"bottom",
					"bottom right"];
var allRadialPos = ["top left",
					"top center",
					"top right",
					"middle left",
					"middle center",
					"middle right",
					"bottom left",
					"bottom center",
					"bottom right"];
var allRadialSizes = ['closest-side',
					  "closest-corner",
					  "farthest-side",
					  "farthest-corner"];
					  
var sampleWidth, sampleHeight, thumbWidth, thumbHeight;

function getNewLinearPos(inputPos) {
	inputPos = inputPos.toLowerCase().trim();
	if(inputPos == "top left") return "bottom right";
	if(inputPos == "top") return "bottom";
	if(inputPos == "top right") return "bottom left";
	if(inputPos == "left") return "right";
	if(inputPos == "right") return "left";
	if(inputPos == "bottom left") return "top right";
	if(inputPos == "bottom") return "top";
	if(inputPos == "bottom right") return "top left";
}

function init() {
	sampleWidth = document.getElementById("otherSample").offsetWidth;
	sampleHeight = document.getElementById("otherSample").offsetHeight;
	thumbHeight = 50;
	thumbWidth = 86;
	
    document.getElementById("gtype").gradtype[0].checked = true;
	document.getElementById("markupsource").onfocus = clearImportGradMarkup;
    loadLinearTable();
}


function showImportGradMarkup() {
    document.getElementById("htxtlink").style.display = "none";
	document.getElementById("parselink").style.display = "";
	document.getElementById("hidelink").style.display = "";
    document.getElementById("markupsource").style.display = "";
}

function hideImportGradMarkup() {
    document.getElementById("htxtlink").style.display = "";
	document.getElementById("parselink").style.display = "none";
	document.getElementById("hidelink").style.display = "none";
    document.getElementById("markupsource").style.display = "none";
	document.getElementById("markuptype").innerHTML = "";
}

function updateSize() {
	sampleWidth = document.getElementById("otherSample").offsetWidth;
	sampleHeight = document.getElementById("otherSample").offsetHeight;
}


function countOccurence(substring, s) {
	return s.split(substring).length - 1;
}

function displayErrorMsg(m) {
	document.getElementById("markuptype").style.color = "red";
	document.getElementById("markuptype").innerHTML = m;
}

function loadOldWebkitMarkup() {
    // Strip markup of prefix, etc
    markup = markup.replace("background-image:", "");
    markup = markup.replace("background:", "");
    markup = markup.replace("-webkit-gradient(", "");
    markup = markup.replace(");", "");
    markup = markup.trim();

    var properties = markup.split("color-stop");
    var i = properties.length - 1;
    stops = new Array();

    while ((properties[i].indexOf("(") != -1) && (properties[i].indexOf(")") != -1)) {
        var stopsyntax = properties.pop().trim();
        stopsyntax = stopsyntax.replace("(", "");
        stopsyntax = stopsyntax.replace("),", "");
        stopsyntax = stopsyntax.replace(")", "");
        stopsyntax = stopsyntax.split(/\s+/);
        var offset = parseFloat(stopsyntax[0]);
        var stopcolor = stopsyntax[1].replace("\#", "");
        var currStop = [stopcolor, offset];
        stops.push(currStop);
        i--;
    }
    stops = stops.reverse();

    // Finding the gradient type in markup
    properties = properties[0].split(",");
    gradientType = properties.shift();

    if (gradientType.indexOf("linear") != -1) {
        gradientType = "linear";
        var startpos = properties.shift().trim();
        var endpos = properties.shift().trim();

        if ((startpos == "left top") && (endpos == "left bottom")) { selectedPos = "top"; } //T
        else if ((startpos == "left top") && (endpos == "right top")) { selectedPos = "left"; } //L
        else if ((startpos == "right top") && (endpos == "left top")) { selectedPos = "right"; } //R
        else if ((startpos == "left bottom") && (endpos == "left top")) { selectedPos = "bottom"; } //B
        else if ((startpos == "left top") && (endpos == "right bottom")) { selectedPos = "top left"; } //TL
        else if ((startpos == "right top") && (endpos == "left bottom")) { selectedPos = "top right"; } //TR
        else if ((startpos == "left bottom") && (endpos == "right top")) { selectedPos = "bottom left"; } //BL
        else if ((startpos == "right bottom") && (endpos == "left top")) { selectedPos = "bottom right"; } //BR
        else {
            alert("custom positions for Webkit linear");
        }

    } else if (gradientType.indexOf("radial") != -1) {

        gradientType = "radial";

		shape = "circle"; //by default (since Webkit doesn't support ellipse)

        var startpos = properties.shift().trim();
        var startradius = properties.shift().trim();
        var endpos = properties.shift().trim();
        var endradius = properties.shift().trim();

        var cx, cy;
        if (startpos == 'left top') { cx = 0; cy = 0; selectedPos = "top left"; } //TL
        else if (startpos == 'center top') { cx = 0.5; cy = 0; selectedPos = "top center"; } //TC
        else if (startpos == 'right top') { cx = 1; cy = 0; selectedPos = "top right"; } //TR
        else if (startpos == 'left center') { cx = 0; cy = 0.5; selectedPos = "middle left"; } //ML
        else if (startpos == 'center center') { cx = 0.5; cy = 0.5; selectedPos = "middle center"; } //MC
        else if (startpos == 'right center') { cx = 1; cy = 0.5; selectedPos = "middle right"; } //MR
        else if (startpos == 'left bottom') { cx = 0; cy = 1; selectedPos = "bottom left"; } //BL
        else if (startpos == 'center bottom') { cx = 0.5; cy = 1; selectedPos = "bottom center"; } //BC
        else if (startpos == 'right bottom') { cx = 1; cy = 1; selectedPos = "bottom right"; } //BR
        else {
            alert("custom positions for Webkit radial");
        }
        
		posvalue = findRadialPosition("userSpaceOnUse", cx, cy, endradius);
		
    } else {
        alert("incorrect gradient type.");
        return;
    }

    updateGradControl();

}

function findRadialPosition(gradientUnits, cx, cy, r) {
    var posx, posy;

    if (r.toString().indexOf("\%") != -1) {
        r = parseFloat(r) / 100;
    }

    if (pAspectRatio == "none") {   //circle
        shape = "ellipse";
    } else {                        //ellipse
        shape = "circle";
    }
	
	posx = parseFloat(cx);
	posy = parseFloat(cy);
	
	if ((posx == 0) && (posy == 0)) { selectedPos = "top left"; } // TL
	else if ((posx == 0.5) && (posy == 0)) { selectedPos = "top center"; } // TC
	else if ((posx == 1) && (posy == 0)) { selectedPos = "top right"; } // TR
	else if ((posx == 0) && (posy == 0.5)) { selectedPos = "middle left"; } // ML
	else if ((posx == 0.5) && (posy == 0.5)) { selectedPos = "middle center"; } // MC
	else if ((posx == 1) && (posy == 0.5)) { selectedPos = "middle right"; } // MR
	else if ((posx == 0) && (posy == 1)) { selectedPos = "bottom left"; } // BL
	else if ((posx == 0.5) && (posy == 1)) { selectedPos = "bottom center"; } // BC
	else if ((posx == 1) && (posy == 1)) { selectedPos = "bottom right"; } // BR
	else { 
		selectedPos = "Custom Position"; 
		alert("Custom position");
		cusCX = cx;
		cusCY = cy;
	}
	
	if (shape == "circle") {

		w = sampleWidth;
		h = sampleHeight;
	
        d_closestside = Math.round(radialgradient_findMinDistanceToSides(w, h, posx * w, posy * h));
        d_closestcorner = Math.round(radialgradient_findMinDistanceToCorners(w, h, posx * w, posy * h));
        d_farthestside = Math.round(radialgradient_findMaxDistanceToSides(w, h, posx * w, posy * h));
        d_farthestcorner = Math.round(radialgradient_findMaxDistanceToCorners(w, h, posx * w, posy * h));

	} else {
	    d_closestside = radialgradient_findMinDistanceToSides(1, 1, posx, posy);
        d_closestcorner = radialgradient_findMinDistanceToCorners(1, 1, posx, posy);
        d_farthestside = radialgradient_findMaxDistanceToSides(1, 1, posx, posy);
        d_farthestcorner = radialgradient_findMaxDistanceToCorners(1, 1, posx, posy);
	}

	if (d_closestside == r) { selectedSize = 'closest-side'; }
    else if (d_closestcorner == r) { selectedSize = "closest-corner"; }
    else if (d_farthestside == r) { selectedSize = "farthest-side"; }
    else if (d_farthestcorner == r) { selectedSize = "farthest-corner"; }
	else {
        msg = "incorrect size during parsing" + "\n";
        msg += "POS: " + selectedPos + "; X: " + posx + "; Y: " + posy + "; SHAPE: " + shape + ";\n";
        msg += r + " (" + d_closestside + " " + d_closestcorner + " " + d_farthestside + " " + d_farthestcorner + ")" + "\n";
        return;
    }
}


function loadNewWebkitMarkup() {
    var checkType = markup;
	
    markup = markup.replace("background-image:", "");
    markup = markup.replace("background:", "");
    markup = markup.replace("-webkit-linear-gradient(", "");
    markup = markup.replace("-webkit-radial-gradient(", "");
    markup = markup.replace(");", "");
    markup = markup.trim();

	detectCommonMarkup(checkType, markup);
}

function loadMozMarkup() {
    var checkType = markup;

    // Strip markup of prefix, etc
    markup = markup.replace("background-image:", "");
    markup = markup.replace("background:", "");
    markup = markup.replace("-moz-linear-gradient(", "");
    markup = markup.replace("-moz-radial-gradient(", "");
    markup = markup.replace(");", "");
    markup = markup.trim();

	detectCommonMarkup(checkType, markup);
}

function loadOMarkup() {
    var checkType = markup;

    // Strip markup of prefix, etc
    markup = markup.replace("background-image:", "");
    markup = markup.replace("background:", "");
    markup = markup.replace("-o-linear-gradient(", "");
    markup = markup.replace("-o-radial-gradient(", "");
    markup = markup.replace(");", "");
    markup = markup.trim();

	detectCommonMarkup(checkType, markup);
}

function loadMSMarkup() {
    var checkType = markup;

    // Strip markup of prefix, etc
    markup = markup.replace("background-image:", "");
    markup = markup.replace("background:", "");
    markup = markup.replace("-ms-linear-gradient(", "");
    markup = markup.replace("-ms-radial-gradient(", "");
    markup = markup.replace(");", "");
    markup = markup.trim();

	detectCommonMarkup(checkType, markup);
}

function loadW3CMarkup() {
    var checkType = markup;

    // Strip markup of prefix, etc
    markup = markup.replace("background-image:", "");
    markup = markup.replace("background:", "");
    markup = markup.replace("linear-gradient(", "");
    markup = markup.replace("radial-gradient(", "");
    markup = markup.replace(");", "");
    markup = markup.trim();
	
	detectCommonMarkup(checkType, markup);

}

function detectCommonMarkup(checkType, markup) {

    // Finding the gradient type in markup
    var properties, position, size, lc_position, lc_size, lc_shape;
    if (checkType.indexOf("linear") != -1) {
        gradientType = "linear";
        properties = markup.split(",");
		position = properties.shift();
        lc_position = position.toLowerCase();

        if (lc_position == "top" || lc_position == "to bottom") { selectedPos = "top"; }
        else if (lc_position == "left" || lc_position == "to right") { selectedPos = "left"; }
        else if (lc_position == "right" || lc_position == "to left") { selectedPos = "right"; }
        else if (lc_position == "bottom" || lc_position == "to top") { selectedPos = "bottom"; }
        else if (lc_position == "top left" || lc_position == "to bottom right") { selectedPos = "top left"; }
        else if (lc_position == "top right" || lc_position == "to bottom left") { selectedPos = "top right"; }
        else if (lc_position == "bottom left" || lc_position == "to top right") { selectedPos = "bottom left"; }
        else if (lc_position == "bottom right" || lc_position == "to top left") { selectedPos = "bottom right"; }
        else {
			// No position specified; according to W3C, default linear position is top
			if (!isValidProperty(lc_position)) {
				displayErrorMsg("Syntax Error. Example: background-image: linear-gradient(to bottom right, #FFFFFF 0%, #00A3EF 100%);");
				return;
			}
			properties.unshift(position);
			selectedPos = "top";
        }

    } else if (checkType.indexOf("radial") != -1) {
        gradientType = "radial";
        properties = markup.split(",");
        position = properties.shift().trim();
		lc_position = position.toLowerCase();

        var posx, posy;
        if (lc_position == "left top") { selectedPos = "top left"; }
        else if (lc_position == "center top") { selectedPos = "top center"; }
        else if (lc_position == "right top") { selectedPos = "top right"; }
        else if (lc_position == "left center") { selectedPos = "middle left"; }
        else if (lc_position == "center") { selectedPos = "middle center"; }
        else if (lc_position == "right center") { selectedPos = "middle right"; }
        else if (lc_position == "left bottom") { selectedPos = "bottom left"; }
        else if (lc_position == "center bottom") { selectedPos = "bottom center"; }
        else if (lc_position == "right bottom") { selectedPos = "bottom right"; }
        else {
			
			properties.unshift(position);
			selectedPos = "center";
        }

		var shapesize = properties.shift().trim().split(/\s+/);
        shape = shapesize[0];
		lc_shape = shape.toLowerCase();
		size = shapesize[1];
        lc_size = size.toLowerCase();
		
		if (lc_size == "cover") { selectedSize = "closest-side"; }
		else if (lc_size == "closest-side") { selectedSize = 'closest-side'; }
		else if (lc_size == "closest-corner") { selectedSize = "closest-corner"; }
		else if (lc_size == "farthest-side") { selectedSize = "farthest-side"; }
		else if (lc_size == "farthest-corner") { selectedSize = "farthest-corner"; }
		else if (lc_size == "contain") { selectedSize = "farthest-corner"; }
        else {
			// No size specified; according to W3C, default radial shape and size is ellipse cover
			shapesize = shape + " " + size;
			properties.unshift(shapesize);
			shape = "ellipse";
			selectedSize = "farthest-corner";
        }
		if(shapesize.length > 3) {
			lc_position = shapesize[3];
			if(shapesize.length > 4)
				lc_position += " " + shapesize[4];
			if (lc_position == "left top") { selectedPos = "top left"; }
			else if (lc_position == "center top") { selectedPos = "top center"; }
			else if (lc_position == "right top") { selectedPos = "top right"; }
			else if (lc_position == "left center") { selectedPos = "middle left"; }
			else if (lc_position == "center") { selectedPos = "middle center"; }
			else if (lc_position == "right center") { selectedPos = "middle right"; }
			else if (lc_position == "left bottom") { selectedPos = "bottom left"; }
			else if (lc_position == "center bottom") { selectedPos = "bottom center"; }
			else if (lc_position == "right bottom") { selectedPos = "bottom right"; }
		}
		else if(shapesize.length == 3) {
			displayErrorMsg("Syntax Error. Example: background-image: radial-gradient(ellipse farthest-corner at center, #FFFFFF 0%, #00EFA3 100%);");
				return;
		}
		/*
		if(lc_position) {
			properties = markup.split(",");
			position = properties.shift().trim();
			lc_position = position.toLowerCase();
			alert(lc_position);
		}
		*/
    } else {
        displayErrorMsg("Cannot parse input.");
        return;
    }

    stops = new Array();
    for (var i = 0; i < properties.length; i++) {
        var stopsyntax = properties[i].trim().split(/\s+/);
        var stopcolor = stopsyntax[0].replace("\#", "");
		if (!isHex(stopcolor)) {
			displayErrorMsg("Cannot parse input. Stop colors must be in hex format.");
			return;
		}
        var offset = parseInt(stopsyntax[1]);
        var currStop = [stopcolor, offset];
        stops.push(currStop);
    }
    updateGradControl();
}

function isValidProperty(x) {
	props = x.split(/\s+/);
	if (props.length != 2) {
		return false;
	}	
	//First part must be hex
	var textHex = props[0].replace("\#", "");
	if (!isHex(textHex)) {
		return false;
	}
	//Second part must be %
	if (!hasNumbers(props[1])) {
		return false;
	}
	return true;
}

function isHex(entry){
	validChar='0123456789ABCDEF'; // ok chars
	strlen=entry.length; // test string length
	if (strlen < 1) {
		return false;
	}
	entry=entry.toUpperCase(); // case insensitive
	// Now scan for illegal characters
	for (idx = 0; idx < strlen; idx++) {
		if(validChar.indexOf(entry.charAt(idx)) < 0) {
			return false;
		}
	} // end scan
	return true;
}

function hasNumbers(t) {
	var regex = /\d/g;
	return regex.test(t);
}


function updateGradControl() {

    // Setting type
    if (gradientType == "linear") {
        document.getElementById("gtype").gradtype[0].checked = true;
    } else if (gradientType == "radial") {
        document.getElementById("gtype").gradtype[1].checked = true;
    }
    if (stops == null) {
        alert("No stops detected");
        return;
    }
    // Setting the color-stops and offsets for first and last stops
    document.getElementById("color0").value = stops[0][0];
    document.getElementById("offset0").value = stops[0][1];
    repaint(document.getElementById("color0"));

    document.getElementById("colorN").value = stops[stops.length - 1][0];
    document.getElementById("offsetN").value = stops[stops.length - 1][1];
    repaint(document.getElementById("colorN"));

    clearStops();

    for (var i = 1; i < stops.length - 1; i++) {
        insertAllStops(stops[i][0], stops[i][1]);
    }
    updateAllPanelsFromImport();
}

var nextStopCount = 2;
var StopValue0 = 0;

function insertAllStops(color, offset) {

   	nNewStop = nextStopCount - 1;
	
	var insert = document.getElementById("stopsLastRow");
	var new_row = insert.parentNode.insertRow( insert.rowIndex );

//LABEL	
	var cell0 = new_row.insertCell(0);
	cell0.id = "stopRow" + nNewStop.toString() + "label"
	cell0.innerHTML = "Stop:";

//OFFSET	
	var cell1 = new_row.insertCell(1);
	var element2 = document.createElement("input");
	cell1.id = "stopRow" + nNewStop.toString() + "offset";
    cell1.innerHTML = "<div class='input-group'><input class='form-control gradpercent' id='offset" + nNewStop.toString() + "' type='text' size='6' value='" + offset +"' /><span class='input-group-addon'>%</span></div>";

//COLOR	
	var cell2 = new_row.insertCell(2);
    cell2.id = "stopRow" + nNewStop.toString() + "color";
    var element3 = document.createElement("input");
    element3.id = "color" + nNewStop.toString();
    element3.className = "form-control";
    element3.size = "6";
    element3.type = "text";
    element3.value = color;
    cell2.appendChild(element3);
    var myCol = new jscolor.color(element3);
    repaint(element3);

//DELETE	
	var cell3 = new_row.insertCell(3);
    cell3.className = "deletebutton";
    cell3.id = "stopRow" + nNewStop.toString() + "button";
    cell3.innerHTML = "<img id='" + nNewStop.toString() +"' onclick='removeStop(this);' src='delete.png'>";

    nextStopCount++;
    
}

function clearStops() {
    var ct = nextStopCount;
    for (var i = 1; i < ct; i++) {
        var stopLabel = document.getElementById("stopRow" + i + "label");
        if (stopLabel != null) { stopLabel.parentNode.removeChild(stopLabel); }
        var stopOffset = document.getElementById("stopRow" + i + "offset");
        if (stopOffset != null) { stopOffset.parentNode.removeChild(stopOffset); }
        var stopColor = document.getElementById("stopRow" + i + "color");
        if (stopColor != null) { stopColor.parentNode.removeChild(stopColor); }
        var stopButton = document.getElementById("stopRow" + i + "button");
        if (stopButton != null) { stopButton.parentNode.removeChild(stopButton); }
    }
}

function clearTable() {
    var cell = document.getElementById("gradAttributes");
    if (cell.hasChildNodes()) {
        while (cell.childNodes.length >= 1) {
            cell.removeChild(cell.firstChild);
        }
    }
}

function loadLinearTable() {
    gradientType = "linear";
    shape = "none";
    document.getElementById("sizes").style.display = "none";
    createPositionPanel();
}

function loadRadialTable(s) {
    gradientType = "radial";
    shape = s;
    createPositionPanel();
}

function createPositionPanel() {
    clearPosPanel();
    clearSizePanel();

    thumbnailPosPanel = document.createElement("table");
    thumbnailPosPanel.id = "thumbnailPosPanel";
    thumbnailPosPanel.className = "thumbnailPosPanel";
    var tr = document.createElement("tr");
    thumbnailPosPanel.appendChild(tr);

    var posPerRow = 4;

    var svg, base64url;
    var defaultpos;
    if (gradientType == "linear") {
		document.getElementById("dirLabel").innerHTML = "<span>Gradient Direction:</span>";
        if ((selectedPos == null) || !(allLinearPos.contains(selectedPos))) {
            defaultpos = allLinearPos[1];
        } else {
            defaultpos = selectedPos;
        }
        for (var i = 0; i < allLinearPos.length; i++) {
            var th = document.createElement("td");
            if (posPerRow == 0) {
                tr = document.createElement("tr");
                thumbnailPosPanel.appendChild(tr);
                posPerRow = 4;
            } else {
                posPerRow--;
            }
            tr.appendChild(th);
            var thumbnail = document.createElement("div");
            th.appendChild(thumbnail);
            thumbnail.className = "positionThumbnail";
            thumbnail.id = "pos" + i;
            thumbnail.name = allLinearPos[i];

            thumbnail.appendChild(document.createTextNode('to ' + getNewLinearPos(allLinearPos[i])));

            var markups = getMarkup(allLinearPos[i], null, thumbWidth, thumbHeight);

			if (!thumbnail.addEventListener) { 
				thumbnail.attachEvent("onclick", selectPos); 
			} else { 
				thumbnail.addEventListener("click", selectPos, true); 
			}

        }
    } else if (gradientType == "radial") {
		document.getElementById("dirLabel").innerHTML = "<span>Gradient Position:</span>";
        var defaultsize;
        if ((selectedSize == null) || !(allRadialPos.contains(selectedPos))) {
            defaultpos = allRadialPos[4];
            defaultsize = allRadialSizes[3];
        } else {
            defaultpos = selectedPos;
            defaultsize = selectedSize;
        }
        for (var i = 0; i < allRadialPos.length; i++) {
            var th = document.createElement("td");
            if (posPerRow == 0) {
                tr = document.createElement("tr");
                thumbnailPosPanel.appendChild(tr);
                posPerRow = 3;
            } else {
                posPerRow--;
            }
            tr.appendChild(th);
            var thumbnail = document.createElement("div");
            th.appendChild(thumbnail);
            thumbnail.className = "positionThumbnail";
            thumbnail.id = "pos" + i;
            thumbnail.name = allRadialPos[i];
            thumbnail.appendChild(document.createTextNode(allRadialPos[i]));

            var markups = getMarkup(allRadialPos[i], defaultsize, thumbWidth, thumbHeight);

			if (!thumbnail.addEventListener) { 
				thumbnail.attachEvent("onclick", selectPos); 
			} else { 
				thumbnail.addEventListener("click", selectPos, true); 
			}
        }
    } else {
        alert("Error: incorrect gradient type (" + gradientType + ")");
        return;
    }

    document.getElementById("posPanel").appendChild(thumbnailPosPanel);
    pickPos(defaultpos);
    UpdateSample();
}

function updateAllPanelsFromImport() {
    var newPos = selectedPos;
    var newSize = selectedSize;
    createPositionPanel();
    selectedPos = newPos;
    selectedSize = newSize;
    updateAllPanels();
}

function updateAllPanels() {
    var newPos = selectedPos;
    var newSize = selectedSize;

    //Updating the thumbnails
    var thumbnail, markups;
    if (gradientType == "linear") {
        for (var i = 0; i < allLinearPos.length; i++) {
            thumbnail = document.getElementById("pos" + i);
            markups = getMarkup(allLinearPos[i], null, thumbWidth, thumbHeight);
        }
    } else if (gradientType == "radial") {
        for (var i = 0; i < allRadialPos.length; i++) {
            thumbnail = document.getElementById("pos" + i);
            if (selectedSize == null) {
                newSize = allRadialSizes[3];
            }
            markups = getMarkup(allRadialPos[i], newSize, thumbWidth, thumbHeight);
        }
    }
    pickPos(newPos);
    if ((gradientType == "radial") && (newSize != null)) {
        createSizePanel(newPos);
        pickSize(newSize);
    }
    UpdateSample();
}

function selectPos(e) {
    var allpos;
    if (gradientType == "linear") {
        allpos = allLinearPos;
    } else if (gradientType == "radial") {
        allpos = allRadialPos;
    }
    for (var i = 0; i < allpos.length; i++) {
        document.getElementById("pos" + i).style.border = "2px solid #D9D9D9";
    }

    document.getElementById(e.target.id).style.border = "2px solid #3366FF";
    selectedPos = e.target.name;

    if (gradientType == "radial") {
        createSizePanel(selectedPos);
	}
    updateAllPanels();
}

function pickPos(position) {
    var allpos;
    if (gradientType == "linear") {
        allpos = allLinearPos;
    } else if (gradientType == "radial") {
        allpos = allRadialPos;
    }

    for (var i = 0; i < allpos.length; i++) {
        var currPos = document.getElementById("pos" + i);
        currPos.style.padding = "3px";
        currPos.style.cursor = "pointer";
        currPos.style.borderRadius = "5px";
        currPos.style.whiteSpace = "nowrap";
        currPos.style.textAlign = "center";
        if (currPos.name == position) {
            currPos.style.border = "2px solid #3366FF";
            currPos.style.background = "#E5ECFF";
            selectedPos = currPos.name;
        } else {
            currPos.style.border = "2px solid #D9D9D9";
            currPos.style.background = "#FFF";
        }
    }
    if (gradientType == "radial") {
        createSizePanel(selectedPos);
    }
}

function clearPosPanel() {
    var thumbnailPosPanel = document.getElementById("thumbnailPosPanel");
    if (thumbnailPosPanel != null) {
        thumbnailPosPanel.parentNode.removeChild(thumbnailPosPanel);
    }
}

function clearSizePanel() {
    var thumbnailSizePanel = document.getElementById("thumbnailSizePanel");
    if (thumbnailSizePanel != null) {
        thumbnailSizePanel.parentNode.removeChild(thumbnailSizePanel);
    }
}

function createSizePanel(position) {
    var thumbnailSizePanel = document.getElementById("thumbnailSizePanel");
    if (thumbnailSizePanel != null) {
        thumbnailSizePanel.parentNode.removeChild(thumbnailSizePanel);
    }
    thumbnailSizePanel = document.createElement("table");
    thumbnailSizePanel.id = "thumbnailSizePanel";
    var tr = document.createElement("tr");
    thumbnailSizePanel.appendChild(tr);

    for (var i = 0; i < allRadialSizes.length; i++) {
        var th = document.createElement("td");
        tr.appendChild(th);
        var thumbnail = document.createElement("div");
        th.appendChild(thumbnail);
        thumbnail.className = "sizeThumbnail";
        thumbnail.id = "size" + i;
        thumbnail.name = allRadialSizes[i];
        thumbnail.appendChild(document.createTextNode(allRadialSizes[i]));
		if (!thumbnail.addEventListener) { 
				thumbnail.attachEvent("onclick", selectSize); 
			} else { 
				thumbnail.addEventListener("click", selectSize, true); 
		}

        var markups = getMarkup(position, allRadialSizes[i], thumbWidth, thumbHeight);
    }
    document.getElementById("sizePanel").appendChild(thumbnailSizePanel);
    document.getElementById("sizes").style.display = "";
    if (selectedSize == null) {
        pickSize(allRadialSizes[3]); //select default size
    } else {
        pickSize(selectedSize);
    }
}

function selectSize(e) {
    for (var i = 0; i < allRadialSizes.length; i++) {
        document.getElementById("size" + i).style.border = "2px solid #D9D9D9";
    }
    document.getElementById(e.target.id).style.border = "2px solid #3366FF";
    selectedSize = e.target.name;
	
    updateAllPanels();
}

function pickSize(size) {
    for (var i = 0; i < allRadialSizes.length; i++) {
        var currSize = document.getElementById("size" + i);
        currSize.style.padding = "3px";
        currSize.style.cursor = "pointer";
        currSize.style.borderRadius = "5px";
        currSize.style.whiteSpace = "nowrap";
        currSize.style.textAlign = "center";

        if (currSize.name.toLowerCase() == size.toLowerCase()) {
            currSize.style.border = "2px solid #3366FF";
            currSize.style.background = "#E5ECFF";
            selectedSize = currSize.name;
        } else {
            currSize.style.border = "2px solid #D9D9D9";
            currSize.style.background = "#FFF";
        }
    }

    UpdateSample();
}

function InsertStop1() {

	nNewStop = nextStopCount - 1;
	
	var insert = document.getElementById("stopsLastRow");
	var new_row = insert.parentNode.insertRow( insert.rowIndex );
	
//LABEL	
	var cell0 = new_row.insertCell(0);
	cell0.id = "stopRow" + nNewStop.toString() + "label"
	cell0.innerHTML = "Stop:";
	
//OFFSET	
    var prevStop = nextStopCount;
    while ((document.getElementById("offset" + prevStop.toString()) == null) && (prevStop > 0)) {
        prevStop--;
    }
    StopValue0 = parseFloat(document.getElementById("offset" + prevStop.toString()).value);
    var StopValue2 = 100;
    var StopValue1 = (StopValue0 + StopValue2) / 2;

	var cell1 = new_row.insertCell(1);
	var element2 = document.createElement("input");
	cell1.id = "stopRow" + nNewStop.toString() + "offset";
    cell1.innerHTML = "<div class='input-group'><input class='form-control gradpercent' id='offset" + nNewStop.toString() + "' type='text' size='6' value='" + StopValue1 +"' /><span class='input-group-addon'>%</span></div>";    
    
//COLOR	
	var cell2 = new_row.insertCell(2);
    cell2.id = "stopRow" + nNewStop.toString() + "color";
    var element3 = document.createElement("input");
    element3.id = "color" + nNewStop.toString();
    element3.size = "6";
    element3.className = "form-control";
    element3.type = "text";
    element3.value = RandomColor();
    cell2.appendChild(element3);
    var myCol = new jscolor.color(element3);
    repaint(element3);

//DELETE	
	var cell3 = new_row.insertCell(3);
    cell3.id = "stopRow" + nNewStop.toString() + "button";
    cell3.className = "deletebutton";
    cell3.innerHTML = "<img id='" + nNewStop.toString() +"' onclick='removeStop(this);' src='delete.png'>";
	
    nextStopCount++;

    updateAllPanels();

}



function removeStop(obj) {
    var num = obj.id;
    var currLabel, currOffset, currColor, currButton;
    currLabel = document.getElementById("stopRow" + num + "label");
    currOffset = document.getElementById("stopRow" + num + "offset");
    currColor = document.getElementById("stopRow" + num + "color");
    currButton = document.getElementById("stopRow" + num + "button");

    currLabel.parentNode.removeChild(currLabel);
    currOffset.parentNode.removeChild(currOffset);
    currColor.parentNode.removeChild(currColor);
    currButton.parentNode.removeChild(currButton);

    updateAllPanels();
}

var markup, gecko, oldwebkit, newwebkit, opera, base64url, ms, w3c;

function getMarkup(inputPos, inputSize, inputWidth, inputHeight) {
    if (gradientType == "linear") {
		w3c = lineargradient_w3c(inputPos);
		gecko = lineargradient_gecko(inputPos);
		oldwebkit = lineargradient_webkit(inputPos);
		newwebkit = gecko.replace("-moz-", "-webkit-");
		opera = gecko.replace("-moz-", "-o-");
		ms = gecko.replace("-moz-", "-ms-");
    } else if (gradientType == "radial") {
		gecko = radialgradient_gecko(inputPos, inputSize);
		w3c = radialgradient_w3c(inputPos, inputSize);
		oldwebkit = radialgradient_webkit(inputPos, inputSize, inputWidth, inputHeight);
		newwebkit = gecko.replace("-moz-", "-webkit-");
		opera = gecko.replace("-moz-", "-o-");
		ms = gecko.replace("-moz-", "-ms-");
    } else {
        alert("Please select a gradient type.");
        return;
    }
    markup = "";
	if(gradientType == "linear" && inputPos.indexOf(' ') >= 0) {
	}
	if (document.getElementById("showcomments").checked == true ) {
		markup += "/* IE10+ */ \nbackground-image: " + ms + ";\n\n";
		markup += "/* Mozilla Firefox */ \nbackground-image: " + gecko + ";\n\n";
		markup += "/* Opera */ \nbackground-image: " + opera + ";\n\n";
		markup += "/* Webkit (Safari/Chrome 10) */ \nbackground-image: " + oldwebkit + ";\n\n";
		markup += "/* Webkit (Chrome 11+) */ \nbackground-image: " + newwebkit + ";\n\n";
		markup += "/* W3C Markup */ \nbackground-image: " + w3c + ";";
	}else{
		markup += "background-image: " + ms + ";\n\n";
		markup += "background-image: " + gecko + ";\n\n";
		markup += "background-image: " + opera + ";\n\n";
		markup += "background-image: " + oldwebkit + ";\n\n";
		markup += "background-image: " + newwebkit + ";\n\n";
		markup += "background-image: " + w3c + ";";
	}
	
    return markup;
}

function UpdateSample() {
    markup = getMarkup(selectedPos, selectedSize, sampleWidth, sampleHeight);

    document.getElementById("othersource").textContent = markup;

    document.getElementById("otherSample").setAttribute("style", markup);
}

function lineargradient_w3c(inputPos) {
	var angle, direction;
	direction = 'to ' + getNewLinearPos(inputPos) + ', ';
	
	var nStops = nextStopCount;
    var stops = "";
    for (var n = 0; n < nStops; ++n) {
        var stopNum = (n < nStops - 1) ? n.toString() : "N";
        if (document.getElementById("offset" + stopNum) != null) {
        
        if (document.getElementById("format").value == "rgb") {
          colformat = "rgb(" + hexToRgb(document.getElementById("color" + stopNum).value) + ")";
        } else if (document.getElementById("format").value == "hex") {
          colformat = "#" + document.getElementById("color" + stopNum).value;
        } else if (document.getElementById("format").value == "rgba") {
          colformat = "rgba(" + hexToRgb(document.getElementById("color" + stopNum).value) + ",1)";
        }
        
            stops += '{color} {offset}, '
					.replace(/{color}/, colformat)
					.replace(/{offset}/, (document.getElementById("offset" + stopNum).value) + "%");
        }
    }

    var newSample = 'linear-gradient(' + direction;
    newSample += stops;
    newSample = newSample.slice(0, -2);
    newSample += ")";
    return newSample;
}

function radialgradient_w3c(inputPos, inputSize) {
	var position, x, y;

    if (inputPos == "top left") { position = 'at left top'; }
    if (inputPos == "top center") { position = 'at center top'; }
    if (inputPos == "top right") { position = 'at right top'; }
    if (inputPos == "middle left") { position = 'at left center'; }
    if (inputPos == "middle center") { position = 'at center'; }
    if (inputPos == "middle right") { position = 'at right center'; }
    if (inputPos == 'bottom left') { position = 'at left bottom'; }
    if (inputPos == "bottom center") { position = 'at center bottom'; }
    if (inputPos == "bottom right") { position = 'at right bottom'; }

    var nStops = nextStopCount;
    var stops = "";
    for (var n = 0; n < nStops; ++n) {
        var stopNum = (n < nStops - 1) ? n.toString() : "N";
        if (document.getElementById("offset" + stopNum) != null) {
        
        if (document.getElementById("format").value == "rgb") {
          colformat = "rgb(" + hexToRgb(document.getElementById("color" + stopNum).value) + ")";
        } else if (document.getElementById("format").value == "hex") {
          colformat = "#" + document.getElementById("color" + stopNum).value;
        } else if (document.getElementById("format").value == "rgba") {
          colformat = "rgba(" + hexToRgb(document.getElementById("color" + stopNum).value) + ",1)";
        }

            stops += '{color} {offset}, '
					.replace(/{color}/, colformat)
					.replace(/{offset}/, (document.getElementById("offset" + stopNum).value) + "%");
        }
    }

    dispInputSize = inputSize.toString().toLowerCase();

    var newSample = 'radial-gradient(' + shape + ' ' + dispInputSize + ' ' + position + ', ';
    newSample += stops;
    newSample = newSample.slice(0, -2);
    newSample += ")";
    return newSample;
}

function lineargradient_gecko(inputPos) {

    var angle, directionmoz;
    if (inputPos == "top left") { directionmoz = 'top left, '; }
    if (inputPos == "top") { directionmoz = 'top, '; }
    if (inputPos == "top right") { directionmoz = 'top right, '; }
    if (inputPos == "left") { directionmoz = 'left, '; }
    if (inputPos == "right") { directionmoz = 'right, '; }
    if (inputPos == 'bottom left') { directionmoz = 'bottom left, '; }
    if (inputPos == "bottom") { directionmoz = 'bottom, '; }
    if (inputPos == "bottom right") { directionmoz = 'bottom right, '; }

    var nStops = nextStopCount;
    var stops = "";
    for (var n = 0; n < nStops; ++n) {
        var stopNum = (n < nStops - 1) ? n.toString() : "N";
        if (document.getElementById("offset" + stopNum) != null) {

        if (document.getElementById("format").value == "rgb") {
          colformat = "rgb(" + hexToRgb(document.getElementById("color" + stopNum).value) + ")";
        } else if (document.getElementById("format").value == "hex") {
          colformat = "#" + document.getElementById("color" + stopNum).value;
        } else if (document.getElementById("format").value == "rgba") {
          colformat = "rgba(" + hexToRgb(document.getElementById("color" + stopNum).value) + ",1)";
        }

            stops += '{color} {offset}, '
					.replace(/{color}/, colformat)
					.replace(/{offset}/, (document.getElementById("offset" + stopNum).value) + "%");
        }
    }

    var newSample = '-moz-linear-gradient(' + directionmoz;
    newSample += stops;
    newSample = newSample.slice(0, -2);
    newSample += ")";
    return newSample;
}

function radialgradient_gecko(inputPos, inputSize) {
    var position, x, y;

    if (inputPos == "top left") { position = 'left top'; }
    if (inputPos == "top center") { position = 'center top'; }
    if (inputPos == "top right") { position = 'right top'; }
    if (inputPos == "middle left") { position = 'left center'; }
    if (inputPos == "middle center") { position = 'center'; }
    if (inputPos == "middle right") { position = 'right center'; }
    if (inputPos == 'bottom left') { position = 'left bottom'; }
    if (inputPos == "bottom center") { position = 'center bottom'; }
    if (inputPos == "bottom right") { position = 'right bottom'; }

    var nStops = nextStopCount;
    var stops = "";
    for (var n = 0; n < nStops; ++n) {
        var stopNum = (n < nStops - 1) ? n.toString() : "N";
        if (document.getElementById("offset" + stopNum) != null) {

        if (document.getElementById("format").value == "rgb") {
          colformat = "rgb(" + hexToRgb(document.getElementById("color" + stopNum).value) + ")";
        } else if (document.getElementById("format").value == "hex") {
          colformat = "#" + document.getElementById("color" + stopNum).value;
        } else if (document.getElementById("format").value == "rgba") {
          colformat = "rgba(" + hexToRgb(document.getElementById("color" + stopNum).value) + ",1)";
        }

            stops += '{color} {offset}, '
					.replace(/{color}/, colformat)
					.replace(/{offset}/, (document.getElementById("offset" + stopNum).value) + "%");
        }
    }

    dispInputSize = inputSize.toString().toLowerCase();

    var newSample = '-moz-radial-gradient(' + position + ', ' + shape + ' ' + dispInputSize + ', ';
    newSample += stops;
    newSample = newSample.slice(0, -2);
    newSample += ")";
    return newSample;
}

function lineargradient_webkit(inputPos) {
    var directionwebkit;
    if (inputPos == "top left") { directionwebkit = 'left top, right bottom, '; }
    if (inputPos == "top") { directionwebkit = 'left top, left bottom, '; }
    if (inputPos == "top right") { directionwebkit = 'right top, left bottom, '; }
    if (inputPos == "left") { directionwebkit = 'left top, right top, '; }
    if (inputPos == "right") { directionwebkit = 'right top, left top, '; }
    if (inputPos == 'bottom left') { directionwebkit = 'left bottom, right top, '; }
    if (inputPos == "bottom") { directionwebkit = 'left bottom, left top, '; }
    if (inputPos == "bottom right") { directionwebkit = 'right bottom, left top, '; }

    var nStops = nextStopCount;
    var stops = "";
    for (var n = 0; n < nStops; ++n) {
        var stopNum = (n < nStops - 1) ? n.toString() : "N";
        if (document.getElementById("offset" + stopNum) != null) {

        if (document.getElementById("format").value == "rgb") {
          colformat = "rgb(" + hexToRgb(document.getElementById("color" + stopNum).value) + ")";
        } else if (document.getElementById("format").value == "hex") {
          colformat = "#" + document.getElementById("color" + stopNum).value;
        } else if (document.getElementById("format").value == "rgba") {
          colformat = "rgba(" + hexToRgb(document.getElementById("color" + stopNum).value) + ",1)";
        }

            stops += 'color-stop({offset}, {color}), '
					.replace(/{color}/, colformat)
					.replace(/{offset}/, document.getElementById("offset" + stopNum).value);
        }
    }

    var newSample = '-webkit-gradient(linear, ' + directionwebkit;
    newSample += stops;
    newSample = newSample.slice(0, -2);
    newSample += ")";
    return newSample;
}


function radialgradient_webkit(inputPos, inputSize, inputWidth, inputHeight) {
    var position, posx, posy;

    if (inputPos == "top left") { position = 'left top'; posx = 0; posy = 0; }
    if (inputPos == "top center") { position = 'center top'; posx = 0.5; posy = 0; }
    if (inputPos == "top right") { position = 'right top'; posx = 1; posy = 0; }
    if (inputPos == "middle left") { position = 'left center'; posx = 0; posy = 0.5; }
    if (inputPos == "middle center") { position = 'center center'; posx = 0.5; posy = 0.5; }
    if (inputPos == "middle right") { position = 'right center'; posx = 1; posy = 0.5; }
    if (inputPos == 'bottom left') { position = 'left bottom'; posx = 0; posy = 1; }
    if (inputPos == "bottom center") { position = 'center bottom'; posx = 0.5; posy = 1; }
    if (inputPos == "bottom right") { position = 'right bottom'; posx = 1; posy = 1; }
    var nStops = nextStopCount;
    var stops = "";
    for (var n = 0; n < nStops; ++n) {
        var stopNum = (n < nStops - 1) ? n.toString() : "N";
        if (document.getElementById("offset" + stopNum) != null) {

        if (document.getElementById("format").value == "rgb") {
          colformat = "rgb(" + hexToRgb(document.getElementById("color" + stopNum).value) + ")";
        } else if (document.getElementById("format").value == "hex") {
          colformat = "#" + document.getElementById("color" + stopNum).value;
        } else if (document.getElementById("format").value == "rgba") {
          colformat = "rgba(" + hexToRgb(document.getElementById("color" + stopNum).value) + ",1)";
        }

            stops += 'color-stop({offset}, {color}), '
					.replace(/{color}/, colformat)
					.replace(/{offset}/, document.getElementById("offset" + stopNum).value);
        }
    }
	
    var dist = 0;

    switch (inputSize) {
        case 'closest-side':
            dist = Math.round(radialgradient_findMinDistanceToSides(inputWidth, inputHeight, posx * inputWidth, posy * inputHeight));
            break;
        case "closest-corner":
            dist = Math.round(radialgradient_findMinDistanceToCorners(inputWidth, inputHeight, posx * inputWidth, posy * inputHeight));
            break;
        case "farthest-side":
            dist = Math.round(radialgradient_findMaxDistanceToSides(inputWidth, inputHeight, posx * inputWidth, posy * inputHeight));
            break;
        case "farthest-corner":
            dist = Math.round(radialgradient_findMaxDistanceToCorners(inputWidth, inputHeight, posx * inputWidth, posy * inputHeight));
            break;
        case "contain":
            dist = Math.round(radialgradient_findMinDistanceToSides(inputWidth, inputHeight, posx * inputWidth, posy * inputHeight));
            break;
        case "cover":
            dist = Math.round(radialgradient_findMaxDistanceToCorners(inputWidth, inputHeight, posx * inputWidth, posy * inputHeight));
            break;
        default:
            alert("incorrect side when updating sample for webkit radial");
    }

    var newSample = '-webkit-gradient(radial, ' + position + ', 0, ' + position + ', ' + dist + ', ';
    newSample += stops;
    newSample = newSample.slice(0, -2);
    newSample += ")";
    return newSample;

}

function radialgradient_findMaxDistanceToCorners(w, h, x, y) {
    var theX = Math.max(x, w - x);
    var theY = Math.max(y, h - y);
    return Math.pow(Math.pow(theY, 2) + Math.pow(theX, 2), 0.5);
}
function radialgradient_findMinDistanceToCorners(w, h, x, y) {
    var theX = Math.min(x, w - x);
    var theY = Math.min(y, h - y);
    return Math.pow(Math.pow(theY, 2) + Math.pow(theX, 2), 0.5);
}
function radialgradient_findMaxDistanceToSides(w, h, x, y) {
    var theX = Math.max(x, w - x);
    var theY = Math.max(y, h - y);
    return Math.max(theX, theY);
}
function radialgradient_findMinDistanceToSides(w, h, x, y) {
    var theX = Math.min(x, w - x);
    var theY = Math.min(y, h - y);
    return Math.min(theX, theY);
}

// Helpful functions for Test Drive Demo
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
}
String.prototype.stripQuotes = function () {
    return this.replace(/"*"/g, '');
}
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

function repaint(input) {
    input.style.backgroundColor = "#" + input.value;
}

function RandomColor() {
    var s = "000000" + Random(0, 256 * 256 * 256).toString(16);
    s = s.substr(s.length - 6, 6);
    return s;
}
function Random(min, max) {
    return min + Math.floor(Math.random() * max);
}

function hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return r + "," + g + "," + b;
}