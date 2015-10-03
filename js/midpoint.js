var targetCanvas = "canvas";
var targetRadius = "radius";
var targetInterval = "interval";
var targetStep = "step";
var targetTable = "results"

var minRadius = 1;
var maxRadius = 270;

var originX;
var originY;

var side = 0;
var minSide = 1;

var drawTimer = undefined;
var minDrawTickLength = 25;
var maxDrawTickLength = 5000;

function init()
{
	var canvas = getCanvas(targetCanvas);
	originX = canvas.width / 2;
	originY = canvas.height / 2;
}

function addResult(target, step, D, x, y)
{
	var rowname = "result-" + step
	var stepname = "step-" + step
	var dname = "d-" + step
	var xname = "x-" + step
	var yname = "y-" + step
	
	row = $('<tr align="center" id=' + rowname + ' name=' + rowname + '>');
	row.append($('<td id="' + stepname + '" name="' + stepname + '">').text(step));
	row.append($('<td id="' + dname + '" name="' + dname + '">').text(D));
	row.append($('<td id="' + xname + '" name="' + xname + '">').text(x));
	row.append($('<td id="' + yname + '" name="' + yname + '">').text(y));

	$("#" + target).append(row);
}

function removeResult(step)
{
	$('#result-' + step).remove();
}

function reset(target, targetResults)
{
	stopDrawTimer();
	setStep(targetStep, 0);
	clearCanvas(target);
	clearResults(targetResults);
}

function getX(step)
{
	var xname = "x-" + step;
	return Math.floor($("#" + xname).text());
}

function getY(step)
{
	var yname = "y-" + step;
	return Math.floor($("#" + yname).text());
}

function getD(step)
{
	var dname = "d-" + step;
	return Math.floor($("#" + dname).text());
}

function getRadius(target)
{
	return Math.floor($("#" + target)[0].value);
}

function setRadius(target, value)
{
	return $("#" + target)[0].value = value;
}

function getDrawTickLength(target)
{
	return Math.floor($("#" + target)[0].value);
}

function setDrawTickLength(target, value)
{
	return $("#" + target)[0].value = value;
}

function getDrawTickLength(target)
{
	return Math.floor($("#" + target)[0].value);
}

function setDrawTickLength(target, value)
{
	return $("#" + target)[0].value = value;
}

function getStep(target)
{
	return Math.floor($("#" + target).text());
}

function setStep(target, value)
{
	$("#" + target).text(value);
}

function clearResults(target)
{
	$('#' + target + ' tbody').remove();
}

function translate(origin, jumps, side)
{
	return origin + jumps * side;
}

function radiusChange()
{
	// Get and validate radius
	var radius = getRadius(targetRadius);

	if (radius < minRadius)
		setRadius(targetRadius, minRadius)
	else if (radius > maxRadius)
		setRadius(targetRadius, maxRadius);

	// Reset values
	reset(targetCanvas, targetTable);

	// Calculate new side length
	var canvas = getCanvas(targetCanvas);
	var stepWidth = Math.floor(canvas.width / (radius + 2) / 2);
	var stepHeight = Math.floor(canvas.height / (radius + 2) / 2);

	if (stepWidth < stepHeight)
		side = stepWidth;
	else
		side = stepHeight;
	
	if (side <= minSide)
		side = minSide;
}

function intervalChange()
{
	// Get and validate interval
	var interval = getDrawTickLength(targetInterval);

	if (interval < minDrawTickLength)
		setDrawTickLength(targetInterval, minDrawTickLength);
	else if (interval > maxDrawTickLength)
		setDrawTickLength(targetInterval, maxDrawTickLength);

	// Reset values
	reset(targetCanvas, targetTable);
}

