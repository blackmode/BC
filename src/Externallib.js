function DebugThreeStat() {
		javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();stats.domElement.style.cssText='position:fixed;left:0;top:0;z-index:10000';document.body.appendChild(stats.domElement);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})();
}

// https://www.khronos.org/webgl/wiki/WebGL_and_OpenGL_Differences
function createTextureFromImage(image) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    if (!isPowerOfTwo(image.width) || !isPowerOfTwo(image.height)) {
        // Scale up the texture to the next highest power of two dimensions.
        var canvas = document.createElement("canvas");
        canvas.width = nextHighestPowerOfTwo(image.width);
        canvas.height = nextHighestPowerOfTwo(image.height);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, image.width, image.height);
        image = canvas;
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
}

function isPowerOfTwo(x) {
    return (x & (x - 1)) == 0;
}

function nextHighestPowerOfTwo(x) {
    --x;
    for (var i = 1; i < 32; i <<= 1) {
        x = x | x >> i;
    }
    return x + 1;
}

 function failed(event) {
   // video playback failed - show a message saying why
   switch (event.target.error.code) {
     case event.target.error.MEDIA_ERR_ABORTED:
       alert('You aborted the video playback.');
       break;
     case event.target.error.MEDIA_ERR_NETWORK:
       alert('A network error caused the video download to fail part-way.');
       break;
     case event.target.error.MEDIA_ERR_DECODE:
       alert('The video playback was aborted due to a corruption problem or because the video used features your browser did not support.');
       break;
     case event.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
       alert('The video could not be loaded, either because the server or network failed or because the format is not supported.');
       break;
     default:
       alert('An unknown error occurred.');
       break;
   }
 }

 // the NPOT fix is taken from : 
// http://www.khronos.org/webgl/wiki/WebGL_and_OpenGL_Differences

function makeSuitableForTexture(srcElement) {
   srcElement.crossOrigin = '';

   // it probs should be image.width not image.videoWidth or clientWidth but doesn't work with <video>
   // TODO fixme
   if (srcElement.tagName === 'IMG') {
      var width = srcElement.width;
      var height = srcElement.height;
   } else {
      var width = srcElement.videoWidth;
      var height = srcElement.videoHeight;
   }

   if (!isPowerOfTwo(width) || !isPowerOfTwo(height)) {
      // Scale up the texture to the next highest power of two dimensions.
      var canvas = document.createElement("canvas");
      canvas.width = nextHighestPowerOfTwo(width);
      canvas.height = nextHighestPowerOfTwo(height);

      // colour the bg in almost black
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = '#1F1F1F';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // draw image in the middle
      var centerX = canvas.width / 2 - width / 2;
      var centerY = canvas.height / 2 - height / 2;
      ctx.drawImage(image, centerX, centerY, width, height);

     srcElement = canvas;
   }

   return srcElement;
}

function nextHighestPowerOfTwo(x) {
   --x;
   for (var i = 1; i < 32; i <<= 1) {
      x = x | x >> i;
   }
   return x + 1;
}



function createCube2Geometry () 
{
	var vertices = [];
	var textures = [];
	var normals = [];
	var indices = [];

		// x,y,z
        var vertices = [
    // Front
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,

    // Back
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,

    // Top
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,

    // Bottom
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,

    // Right
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,

    // Left
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0
        ];

		var textures = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0
		];

		// x,y,z
        var normals = [
    // Front
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,

    // Back
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,

    // Top
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,

    // Bottom
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,

    // Right
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,

    // Left
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0
        ];

var indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23    // left


];



	return {
		vertices: new Float32Array(vertices),
		textures: new Float32Array(textures),
		normals: new Float32Array(normals),
		indices: new Uint16Array(indices),
	};
}