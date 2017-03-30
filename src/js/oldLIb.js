	var checkCursor = function (latNumber,longNumber) {

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


		var sirka_poledniku = longNumber*longitude_width;
		var sirka_rovnobezky = latNumber*latitude_width;

		// pokud jsem v rozmezi jak X
		if (((sirka_poledniku>=fisheye_1_x_begin && sirka_poledniku<=fisheye_1_x_end)|| (sirka_poledniku>=fisheye_2_x_begin && sirka_poledniku<=fisheye_2_x_end)))   
		{
			// pokud jsem v rozmezi jak X tak Y
			if (((sirka_rovnobezky>=fisheye_1_y_begin && sirka_rovnobezky<=fisheye_1_y_end)|| (sirka_rovnobezky>=fisheye_2_y_begin && sirka_rovnobezky<=fisheye_2_y_end)))   {
  				return {
					u: longNumber/longitudeBands,
					v: latNumber/latitudeBands,
				}; 
			}

			// pokud jsem pod krivkou
			if (((sirka_rovnobezky>=0 && sirka_rovnobezky<=fisheye_1_y_begin)|| (sirka_rovnobezky>=0 && sirka_rovnobezky<=fisheye_2_y_begin)))   {
				//console.log('Jsem zde pripad 2');
					return {
					u: longNumber/longitudeBands,
					v: (fisheye_1_y_begin/sirka_rovnobezky)/latitudeBands,
				}; 
			}
		 

			// pokud jsem nad krivkou
			if (((sirka_rovnobezky>=fisheye_1_y_end && sirka_rovnobezky<=resolution_height)|| (sirka_rovnobezky>=fisheye_2_y_end && sirka_rovnobezky<=resolution_height)))   {
				//console.log('Jsem zde pripad 3');
					return {
					u: longNumber/longitudeBands,
					v: (fisheye_1_y_end/sirka_rovnobezky)/latitudeBands,
				}; 
			}

		}
		else {

 			// pokud jsem v rozmezi   Y
			if (((sirka_rovnobezky>=fisheye_1_y_begin && sirka_rovnobezky<=fisheye_1_y_end)|| (sirka_rovnobezky>=fisheye_2_y_begin && sirka_rovnobezky<=fisheye_2_y_end)))   {

				var tmp_u;
				if (sirka_poledniku >= 0 && sirka_poledniku<=fisheye_1_x_begin) {
					//console.log('Jsem zde pripad 4');
					tmp_u = fisheye_1_x_begin/sirka_poledniku;
				}
				else if (sirka_poledniku>=fisheye_1_x_end && sirka_poledniku<=fisheye_2_x_begin) {
										//console.log('Jsem zde pripad 5');

					tmp_u = fisheye_2_x_begin/sirka_poledniku;
				}
				else {
					//console.log('Jsem zde pripad 6');

					tmp_u = fisheye_2_x_end/sirka_poledniku;
				}

  				return {
					u: tmp_u/longitudeBands,
					v: latNumber/latitudeBands,
				}; 
			}

		}
 

				return {
					u: longNumber/longitudeBands,
					v: latNumber/latitudeBands,
				}; 

	}



	
/*
// korekce
if (v <=  0.01574074074074074074074074074074) v = 0.01574074074074074074074074074074;
else {
	aktualni_rovnobezka = latNumber;
}
if (u <= 0.00885416666666666666666666666667) u =   0.00885416666666666666666666666667; // jeste upravit

var r = 452/1920;
var dopocet = 0;

if (longNumber <= longitudeBands / 4) {
	if (aktualni_rovnobezka>0) {

		var diff = (prumer - (Math.sin(theta)*r));
		var d = (Math.sin(theta)*r)*2;
		u = u+ diff;
 	}
}


if (longNumber > longitudeBands / 4 && longNumber <= longitudeBands /2) {
	if (aktualni_rovnobezka>0) {

		var diff = (prumer - (Math.sin(theta)*r));
		var d = (Math.sin(theta)*r)*2;
		u = u+ diff+d ;
	}
}

*/
 



 
/*
if (v <=  0.01574074074074074074074074074074) v = 0.01574074074074074074074074074074;

if (v >=  0.87592592592592592592592592592593) v = 0.87592592592592592592592592592593;

 if (u <= 0.00885416666666666666666666666667) u = 0.00885416666666666666666666666667;
 
  if (u >= 0.4796875 && u<= 0.5) u = 0.4796875;
  if (u >= 0.96927083333333333333333333333333 && u<= 1) u = 0.96927083333333333333333333333333;
*/
 

 
 
/*

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

*/
