
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////  TVORBA GEOMETRIE    ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createSphereGeometry (latitudeBands, longitudeBands, radius, noIndices) 
{
	var vertices = [];
	var textures = [];
	var normals = [];
	var indices = [];
	var hypotenuse_normal = []; // prepona K
	var hypotenuse = []; // prepona K

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
			
			// prepona
			var K = sin(theta) * radius;

			// normaly
			var normals_x = x/radius;
			var normals_y = y/radius;
			var normals_z = z/radius;

			// textury
			u= 1-longNumber/longitudeBands;
			v=  latNumber/latitudeBands;

			// pomocna prepona
			hypotenuse.push(K);
			hypotenuse_normal.push(K/radius);

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
			
		}

	}

 

    for (var latNumber = 0; latNumber < latitudeBands; latNumber++) {// zde ukazuje na ktere jsme rovnobezce
      for (var longNumber = 0; longNumber < longitudeBands; longNumber++) {// zde ukazuje na kterym jsme poledniku

        var firstHorizontLine = (latNumber * (longitudeBands + 1)) + longNumber;
        var secondHorizontLine = firstHorizontLine + longitudeBands + 1;

        // A--------B
        // | \      |
        // |   \    |
        // |     \  |
        // |       \| 
        // D--------C

        var pointA = firstHorizontLine;
        var pointB = firstHorizontLine + 1;
        var pointC = secondHorizontLine +1;
        var pointD = secondHorizontLine;

        indices.push(pointA, pointB, pointC);
        indices.push(pointA, pointD, pointC);
 
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
						arrayName: textures
					} ,
					indices : {
						arrayName: indices
					} ,
					normals : {
						itemSize: 3,
						arrayName: normals
					} ,
					position : {
						itemSize: 3,
						arrayName: vertices
					} 
				};

				var data2 = {

				};
		 
				// udela to, ze to prepocita indexy na vrcholy, k tomu to prepocita i dalsi veci jako textury apod
				//var indices = indices;
				var attributes = data;
				for ( var name in attributes ) {

					var attribute = attributes[ name ];

	 				var arrayName = attribute.arrayName;

					var itemSize = attribute.itemSize;
					var number_of_indices = indices.length;

					var array2 = initArray(  number_of_indices * itemSize );
					var index = 0;
					var index2 = 0;

					for ( var i = 0; i < number_of_indices; i ++ ) {

						index = indices[ i ] * itemSize;

	 					for ( var j = 0; j < itemSize; j ++ ) {

							array2[ index2 ++ ] = arrayName[ index ++ ];

						}
					}
					data2 [name] = {arrayName : array2, itemSize : itemSize};
	 
				}
		 



				textures = data2.textures.arrayName;
				vertices = data2.position.arrayName;
				normals = data2.normals.arrayName;


				// Zde se provadi korekce
				// http://localhost/BC/theta/theta61.html?time=14.85&angleX=1.0&camera=-4.0&correction=true&angleZ=0.0
				for ( var i = 0, l = normals.length / 3; i < l; i ++ ) {
					var x = normals[ i * 3 + 0 ];
					var z = normals[ i * 3 + 1 ];
					var y = normals[ i * 3 + 2 ];
					var r = Math.sqrt( x * x + z * z );

					if ( i < l / 2 ) { // LEVA HEMISFERA  v angleX=0
						// nasobenim / delenim se to zvetsuje/zmensuje
						//var correction = ( x == 0 && z == 0 ) ? 1 : ( Math.acos( y ) / Math.sqrt( x * x + z * z ) ) * ( 2 / Math.PI );
						if (x == 0 && z == 0 ) {
							correction = 1.0;
						}
						else {
							correction =   Math.acos( y ) / r   ;
						}

						// DEBUG===============
						if (getParamByKey("correction") == 'false')   
							correction = 1.0;

						textures[ i * 2 + 0 ]  = x*( 270.6 / 1920 ) *correction + ( 475.8 / 1920 )  ;   //  x * ( 404 / 1920 )*correction  + ( 447 / 1920 ) ;
						textures[ i * 2 + 1 ] = z  * ( 270.6  / 1080 ) *correction  + ( 480.04 / 1080 ) ; // z * ( 404 / 1080 )*correction   + ( 582 / 1080 ) ; // posun po X sove ose, tedy : --------- x
					
						if (0) {
						textures[ i * 2 + 0 ]  = 0;
						textures[ i * 2 + 1 ]  = 0;
						}
					}
					else { // PRAVA HEMISFERA angleX=0


						if (x == 0 && z == 0 ) {
							correction = 1.0;
						}
						else {
							correction =   Math.acos( -y ) / r   ;
						}


						// DEBUG===================
						if (getParamByKey("correction") == 'false')   
							correction = 1.0;

						// NASOBENI: cim mensi koef, tim je obraz vetsi a bliz
						// pohyb po vertikalni ose: Y |
						textures[ i * 2 + 0 ] =   -x * ( 270.1496004 / 1920 ) *correction      + ( 1441.2 / 1920 );
						// pohyb po horizontalni ose: X -----------
						textures[ i * 2 + 1 ] =   z * ( 266.2343888 / 1080 ) *correction  + ( 480.296 / 1080 )  ;
 
					}
				}

	}

 

	return {
		vertices: new Float32Array(vertices),
		textures: new Float32Array(textures),
		normals: new Float32Array(normals),
		hypotenuse: new Float32Array(hypotenuse),
		hypotenuse_normal: new Float32Array(hypotenuse_normal),
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
// degrees to radians
function degToRad(degrees) { 
	return parseFloat(degrees * (Math.PI / 180.0));
}

//radians  to degrees   
function radToDeg(rads) { 
	return parseFloat(rads * (  180.0/Math.PI));
}

// prevody souradnic
function polarToCartesian(xPostionOfCenter, xPositionOfCenter, radius, degreesAngle) {
  var angleShift = 180; //posun vuci puvodni pozici
  var angleInRadians = degToRad(degreesAngle-angleShift);

  // x = r * cos (theta);
  var x = xPostionOfCenter + (radius * Math.cos(angleInRadians));
  // y = r * sin (theta);
  var y = xPositionOfCenter + (radius * Math.sin(angleInRadians));

  return {
    x: x,
    y: y
  };
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////  PROGRAMOVE FUNKCE    ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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

// ERROR method
function e(object) {
    console.log("------------------- ERROR STARTS-------------------");
    console.error(object);
    console.log("___________________ ERROR ENDS ____________________");
}

// log
function log(object) {
	console.log(object);
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
    video.loop = false;
    video.muted = false;
    video.autoplay = false;
    video.preload = 'auto';
    //video.poster = '../img/icon_play.png';
    video.src = src;
    video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
	//video.load();
	return video;
}




function imgLoaded(img_object) {
	if (!img_object.complete || img_object.naturalWidth  == 0) {
		return false;
	}
	else {
		return true;
	}
}



function createImage( src ) {
	if (!checkIfFileExists(src)) {
		w('Zdrojovy obrazek neexistuje');
		return false;
	}
    var image =  new Image();
    image.src = src;
    image.crossOrigin = "anonymous";
	return image;
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////  MATICOVÉ OPERACE    ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

function createPerspectiveMatrix  (fieldOfViewInRadians, aspectRatio, near, far) {
    var f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
 
    return [
      f / aspectRatio, 0,                             0,   0,
      0,               f,                          	  0,   0,
      0,               0,	(near + far) / (near - far),  -1,
      0,               0,	(near*far*2) / (near - far),   0
    ];
  }

function rotateX(matrix, angle) {
	var c = Math.cos(angle);
	var s = Math.sin(angle);
	// smer otaceni
	var direction = -1;

	// zalohovani hodnot
	var m1_tmp = matrix[1];
	var m5_tmp = matrix[5]; 
	var m9_tmp = matrix[9];
	
	// vynasobeni puvodni matice M rotacni matici RotX, tedy (M x RotX)
	matrix[1] = matrix[1]*c + matrix[2]*s  * direction;
	matrix[5] = matrix[5]*c + matrix[6]*s  * direction;
	matrix[9] = matrix[9]*c + matrix[10]*s * direction;

	matrix[2] = 	matrix[2] *c - m1_tmp*s * direction;
	matrix[6] = 	matrix[6] *c - m5_tmp*s * direction;
	matrix[10] = matrix[10]*c - m9_tmp*s * direction;

	if (matrix.constructor === Float32Array) {
		return matrix;
	}
	else {
		return new Float32Array(matrix);
	}
}


function rotateY(matrix, angle) {
	var c = Math.cos(angle);
	var s = Math.sin(angle);

	// smer otaceni
	var direction = 1;

	// zalohovani hodnot
	var m0_tmp = matrix[0];
	var m4_tmp = matrix[4];
	var m8_tmp = matrix[8];
	
	// vynasobeni puvodni matice M rotacni matici RotX, tedy (M x RotX)
	matrix[0] = c*matrix[0] - s*matrix[2]*direction;
	matrix[4] = c*matrix[4] - s*matrix[6]*direction;
	matrix[8] = c*matrix[8] - s*matrix[10]*direction;

	matrix[2] = c*matrix[2] + s*m0_tmp*direction;
	matrix[6] = c*matrix[6] + s*m4_tmp*direction;
	matrix[10] = c*matrix[10] + s*m8_tmp*direction;

	if (matrix.constructor === Float32Array) {
		return matrix;
	}
	else {
		return new Float32Array(matrix);
	}

	/*
		return m=[
			(c*m[0] + s*m[2]*direction), m[1], (c*m[2] - s*m0_tmp*direction), m[3],
			(c*m[4] + s*m[6]*direction), m[5], (c*m[6] - s*m4_tmp*direction), m[7],
			(c*m[8] + s*m[10]*direction), m[9], (c*m[10] - s*m8_tmp*direction), m[11],
			m[12], 	m[13], m[14], m[15]
		];
	*/
}


 function rotateZ(matrix, angle) {
	// smer otaceni
	var direction = 1;

    var c = Math.cos(angle);
    var s = Math.sin(angle);

    var m0_tmp = matrix[0];
    var m4_tmp = matrix[4];
    var m8_tmp = matrix[8]; 
		
    matrix[0] = c*matrix[0] + s*matrix[1]*direction;
    matrix[4] = c*matrix[4] + s*matrix[5]*direction;
    matrix[8] = c*matrix[8] + s*matrix[9]*direction;
    
    matrix[1] = c*matrix[1] - s*m0_tmp*direction;
    matrix[5] = c*matrix[5] - s*m4_tmp*direction;
    matrix[9] = c*matrix[9] - s*m8_tmp*direction;

	if (matrix.constructor === Float32Array) {
		return matrix;
	}
	else {
		return new Float32Array(matrix);
	}
 }


function multiply(matrix, b, a) {

	var tempB = b;
	var tempA = a;
	matrix[0]  = tempB[0]*tempA[0]  +  tempB[1]*tempA[4]  +  tempB[2]*tempA[8]  +  tempB[3]*tempA[12];
	matrix[1]  = tempB[0]*tempA[1]  +  tempB[1]*tempA[5]  +  tempB[2]*tempA[9]  +  tempB[3]*tempA[13];
	matrix[2]  = tempB[0]*tempA[2]  +  tempB[1]*tempA[6]  +  tempB[2]*tempA[10] +  tempB[3]*tempA[14];
	matrix[3]  = tempB[0]*tempA[3]  +  tempB[1]*tempA[7]  +  tempB[2]*tempA[11] +  tempB[3]*tempA[15];

	matrix[4]  = tempB[4]*tempA[0]  +  tempB[5]*tempA[4]  +  tempB[6]*tempA[8]   +  tempB[7]*tempA[12];
	matrix[5]  = tempB[4]*tempA[1]  +  tempB[5]*tempA[5]  +  tempB[6]*tempA[9]   +  tempB[7]*tempA[13];
	matrix[6]  = tempB[4]*tempA[2]  +  tempB[5]*tempA[6]  +  tempB[6]*tempA[10]  +  tempB[7]*tempA[14];
	matrix[7]  = tempB[4]*tempA[3]  +  tempB[5]*tempA[7]  +  tempB[6]*tempA[11]  +  tempB[7]*tempA[15];

	matrix[8]  = tempB[8]*tempA[0]  +  tempB[9]*tempA[4]  +  tempB[10]*tempA[8] +  tempB[11]*tempA[12];
	matrix[9]  = tempB[8]*tempA[1]  +  tempB[9]*tempA[5]  +  tempB[10]*tempA[9] +  tempB[11]*tempA[13];
	matrix[10] = tempB[8]*tempA[2]  +  tempB[9]*tempA[6]  +  tempB[10]*tempA[10] +  tempB[11]*tempA[14];
	matrix[11] = tempB[8]*tempA[3]  +  tempB[9]*tempA[7]  +  tempB[10]*tempA[11] +  tempB[11]*tempA[15];

	matrix[12]  = tempB[12]*tempA[0]  +  tempB[13]*tempA[4]  +  tempB[14]*tempA[8] +  tempB[15]*tempA[12];
	matrix[13]  = tempB[12]*tempA[1]  +  tempB[13]*tempA[5]  +  tempB[14]*tempA[9] +  tempB[15]*tempA[13];
	matrix[14] = tempB[12]*tempA[2]  +  tempB[13]*tempA[6]  +  tempB[14]*tempA[10] +  tempB[15]*tempA[14];
	matrix[15] = tempB[12]*tempA[3]  +  tempB[13]*tempA[7]  +  tempB[14]*tempA[11] +  tempB[15]*tempA[15];


	if (matrix.constructor === Float32Array) {
		return matrix;
	}
	else {
		return new Float32Array(matrix);
	}
}


function scaleMatrix(x,y,z) {
	return [
		x, 0, 0, 0,
		0, y, 0, 0,
		0, 0, z, 0,
		0, 0, 0, 1
	];
}



function translateMatrix(x,y,z) {
	return [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		x, y, z, 1
	];
}

function scale(matrix, x,y,z) {
	var s = scaleMatrix(x,y,z);
	return multiply(matrix, matrix, s);
}


function translate(matrix, x,y,z) {
	var s = translateMatrix(x,y,z);
	return multiply(matrix, matrix, s);
}

// udela ze vstupni matice indentickou matici
function makeIdentityFrom(matrix) {
	var id = createIdentityMatrix4();
	for (var i = 0; i < id.length; i++) {
		matrix[i] = id[i];
	};
	return matrix;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////  TVORBA GUI PRVKU   ////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function createCompass(width, height, position_x, position_y, north_position, angle) {
	// ID divu
	var compass_box_id = "compass-box"; // ID kontejneru pro umisteni kompasu
	var compass_id = "compass"; // id kostry kompasu 
	var compass_arrow_id = "compass_arrow"; // id strelky kompasu 

	// obrazky kompasu
	var compas_skeleton_bg = '../src/img/kompas_bg2.png';
	var compas_arrow_bg = '../src/img/strelka.png';

	// overeni existence boxu
	var compass_box = document.getElementById(compass_box_id);
	if (!compass_box) {
		w('DIV s ID: compass-box NEEXISTUJE!');
		return false;
	}

	var canvas_dom = document.getElementsByTagName("canvas")[0];
	if (!canvas_dom) {
		w('Neexistuje TAG <canvas>!');
		return false;
	}
	var compass_width = width;
	var compass_height = height;

	// dynamicke umisteni zadane parametrem
	var compass_left = (canvas_dom.width - compass_width)*position_x;
	var compass_top = (canvas_dom.height - compass_height)*position_y;


	var compass = document.getElementById(compass_id);
	if (!compass) {
		compass = document.createElement('div');
	}

	compass.setAttribute('id', compass_id);
	compass.style.width = compass_width+'px';
	compass.style.height = compass_height+'px';
	compass.style.left = compass_left+'px';
	compass.style.top = compass_top+'px';
	//compass.style.backgroundColor  = 'blue';
	compass.style.backgroundImage   = 'url('+compas_skeleton_bg+')';
	compass.style.opacity  = 0.75;
	compass.style.position = 'absolute';
	compass.style.overflow = 'hidden';
	compass.style.backgroundSize =  compass_width+'px ' + compass_height+ 'px';	// uprava sirky a vysky pozadi

	// pridame kompas
	if (!document.getElementById(compass_id)) {
		compass_box.appendChild(compass);
	}


	var arrow = document.createElement('div');
	arrow.setAttribute('id', compass_arrow_id);
	arrow.style.width = compass_width+'px';
	arrow.style.height = compass_height+'px';
	arrow.style.backgroundImage   = 'url('+compas_arrow_bg+')';
	arrow.style.transform = 'rotate(' + parseInt(north_position + angle) + 'deg)';
	arrow.style.webkitTransform  = 'rotate(' + parseInt(north_position + angle) + 'deg)';

	if (!document.getElementById(compass_arrow_id)) {
		compass.appendChild(arrow);
	}
	else {
		var arrow_exists = document.getElementById(compass_arrow_id);
		arrow_exists.style.transform = 'rotate(' + parseInt(north_position + angle) + 'deg)';
		arrow_exists.style.webkitTransform  = 'rotate(' + parseInt(north_position + angle) + 'deg)';
		arrow_exists.style.backgroundSize =  compass_width+'px ' + compass_height+ 'px';
	}
	
	return compass_box; 
}

// vytvoreni cesty
function fieldVisionCoord(x, y, radius, startAngle, endAngle){

    var startPoint = polarToCartesian(x, y, radius, endAngle);
    var endPoint = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = ((endAngle-startAngle) > 180) ? '1' : '0';
    var _SP_ = " ";

    // vytvoreni cesty SVG
    return   [
        "M" 				+_SP_+ 
	        startPoint.x 	+_SP_+ 
	        startPoint.y 	+_SP_+

        "A" 				+_SP_+ 
	        radius 			+_SP_+ 
	        radius 			+_SP_+ 
	        0 				+_SP_+ 
	        largeArcFlag 	+_SP_+ 
	        0 				+_SP_+ 
	        endPoint.x 		+_SP_+ 
	        endPoint.y
    ];
}

// wheel_angle = zorny uhel: 0-180 stupnu, mouse_angle = smer kam se divam, udavan ve stupnich V ROZMEZI: 0 - (+-k * PI)
function createFieldVision(width, height, position_x, position_y, wheel_angle, mouse_angle) {

	var viewer = document.getElementById("viewer");
	var canvas_dom = document.getElementsByTagName("canvas")[0];
	if (!canvas_dom) {
		e('Neexistuje TAG <canvas>!');
		return false;
	}
	var field_vision_width = width;
	var field_vision_height = height;

	// dynamicke umisteni zadane parametrem
	var field_vision_left = (canvas_dom.width - field_vision_width)*position_x;
	var field_vision_top = (canvas_dom.height - field_vision_height)*position_y;

	if (viewer) {
		var field_vision = document.getElementById("field_vision");

		if (!field_vision) {
			e('DIV s ID: field_vision NEEXISTUJE!');
			return false;
		}

 		field_vision.style.width = field_vision_width+'px';
		field_vision.style.height = field_vision_height+'px';
		field_vision.style.left = field_vision_left+'px';
		field_vision.style.top = field_vision_top+'px';
		field_vision.style.backgroundColor  = 'transparent'; // transparent
		field_vision.style.opacity  = 1.0;
		//field_vision.style.border  = '1px solid black';
		field_vision.style.position = 'absolute';
		field_vision.style.overflow = 'hidden';
		field_vision.setAttribute('stroke', '#093')
 
  		//nastaveni SVG path
		var vision = document.getElementById("svg_path");
		vision.setAttribute("stroke-width", '30');
		vision.setAttribute('stroke', '#069')
		vision.setAttribute('fill', 'none')
		vision.style.opacity = 0.7;
		vision.style.backgroundColor = 'transparent';

		// nasteveni uhlu
		var posun_koleckem = Math.abs(parseInt(wheel_angle));//getParamByKey("fv") ? getParamByKey("fv") : 0;

		var posun_koleckem_tmp = (180 - posun_koleckem)/2; // pro kazdou stranu
		var posun_mysi =   parseInt(Math.abs(mouse_angle));//parseInt(getParamByKey("fvs") ? getParamByKey("fvs") : 0);
 
		var uhel_zacatku_zorneho_pole = (0-posun_mysi)+posun_koleckem_tmp;
		var uhel_konce_zorneho_pole = (180-posun_mysi)-posun_koleckem_tmp;

		var stred_x = parseInt(width/2);
		var stred_y = parseInt(height/2);
		var velikost = 0.75; // v procentech
		var polomer = stred_x > stred_y ?  parseInt(height/2 * velikost) : parseInt(width/2 * velikost);

  		vision.setAttribute("d", fieldVisionCoord(stred_x, stred_y, polomer, uhel_zacatku_zorneho_pole, uhel_konce_zorneho_pole));
 
 
		return field_vision;
 
	}
	else {
		w('DIV s ID: viewer NEEXISTUJE!');
		return false
	}
}


function createVideoStatusBar(width, height, position_x, position_y, video) {

	var id = 'video_status_bar';
	var viewer = document.getElementById("viewer");
	var video_status_bar = document.getElementById(id);
	if (!video_status_bar) {
		w('ERROR: chybi div pro '+id);
		return false;
	}

	var canvas_dom = document.getElementsByTagName("canvas")[0];
	if (!canvas_dom) {
		w('Neexistuje TAG <canvas>!');
		return false;
	}

 
	var status_bar_box = document.getElementById(id+'_id');
	if (!status_bar_box) {
		status_bar_box = document.createElement('div');
	}

	// obrazky nemaji ovladani videa
	if (SETTINGS.mode.fisheye.panorama.active  || SETTINGS.mode.equirectangular.panorama.active) {
		return false;
	}

	// neexistoval, tak jej vytvorim
	var status_bar_width = width;
	var status_bar_height = height;

	// dynamicke umisteni zadane parametrem
	var status_bar_left = (canvas_dom.width - status_bar_width)*position_x;
	var status_bar_top = (canvas_dom.height - status_bar_height)*position_y;

	// stylovani prvku
	status_bar_box.setAttribute('id', id+'_id');
	status_bar_box.style.width = status_bar_width+'px';
	status_bar_box.style.height = status_bar_height+'px';
	status_bar_box.style.left = status_bar_left+'px';
	status_bar_box.style.top = status_bar_top+'px';
	status_bar_box.style.backgroundColor  = 'transparent';
	status_bar_box.style.opacity  = 0.35;
	status_bar_box.style.position = 'absolute';
	status_bar_box.style.overflow = 'hidden';
	status_bar_box.style.marginRight = '5px';
	status_bar_box.style.margin  = '5px';


 	if (!document.getElementById(id+'_id'))
		video_status_bar.appendChild(status_bar_box);
	 
 

	// ------- progres bar
	var progress_bar_box = document.getElementById('progress_bar');
	if (!progress_bar_box){
		progress_bar_box = document.createElement('progress');
	}

	progress_bar_box.setAttribute('id', 'progress_bar');
	progress_bar_box.setAttribute('class', 'unique');
	
	progress_bar_box.style.width = '70%';//status_bar_width+'px';
	progress_bar_box.style.height = status_bar_height+'px';
 	progress_bar_box.style.float = 'left';
	progress_bar_box.style.opacity = 0.5;
 
 	if (!document.getElementById('progress_bar'))
		status_bar_box.appendChild(progress_bar_box);
	// ------- progres bar KONEC



	// ------- progres v procentech
	var progress_bar_text = document.getElementById('progress_bar_text');
	if (!progress_bar_text){
		progress_bar_text = document.createElement('div');
	}

	progress_bar_text.setAttribute('id', 'progress_bar_text');
	progress_bar_text.style.width = 'auto';
	progress_bar_text.style.height = (status_bar_height )+'px';
	progress_bar_text.style.float = 'left';
 	progress_bar_text.style.marginLeft = '5%';


	if (!document.getElementById('progress_bar_text'))
		status_bar_box.appendChild(progress_bar_text);
	

	// listenery
	video.addEventListener("timeupdate", function() {
 		var value = (100 / video.duration) * video.currentTime;
 		progress_bar_text.innerHTML = '<div>'+Math.round(video.currentTime/video.duration*100)+' %</div>';
 		progress_bar_box.setAttribute('value', ''+video.currentTime/video.duration+'');
 	});

		
}


function createLoader(width, height, position_x, position_y, active, delay) 
{
	var canvas_dom = document.getElementsByTagName("canvas")[0];
	// stylovani prvku
	var div = document.getElementById('overlay');
	if (div) 
	{
		div.style.width = canvas_dom.width+'px';
		div.style.height = canvas_dom.height+'px';

		if (active) {
			div.style.display = 'block';
		}
		else {
			setTimeout(function(){
			    div.style.display = 'none';
			}, (delay > 0 ? delay : 0));
		}
	}
	else {
		w("overlay not exists");
	}
}



function createVideoControlls(width, height, position_x, position_y, video, update) {

	// ID
	var video_controlls_id  = "video_controlls";
	var video_controlls_btn_play_id  = "video_controlls_btn_play";
	var video_controlls_btn_slider_id = 'video_controlls_btn_slider_video';
	var video_controlls_btn_slider_volume_id = 'video_controlls_btn_slider_volume';
	var video_controlls_btn_fullstreen_id = 'video_controlls_btn_fullstreen';

	// overeni existence potrebnych divu kostry
	var viewer = document.getElementById("viewer");
	if (!viewer) {
		e('DIV s ID: viewer NEEXISTUJE!');
		return false
	}

	var canvas_dom = document.getElementsByTagName("canvas")[0];
	if (!canvas_dom) {
		e('Neexistuje TAG <canvas>!');
		return false;
	}

	var video_controlls = document.getElementById(video_controlls_id);
	if (!video_controlls) {
		e('DIV s ID: video_controlls NEEXISTUJE!');
		return false;
	}

	// obrazky nemaji ovladani videa
	if (SETTINGS.mode.fisheye.panorama.active  || SETTINGS.mode.equirectangular.panorama.active) {
		return false;
	}

	var video_controlls_width = width;
	var video_controlls_height = height;

	// dynamicke umisteni zadane parametrem
	video_controlls_left = (canvas_dom.width - video_controlls_width)*position_x;
	video_controlls_top = (canvas_dom.height - video_controlls_height)*position_y;


	// nastylovani a umsiteni boxu
	video_controlls.style.width = video_controlls_width+'px';
	video_controlls.style.height = video_controlls_height+'px';
	video_controlls.style.left = video_controlls_left+'px';
	video_controlls.style.top = video_controlls_top+'px';
	video_controlls.style.backgroundColor  = 'transparent'; // transparent
	video_controlls.style.opacity  = 0.75;
	//video_controlls.style.border  = '1px solid black';
	video_controlls.style.position = 'absolute';
	video_controlls.style.overflow = 'hidden';

	// pridani jednotlivych prvku
	// tlacitko PLAY
	var video_controlls_btn_play = document.getElementById(video_controlls_btn_play_id);
	if (!video_controlls_btn_play) {
		video_controlls_btn_play = document.createElement('div');
		video_controlls_btn_play.setAttribute('id', 'video_controlls_btn_play');
		video_controlls_btn_play.setAttribute('class', 'play_icon'); 
		//video_controlls_btn_play.style.left = video_controlls_btn_play.style.top = 'inherit';
		video_controlls_btn_play.style.height = 'inherit';
		video_controlls_btn_play.style.width =  '15%';
		video_controlls_btn_play.style.float = 'left';
		video_controlls_btn_play.style.backgroundColor  = 'transparent'; // transparent
		video_controlls.appendChild(video_controlls_btn_play);
	}


	// tlacitko posuvnik casu
	var video_controlls_btn_slider = document.getElementById(video_controlls_btn_slider_id);
	if (!video_controlls_btn_slider) {
		video_controlls_btn_slider = document.createElement('input');
		video_controlls_btn_slider.setAttribute('id', video_controlls_btn_slider_id);
		video_controlls_btn_slider.setAttribute('type', 'range');
		video_controlls_btn_slider.setAttribute('value', '0');
		//video_controlls_btn_slider.style.left = video_controlls_btn_slider.style.top = 'inherit';
		video_controlls_btn_slider.style.height = 'inherit';
		video_controlls_btn_slider.style.width =  '25%';
		video_controlls_btn_slider.style.float = 'left';
		video_controlls_btn_slider.style.backgroundColor  = 'transparent'; // transparent
		video_controlls.appendChild(video_controlls_btn_slider);
	}

	// ovladani hlasitosti
	var video_controlls_btn_slider_volume = document.getElementById(video_controlls_btn_slider_volume_id);
	if (!video_controlls_btn_slider_volume) {
		video_controlls_btn_slider_volume = document.createElement('input');
		video_controlls_btn_slider_volume.setAttribute('id', video_controlls_btn_slider_volume_id);
		video_controlls_btn_slider_volume.setAttribute('type', 'range');
		video_controlls_btn_slider_volume.setAttribute('value', '1');
		video_controlls_btn_slider_volume.setAttribute('min', '0');
		video_controlls_btn_slider_volume.setAttribute('max', '1');
		video_controlls_btn_slider_volume.setAttribute('step', '0.01');
		//video_controlls_btn_slider_volume.style.left = video_controlls_btn_slider_volume.style.top = 'inherit';
		video_controlls_btn_slider_volume.style.height = 'inherit';
		video_controlls_btn_slider_volume.style.width =  '15%';
		video_controlls_btn_slider_volume.style.float = 'left';
		video_controlls_btn_slider_volume.style.backgroundColor = 'transparent';
		//video_controlls_btn_slider_volume.style.transform = 'rotate(-90deg)';
		//video_controlls_btn_slider_volume.style.webkitTransform = 'rotate(-90deg)';
 		video_controlls.appendChild(video_controlls_btn_slider_volume);
	}

	// fulstreen
	var video_controlls_btn_fullstreen = document.getElementById(video_controlls_btn_fullstreen_id);
	if (!video_controlls_btn_fullstreen) {
		video_controlls_btn_fullstreen = document.createElement('input');
		video_controlls_btn_fullstreen.setAttribute('id', video_controlls_btn_fullstreen_id);
		video_controlls_btn_fullstreen.setAttribute('class', 'fullscreen_icon'); 
		video_controlls_btn_fullstreen.style.height = 'inherit';
		video_controlls_btn_fullstreen.style.width =  '15%';
		video_controlls_btn_fullstreen.style.float = 'left';
		video_controlls_btn_fullstreen.style.backgroundColor  = 'transparent'; // transparent
 		video_controlls.appendChild(video_controlls_btn_fullstreen);
	}

	// je nutne rozlisit, zdali jde o aktualizaci pozice html elemtnu, nebo o udalost vyvalanou listnerem -> jinak by doslo k chybe
	if (update) {
		return video_controlls;
	}

	// lisnenery
	video_controlls_btn_play.addEventListener("click", function() {
		if (video.paused == true) {
			// Play the video
			video.play();

			// Update the button text to 'Pause'
 			video_controlls_btn_play.setAttribute('class', 'pause_icon'); 
		} else {
			// Pause the video
			video.pause();

			// Update the button text to 'Play'
 			video_controlls_btn_play.setAttribute('class', 'play_icon'); 
		}
	});

	video.addEventListener("timeupdate", function() {
 
 		var value = (100 / video.duration) * video.currentTime;

 		video_controlls_btn_slider.value = value;

 	});

	// aktualizace casove osy videa
	video_controlls_btn_slider.addEventListener("change", function() {
		var time = (video_controlls_btn_slider.value / 100) *  video.duration ;
		video.currentTime = time;
	});

	// ovladani posunu videa
	video_controlls_btn_slider.addEventListener("mousedown", function() {
		video.pause();

	});

	video_controlls_btn_slider.addEventListener("mouseup", function() {
		video.play();
		video_controlls_btn_play.setAttribute('class', 'pause_icon'); 

	});

 
	// ovladani hlasitosti
	video_controlls_btn_slider_volume.addEventListener("change", function() {
		video.volume = video_controlls_btn_slider_volume.value;
	});
 
	// nacitani videa
	video.addEventListener('progress', function() {
	    var range = 0;
	    var buffered = video.buffered;
	    var time = this.currentTime;
	});

	video_controlls_btn_fullstreen.addEventListener('click', function() {
 
 		// nastaveni ikon
		if (video_controlls_btn_fullstreen.getAttribute('class') == 'fullscreen_icon'){
			video_controlls_btn_fullstreen.setAttribute('class', 'normalscreen_icon');
			//fullscreen
			canvas_dom.width =window.innerWidth;
			canvas_dom.height = window.innerHeight;;
			gl.viewport(0, 0, canvas_dom.width, canvas_dom.height);
			resize();
		}
		else if (video_controlls_btn_fullstreen.getAttribute('class') == 'normalscreen_icon'){
			video_controlls_btn_fullstreen.setAttribute('class', 'fullscreen_icon');
			//normalscreen
			canvas_dom.width = SETTINGS.default.canvas.width;
			canvas_dom.height = SETTINGS.default.canvas.height;
			gl.viewport(0, 0, canvas_dom.width, canvas_dom.height);
			resize();
		}

	});



	return  video_controlls;
}


