function DebugThreeStat() {
		javascript:(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();stats.domElement.style.cssText='position:fixed;left:0;top:0;z-index:10000';document.body.appendChild(stats.domElement);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})();
}
DebugThreeStat();

function ellipticalDiscToSquare( u,  v)
{
    var u2 = u * u;
    var v2 = v * v;
    var twosqrt2 = 2.0 * Math.sqrt(2.0);
    var subtermx = 2.0 + u2 - v2;
    var subtermy = 2.0 - u2 + v2;
    var termx1 = subtermx + u * twosqrt2;
    var termx2 = subtermx - u * twosqrt2;
    var termy1 = subtermy + v * twosqrt2;
    var termy2 = subtermy - v * twosqrt2;
    x = 0.5 * Math.sqrt(termx1) - 0.5 * Math.sqrt(termx2);
    y = 0.5 * Math.sqrt(termy1) - 0.5 * Math.sqrt(termy2);

	return {
		x: x,
		y: y,
	}; 

    
}