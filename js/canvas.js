function getCanvas(target)
{
	return document.getElementById(target);
}

function getCanvasContext(target)
{
	return getCanvas(target).getContext("2d");	
}

function clearCanvas(target)
{
	var canvas = getCanvas(target);
	var context = getCanvasContext(target);

	context.clearRect(0, 0, canvas.width, canvas.height);
}

function addPoint(target, x, y, side, clear)
{
	var canvas = getCanvas(target);
	var context = getCanvasContext(target);

	x = x - side / 2;
	y = y - side / 2;

	// If clearing, erase the point
	if (clear)
	{
		context.clearRect(x, y, side, side);
	}
	else
	{
		context.fillStyle = "#000000";
		context.fillRect(x, y, side, side);
	}
}