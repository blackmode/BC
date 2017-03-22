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


	var resolution_width = 1920;
	var resolution_height = 1080;

	var fisheye_1_x_begin = 17;
	var fisheye_1_x_end = 921;
	var fisheye_1_y_begin = 134;
	var fisheye_1_y_end = 1053;

	var fisheye_2_x_begin = 960;
	var fisheye_2_x_end = 1861;
	var fisheye_2_y_begin = 133;
	var fisheye_2_y_end = 1063;

	var latitude_width = resolution_height/latitudeBands ;
	var longitude_width = resolution_width/longitudeBands;

	var checkCursor = function (latNumber,longNumber) {
		var sirka_poledniku = longNumber*longitude_width;
		var sirka_rovnobezky = latNumber*latitude_width;
		if (((sirka_poledniku>=fisheye_1_x_begin && sirka_poledniku<=fisheye_1_x_end)|| (sirka_poledniku>=fisheye_2_x_begin && sirka_poledniku<=fisheye_2_x_end)))   {
			if (((sirka_rovnobezky>=fisheye_1_y_begin && sirka_rovnobezky<=fisheye_1_y_end)|| (sirka_rovnobezky>=fisheye_2_y_begin && sirka_rovnobezky<=fisheye_2_y_end)))   {
 				return {
					u: longNumber/longitudeBands,
					v: latNumber/latitudeBands,
				}; 
			}
		}
		else {
			if (((sirka_poledniku>=fisheye_1_x_begin && sirka_poledniku<=fisheye_1_x_end)|| (sirka_poledniku>=fisheye_2_x_begin && sirka_poledniku<=fisheye_2_x_end)))   {
				if (((sirka_rovnobezky>=0 && sirka_rovnobezky<=fisheye_1_y_begin)|| (sirka_rovnobezky>=0 && sirka_rovnobezky<=fisheye_2_y_begin)))   {
 					return {
						u: longNumber/longitudeBands,
						v: (fisheye_1_y_begin/sirka_rovnobezky)/latitudeBands,
					}; 
				}
			}
		}
console.log('sirka_poledniku: '+sirka_poledniku);
console.log(sirka_rovnobezky);
				return {
					u: longNumber/longitudeBands,
					v: latNumber/latitudeBands,
				}; 

	}

	var latitudeAngle =  Math.PI / latitudeBands;         // 0°-180°
	var longitudeAngle =  2 * Math.PI / longitudeBands;  //  0°-360°

	for (var latNumber = 0; latNumber <= latitudeBands; ++latNumber) {	// zde ukazuje na ktere jsme rovnobezce
		var theta = latNumber * latitudeAngle;



		for (var longNumber = 0; longNumber <= longitudeBands; ++ longNumber) {// zde ukazuje na kterym jsme poledniku

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
			var CUR = checkCursor  (latNumber , longNumber);
			var u =  CUR.u;
			var v =     CUR.v;

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
			/*if (latNumber  < latitudeBands || longNumber <  longitudeBands) 
			{
				var first = (latNumber * (longitudeBands + 1)) + longNumber;
				var second = first + longitudeBands + 1;
				indices.push(first);
				indices.push(second);
				indices.push(first + 1);

				indices.push(second);
				indices.push(second + 1);
				indices.push(first + 1);
			}*/

		}

	}

 


    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {
      for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {
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

	return {
		vertices: new Float32Array(vertices),
		textures: new Float32Array(textures),
		normals: new Float32Array(normals),
		indices: new Uint16Array(indices),
	};
};

function createCubeGeometry () 
{
	var vertices = [];
	var textures = [];
	var normals = [];
	var indices = [];

		// x,y,z
        var vertices = [
        // Front face
        -1,  1,  1,  //	
         1,  1,  1,  
         1, -1,  1, 
        -1, -1,  1,

         // Back face
        -1,  1,  -1,  
         1,  1,  -1,  
         1, -1,  -1, 
        -1, -1,  -1,

         // Up face
         1,  1,  1,  
         1,  1,  -1,  
         -1,  1, -1, 
         -1,  1, 1, 

         // Down face
         1,  -1,  1,  
         1,  -1,  -1,  
         -1,  -1, -1, 
         -1,  -1, 1, 

          // Left face
          -1,  1,  1, 
          -1,  1, -1, 
          -1,  -1, -1,
          -1,  -1, 1,

          // Right face
          1,  1,  1, 
          1,  1, -1, 
          1,  -1, -1,
          1,  -1, 1
        ];

		var textures = [
			// Front
			0,  0,
			1,  0,
			1,  1,
			0,  1,
			// Back
			0,  0,
			1,  0,
			1,  1,
			0,  1,
			// Top
			0,  0,
			1,  0,
			1,  1,
			0,  1,
			// Bottom
			0,  0,
			1,  0,
			1,  1,
			0,  1,
			// Left
			0,  0,
			1,  0,
			1,  1,
			0,  1,
			// right
			0,  0,
			1,  0,
			1,  1,
			0,  1
		];

		// x,y,z
        var normals = [
		    // Front
		     0,  0,  1,
		     0,  0,  1,
		     0,  0,  1,
		     0,  0,  1,

		    // Back
		     0,  0, -1,
		     0,  0, -1,
		     0,  0, -1,
		     0,  0, -1,

		    // Top
		     0,  1,  0,
		     0,  1,  0,
		     0,  1,  0,
		     0,  1,  0,

		    // Bottom
		     0, -1,  0,
		     0, -1,  0,
		     0, -1,  0,
		     0, -1,  0,

		    // Left
		    -1,  0,  0,
		    -1,  0,  0,
		    -1,  0,  0,
		    -1,  0,  0,

		    // Right
		     1,  0,  0,
		     1,  0,  0,
		     1,  0,  0,
		     1,  0,  0
        ];

var indices = [



];



	return {
		vertices: new Float32Array(vertices),
		textures: new Float32Array(textures),
		normals: new Float32Array(normals),
		indices: new Uint16Array(indices),
	};
}


function create2DGeometry () 
{
	var vertices = [];
	var textures = [];
	var normals = [];
	var indices = [];

		// x,y,z
        var vertices = [
		  -1.0, -1.0,
		  1.0, -1.0,
		  1.0,  1.0,
		  -1.0,  1.0
        ];

		var textures = [
		    0.0,  0.0,
		    1.0,  0.0,
		    1.0,  1.0,
		    0.0,  1.0
		];

		// x,y,z
        var normals = [

        ];

		var indices = [
		  0,  1,  2,      0,  2,  3
		];



	return {
		vertices: new Float32Array(vertices),
		textures: new Float32Array(textures),
		normals: new Float32Array(normals),
		indices: new Uint16Array(indices),
	};
}

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