function getStepCoordinates(step, radius)
{
	// Important points
	var canvas = getCanvas(targetCanvas);
	var targetX = canvas.width / 2;
	var targetY = canvas.height / 2;
		
	// Set iteration values
	var x;
	var y;
	var D;
	if (step == 0)
	{
		x = getRadius(targetRadius);
		y = 0;
		D = 1 - x; 
	}
	else
	{
		x = getX(step);
		y = getY(step) + 1;
		D = getD(step);
	}
	
	// Calculate next coordinates
	// Y++
	if (D <= 0)
	{
		D += 2 * y + 1;
	}
	// Y++ X--
	else
	{
		x--;
		D += 2 * (y - x) + 1;
	}

	return {'x':x, 'y':y, 'D':D};
}

function stepIncrease(stopTimer)
{
	if (stopTimer)
		stopDrawTimer();

	var radius = getRadius(targetRadius);
	var step = getStep(targetStep);
	
	// Check for circular repetition
	var quadrant = getY(step) / getX(step);
	if (quadrant >= 1)
		return;
	
	// Get coords
	coords = getStepCoordinates(step, radius);

	// If coords are valid, proceed
	if (coords)
	{
		step++
		setStep(targetStep, step);
		// 8 Octants
		addPoint(targetCanvas, translate(originX, coords.x, side), translate(originY, coords.y, side), side);
		addPoint(targetCanvas, translate(originX, coords.y, side), translate(originY, coords.x, side), side);
		addPoint(targetCanvas, translate(originX, -coords.x, side), translate(originY, coords.y, side), side);
		addPoint(targetCanvas, translate(originX, -coords.y, side), translate(originY, coords.x, side), side);
		addPoint(targetCanvas, translate(originX, -coords.x, side), translate(originY, -coords.y, side), side);
		addPoint(targetCanvas, translate(originX, -coords.y, side), translate(originY, -coords.x, side), side);
		addPoint(targetCanvas, translate(originX, coords.x, side), translate(originY, -coords.y, side), side);
		addPoint(targetCanvas, translate(originX, coords.y, side), translate(originY, -coords.x, side), side);
		
		addResult(targetTable, step, coords.D, coords.x, coords.y);
		return true;
	}
	else return;
}

function stepDecrease(stopTimer)
{
	if (stopTimer)
		stopDrawTimer();

	var radius = getRadius(targetRadius);
	var step = getStep(targetStep);
	if (step <= 0)
	{
		step = 0;
		return;
	}
	
	step--;
	coords = getStepCoordinates(step, radius);

	if (coords)
	{
		removeResult(step + 1);
		setStep(targetStep, step);
		// 8 Octants
		addPoint(targetCanvas, translate(originX, coords.x, side), translate(originY, coords.y, side), side + 1, true);
		addPoint(targetCanvas, translate(originX, coords.y, side), translate(originY, coords.x, side), side + 1, true);
		addPoint(targetCanvas, translate(originX, -coords.x, side), translate(originY, coords.y, side), side + 1, true);
		addPoint(targetCanvas, translate(originX, -coords.y, side), translate(originY, coords.x, side), side + 1, true);
		addPoint(targetCanvas, translate(originX, -coords.x, side), translate(originY, -coords.y, side), side + 1, true);
		addPoint(targetCanvas, translate(originX, -coords.y, side), translate(originY, -coords.x, side), side + 1, true);
		addPoint(targetCanvas, translate(originX, coords.x, side), translate(originY, -coords.y, side), side + 1, true);
		addPoint(targetCanvas, translate(originX, coords.y, side), translate(originY, -coords.x, side), side + 1, true);
		return true;
	}
	else return;
}

function stopDrawTimer()
{
	if (drawTimer)
	{		
		clearInterval(drawTimer);
		drawTimer = undefined;
	}
}

function startDrawTimer()
{
	if (drawTimer == undefined)
	{
		drawTimer = setInterval(drawTick, getDrawTickLength(targetInterval));
	}
}

function drawTick()
{
	if (!stepIncrease())
	{
		stopDrawTimer();
	}
}