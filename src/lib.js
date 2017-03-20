function createSphereGeometry (latitudeBands, longitudeBands, radius) 
{
	var vertices = [];
	var textures = [];
	var normals = [];
	var indices = [];

	var rad = 180/Math.PI;

	var sin = function (angle) {
		return Math.sin(angle);  
	}

	var cos = function (angle) {
		return Math.cos(angle);  
	}

	var latitudeAngle =  Math.PI / latitudeBands;         // 0°-180°
	var longitudeAngle =  2 * Math.PI / longitudeBands;  //  0°-360°

	for (var latNumber = 0; latNumber <= latitudeBands; ++latNumber) {
		var theta = latNumber * latitudeAngle;

		for (var longNumber = 0; longNumber <= longitudeBands; ++ longNumber) {

			var phi = longNumber * longitudeAngle;

			// vrcholy
			var x = sin(theta) * cos(phi) * radius;
			var y = sin(phi) * sin(theta) * radius;
			var z = cos(theta) * radius;

			// normaly
			var normals_x = x/radius;
			var normals_y = y/radius;
			var normals_z = z/radius;

			// textury
			var u =    (longNumber / longitudeBands);
			var v =      -(latNumber / latitudeBands);

			// pridame vrcholy
			vertices.push(x);
			vertices.push(y);
			vertices.push(z);

			// pridame normaly (vektory)
			normals.push(normals_x);
			normals.push(normals_y);
			normals.push(normals_z);

			// koordiunace textury
			textures.push(u);
			textures.push(v);

			// zde zpracovavam index data
			if (latNumber  < latitudeBands && longNumber <  longitudeBands) 
			{
				var first = (latNumber * (longitudeBands + 1)) + longNumber;
				var second = first + longitudeBands + 1;
				indices.push(first);
				indices.push(second);
				indices.push(first + 1);

				indices.push(second);
				indices.push(second + 1);
				indices.push(first + 1);
			}

		}

	}

	return {
		vertices: new Float32Array(vertices),
		textures: new Float32Array(textures),
		normals: new Float32Array(normals),
		indices: new Uint16Array(indices),
	};
};


// vrat hodnotu parametru v adrese, napr: index.html?get_key=value
// vraci 'value'
function getParamByKey(get_key) {
  var address = window.location.href ;
  var pair = [];
  address = address.substring(address.indexOf("?")+1).split("&");
  for (var i =0; i < address.length; i++) 
  {
  	pair = address[i].split("=");
  	if (get_key == pair[0]) 
  	{
  		return pair[1];
  	}
  }
  return false;
 }

// debug method
function d(object) {
    console.log("------------------- DEBUG STARTS-------------------");
    console.log(object);
    console.log("___________________ DEBUG ENDS ____________________");
}

// checking if file exists by JS and XHR
// OK
function checkIfFileExists(url)
{
    var http = new XMLHttpRequest();
    var img = new Image();
    http.open('HEAD', url, false);
    http.send();
    img.src = url;

    if (http.status!=404 || img.height != 0) {
        return true;
    }
    else {
        return false;
    }
}
/*

HAVE_NOTHING		0	No information is available about the media resource.
HAVE_METADATA		1	Enough of the media resource has been retrieved that the metadata attributes are initialized. Seeking will no longer raise an exception.
HAVE_CURRENT_DATA	2	Data is available for the current playback position, but not enough to actually play more than one frame.
HAVE_FUTURE_DATA	3	Data for the current playback position as well as for at least a little bit of time into the future is available (in other words, at least two frames of video, for example).
HAVE_ENOUGH_DATA	4	Enough data is available—and the download rate is high enough—that the media can be played through to the end without interruption.



*/

function videoReady(video) {
	if ( video.readyState >= video.HAVE_CURRENT_DATA ) 
	{
		return true;
	}
	return false;
}

function createIdentityMatrix3()
{
	return [
		1,0,0,
		0,1,0,
		0,0,1
	];
}

function createIdentityMatrix4()
{
	return [
		1,0,0,0,
		0,1,0,0,
		0,0,1,0,
		0,0,0,1
	];
}