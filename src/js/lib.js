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
			u= longNumber/longitudeBands;
			v= latNumber/latitudeBands;

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
    video.muted = false;
    video.autoplay = false;
    video.src = src;
    video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
	video.load();
	return video;
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




function createImage( src ) {
	if (!checkIfFileExists(src)) {
		w('Zdrojovy obrazek neexistuje');
		return false;
	}
    var image =  new Image();
    image.src = src;
	return image;
}

function createCompass(width, height, position_x, position_y) {

	var div = document.getElementById("compass-box");
	var canvas_dom = document.getElementsByTagName("canvas")[0];
	if (!canvas_dom) {
		w('Neexistuje TAG <canvas>!');
		return false;
	}
	var compass_width = width;
	var compass_height = height;

	// Umisteni v canvasu na dolni okraj doprostred
	var compass_left = ( (canvas_dom.width/2)-(compass_width/2)) | 0;
	var compass_top =   ((canvas_dom.height)-(compass_height)) | 0;

	// dynamicke umisteni zadane parametrem
	var left_correction = (width/canvas_dom.width); 
	var compass_left =  canvas_dom.width*((position_x)-left_correction);

	var top_correction = (height/canvas_dom.height); 
	var compass_top =   canvas_dom.height*((position_y)-top_correction);

	if (div) {
		var div = document.createElement('div');
		div.setAttribute('id', 'compass');
		div.style.width = compass_width+'px';
		div.style.height = compass_height+'px';
		div.style.left = compass_left+'px';
		div.style.top = compass_top+'px';
		div.style.backgroundColor  = 'blue';
		div.style.opacity  = 0.4;
		div.style.position = 'absolute';
		div.style.overflow = 'hidden';

		var compass_box = document.getElementById("compass-box");
		if (!compass_box) {
			w('Neexistuje TAG <BODY> s ID body, nutne pro logger!');
		}
		else {
			compass_box.appendChild(div);
			return div;
		}
	}
	else {
		w('DIV s ID: compass-box NEEXISTUJE!');
	}
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

	// Umisteni v canvasu na dolni okraj doprostred
	// staticke umisteni
	var field_vision_left =  ((canvas_dom.width/4)-(field_vision_width/4)) | 0;
	var field_vision_top =   ((canvas_dom.height) -(field_vision_height))  | 0;

	// dynamicke umisteni zadane parametrem
	var left_correction = (width/canvas_dom.width); 
	var field_vision_left =  canvas_dom.width*((position_x)-left_correction);

	var top_correction = (height/canvas_dom.height); 
	var field_vision_top =   canvas_dom.height*((position_y)-top_correction);

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
 
 
		return vision;
 
	}
	else {
		w('DIV s ID: viewer NEEXISTUJE!');
		return false
	}
}


function createPerspectiveMatrix  (fieldOfViewInRadians, aspectRatio, near, far) {
  
    // Construct a perspective matrix
  
    /*
       Field of view - the angle in radians of what's in view along the Y axis
       Aspect Ratio - the ratio of the canvas, typically canvas.width / canvas.height
       Near - Anything before this point in the Z direction gets clipped (outside of the clip space)
       Far - Anything after this point in the Z direction gets clipped (outside of the clip space)
    */
  	//var fovy = 2 * Math.atan(Math.tan(hfov/2) * canvas.clientHeight / canvas.clientWidth);
    var f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
    var rangeInv = 1 / (near - far);
 
    return [
      f / aspectRatio, 0,                          0,   0,
      0,               f,                          0,   0,
      0,               0,    (near + far) * rangeInv,  -1,
      0,               0,  near * far * rangeInv * 2,   0
    ];
  }

