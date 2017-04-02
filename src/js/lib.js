function createSphereGeometry (latitudeBands, longitudeBands, radius, noIndices) 
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
			u= longNumber/longitudeBands;
			v= latNumber/latitudeBands;

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


	if (noIndices){

				// data uravuju tak, aby to tak funkce prelouskala
				textures.itemSize = 2;
				normals.itemSize = 3;
				vertices.itemSize = 3;

				var data = {
					textures : {
						itemSize: 2,
						array: textures
					} ,
					indices : {
						array: indices
					} ,
					normals : {
						itemSize: 3,
						array: normals
					} ,
					position : {
						itemSize: 3,
						array: vertices
					} 
				};

				var data2 = {

				};
		 
				// TOHLE JE FUNKCE Z THREE.JS, udela to to, ze to prepocita indexy na vrcholy, k tomu to prepocita i dalsi veci jako textury apod
				//var indices = indices;
				var attributes = data;
				for ( var name in attributes ) {

					var attribute = attributes[ name ];

	 				var array = attribute.array;

					var itemSize = attribute.itemSize;
					var array2 = initArray(  indices.length * itemSize );
					var index = 0, index2 = 0;

					for ( var i = 0, l = indices.length ; i < l; i ++ ) {

						index = indices[ i ] * itemSize;

	 					for ( var j = 0; j < itemSize; j ++ ) {

							array2[ index2 ++ ] = array[ index ++ ];

						}

					}
					data2 [name] = {array : array2, itemSize : itemSize};
	 				//geometry2.addAttribute( name, new BufferAttribute( array2, itemSize ) );
	 
				}
		 
				textures = data2.textures.array;
				vertices = data2.position.array;
				normals = data2.normals.array;


				// Zde se provadi korekce
				/*for ( var i = 0, l = normals.length / 3; i < l; i ++ ) {

					var x = normals[ i * 3 + 0 ];
					var z = normals[ i * 3 + 1 ];
					var y = normals[ i * 3 + 2 ];

					if ( i < l / 2 ) {
						var correction = ( x == 0 && z == 0 ) ? 1 : ( Math.acos( y ) / Math.sqrt( x * x + z * z ) ) * ( 2 / Math.PI );
						textures[ i * 2 + 0 ]  = x*( 404 / 1920 )*correction + ( 447 / 1920 ) ;   //  x * ( 404 / 1920 )*correction  + ( 447 / 1920 ) ;
						textures[ i * 2 + 1 ] = z  * ( 404 / 1080 )*correction  + ( 520 / 1080 ) ; // z * ( 404 / 1080 )*correction   + ( 582 / 1080 ) ;

					} else {
						var correction = ( x == 0 && z == 0 ) ? 1 : ( Math.acos( - y ) / Math.sqrt( x * x + z * z ) ) * ( 2 / Math.PI );
						textures[ i * 2 + 0 ] =   -x * ( 404 / 1920 )*correction   + ( 1470 / 1920 ) ;
						textures[ i * 2 + 1 ] =  z * ( 404 / 1080 )*correction   + ( 520 / 1080 ) ;


					}

				}*/
	}

 

	return {
		vertices: new Float32Array(vertices),
		textures: new Float32Array(textures),
		normals: new Float32Array(normals),
		indices: new Uint16Array(indices),
		noIndices: noIndices,
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

// warn method
function w(object) {
    console.log("------------------- WARN STARTS-------------------");
    console.warn(object);
    console.log("___________________ WARN ENDS ____________________");
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


function Mat4rotateX(mat, angle)
{
	var cos_angle = Math.cos(angle);
	var sin_angle = Math.cos(angle);

	var tmp = mat;
	var out = [];
	mat[5]  = mat[5] + mat[5]*cos_angle;
	mat[6]  = mat[6]+mat[6]*(-sin_angle);
	mat[9]  = mat[9]+mat[9]*sin_angle;
	mat[10] =  mat[10]+mat[10]*cos_angle;


	if (mat.constructor === Float32Array) {
		return mat;
	}
	else {
		return new Float32Array(mat);
	}

}



function logger(msg) {

	var div = document.getElementById("logger");
	if (!div) {
		var div = document.createElement('div');
		div.setAttribute('id', 'logger');
		div.style.width = '300px';
		div.style.height = '500px';
		div.style.position = 'absolute';
		div.style.overflow = 'scroll';
		div.style.top = '0px';
		var body = document.getElementById("body");
		if (!body) {
			console.warn('Neexistuje TAG <BODY> s ID body, nutne pro logger!');
		}
		else {
			body.append(div);
		}
	}
	div.innerHTML +=   '<span style="color: #2f0; font-size:12px"><span style="color: white">LOG:</span> '+(msg)+'</span><br />'  ;
}


// vsechny hodnoty josu zadavyn v pixelech
function fishEye(x_postion_of_middle, y_postion_of_middle, x_postion_of_fisheye_begin, img_width, img_height) {
	var horizontal_pixel = 1/img_width;
	var vertical_pixel = 1/img_height;

	// zde zjistuju, z kterej strany kruhu tu hdontou beru a vracim prumer kriuznice jako: r
	if (x_postion_of_middle > x_postion_of_fisheye_begin) {
		var r = (x_postion_of_middle - x_postion_of_fisheye_begin) * horizontal_pixel; 
	}
	else if (x_postion_of_middle < x_postion_of_fisheye_begin){
		var r = (x_postion_of_fisheye_begin - x_postion_of_middle) * horizontal_pixel;
	}
	else {
		console.warn('Hodnoty se nemohou rovnat');
	}

	var d = 2*r; // prumer kruznice


	return {
		r: r,
		d: d,
		o: 2*Math.PI*r,
		s: Math.PI*r*r,
	};	

}


function initArray( length) {
	var array = [];
	for (var i = 0; i < length; i++) {
		array[i] = 0;
	};
	return array;
}

function createVideo( src ) {
	if (!checkIfFileExists(src)) {
		w('Zdrojove video neexistuje');
		return false;
	}
    var video = document.createElement( 'video' );
    video.loop = true;
    video.muted = true;
    video.autoplay = false;
    video.src = src;
    video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
	video.load();
	return video;
}

