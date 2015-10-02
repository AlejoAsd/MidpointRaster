var targetCanvas = "canvas";
var targetRadius = "radius";
var targetStep = "step";

var minRadius = 3;
var maxRadius = 100;

var side = 0;

var drawTimer = undefined;
var drawTickLength = 250;

function reset(target)
{
	setStep(0);
	clearCanvas(target);
}

function getRadius()
{
	return Math.floor($("#" + targetRadius)[0].value);
}

function setRadius(value)
{
	return $("#" + targetRadius)[0].value = value;
}

function getStep()
{
	return Math.floor($("#" + targetStep).text());
}

function setStep(value)
{
	$("#" + targetStep).text(value);
}

function radiusChange()
{
	// Get and validate radius
	var radius = getRadius();

	if (radius < minRadius)
		setRadius(minRadius)
	else if (radius > maxRadius)
		setRadius(maxRadius);

	// Reset values
	reset(targetCanvas);

	// Calculate new side length
	var canvas = getCanvas(targetCanvas);
	var stepWidth = Math.floor(canvas.width / radius / 2);
	var stepHeight = Math.floor(canvas.height / radius / 2);

	if (stepWidth < stepHeight)
		side = stepWidth;
	else
		side = stepHeight;
}

function getStepCoordinates(step, radius)
{	
	var quadrant = Math.floor((1 + step) / radius);

	// Check for circular repetition
	if (quadrant >= 4)
		return;

	var x = step * side;
	var y = step * side;

	return {'x':x, 'y':y};
}

function stepIncrease(stopTimer)
{
	if (stopTimer)
		stopDrawTimer();

	var radius = getRadius();
	var step = getStep();
	
	// Get coords
	coords = getStepCoordinates(step, radius);

	// If coords are valid, proceed
	if (coords)
	{
		step++
		setStep(step);
		addPoint(targetCanvas, coords.x, coords.y, side);
		return true;
	}
	else return;
}

function stepDecrease(stopTimer)
{
	if (stopTimer)
		stopDrawTimer();

	var radius = getRadius();
	var step = getStep();
	if (step <= 0)
	{
		step = 0;
		return;
	}
	
	step--;
	coords = getStepCoordinates(step, radius);

	if (coords)
	{
		setStep(step);
		addPoint(targetCanvas, coords.x, coords.y, side+1, true);
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
		reset(targetCanvas);
		drawTimer = setInterval(drawTick, drawTickLength);
	}
}

function drawTick()
{
	if (!stepIncrease())
	{
		stopDrawTimer();
	}
}