function rotateX(m, angle) {
	var c = Math.cos(angle);
	var s = Math.sin(angle);
	// smer otaceni
	var direction = -1;

	// zalohovani hodnot
	var m1_tmp = m[1];
	var m5_tmp = m[5]; 
	var m9_tmp = m[9];
	
	// vynasobeni puvodni matice M rotacni matici RotX, tedy (M x RotX)
	m[1] = m[1]*c + m[2]*s  * direction;
	m[5] = m[5]*c + m[6]*s  * direction;
	m[9] = m[9]*c + m[10]*s * direction;

	m[2] = 	m[2] *c - m1_tmp*s * direction;
	m[6] = 	m[6] *c - m5_tmp*s * direction;
	m[10] = m[10]*c - m9_tmp*s * direction;
	return m;
}


function rotateY(m, angle) {
	var c = Math.cos(angle);
	var s = Math.sin(angle);

	// smer otaceni
	var direction = 1;

	// zalohovani hodnot
	var m0_tmp = m[0];
	var m4_tmp = m[4];
	var m8_tmp = m[8];
	
	// vynasobeni puvodni matice M rotacni matici RotX, tedy (M x RotX)
	m[0] = c*m[0] - s*m[2]*direction;
	m[4] = c*m[4] - s*m[6]*direction;
	m[8] = c*m[8] - s*m[10]*direction;

	m[2] = c*m[2] + s*m0_tmp*direction;
	m[6] = c*m[6] + s*m4_tmp*direction;
	m[10] = c*m[10] + s*m8_tmp*direction;
	return m;
	/*
		return m=[
			(c*m[0] + s*m[2]*direction), m[1], (c*m[2] - s*m0_tmp*direction), m[3],
			(c*m[4] + s*m[6]*direction), m[5], (c*m[6] - s*m4_tmp*direction), m[7],
			(c*m[8] + s*m[10]*direction), m[9], (c*m[10] - s*m8_tmp*direction), m[11],
			m[12], 	m[13], m[14], m[15]
		];
	*/
}

function createVideoStatusBar(width, height, position_x, position_y, video) {

	var id = 'video_status_bar';
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

	if (video_status_bar) 
	{
		var status_bar_box = document.getElementById(id+'_id');
		if (!status_bar_box) 
		{
			// neexistoval, tak jej vytvorim
			var status_bar_width = width;
			var status_bar_height = height;

			// dynamicke umisteni zadane parametrem
			var left_correction = (width/canvas_dom.width); 
			var status_bar_left =  canvas_dom.width*((position_x)-left_correction);

			var top_correction = (height/canvas_dom.height); 
			var status_bar_top =   canvas_dom.height*((position_y)-top_correction);

			// stylovani prvku
			var div = document.createElement('div');
			div.setAttribute('id', id+'_id');
			div.style.width = status_bar_width+'px';
			div.style.height = status_bar_height+'px';
			div.style.left = status_bar_left+'px';
			div.style.top = status_bar_top+'px';
			div.style.backgroundColor  = 'white';
			div.style.opacity  = 0.4;
			div.style.position = 'absolute';
			div.style.overflow = 'hidden';
			div.style.padding = '5px';
			video_status_bar.appendChild(div);





		}
		else {

			var progress_bar_box = document.getElementById('progress_bar');
			if (!progress_bar_box)
			{
				var progress_bar = document.createElement('progress');
				progress_bar.setAttribute('id', 'progress_bar');
				progress_bar.setAttribute('class', 'unique');
				
				progress_bar.style.width = status_bar_width+'px';
				progress_bar.style.height = status_bar_height+'px';
				progress_bar.style.background = '#333';
				status_bar_box.appendChild(progress_bar);
			}

			// ujistime se, ze video ma jiz metadata
			if (video.readyState >= video.HAVE_METADATA) {
				progress_bar_box = document.getElementById('progress_bar');
				progress_bar_box.setAttribute('value', ''+video.currentTime/video.duration+'');
				progress_bar_box.innerHTML = '<div>'+Math.round(video.currentTime/video.duration*100)+' %</div>';
			}
			
			return status_bar_box;
		}
	}
	else {
		w('DIV s ID: compass-box NEEXISTUJE!');
	}
}