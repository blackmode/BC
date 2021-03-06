/* panorama.js  
 *
 * Copyright (C) <year> <copyright holder>
 * All rights reserved.
 *
 * This software may be modified and distributed under the terms
 * of the BSD license.  See the LICENSE file for details.
 */

/*
	GET PARAMS:

	JSON_file = src JSON path
	fishVM = virwers mode
	equiVM = virwers mode
	fishPM = virwers mode
	equiPM = virwers mode
	notJSON = not JSON file with the same name, but file inserted via GET params
	video_src = src of video
	image_src = src of image

	// timto se rika, ktera data z jakeho videa se maji pouzit, jedna pouze o index, pokujich bude pet tak index 0-4
	equiVM_json_key
	equiVM_json_key
	equiPM_json_key
	equiPM_json_key
*/

var gl;
var GEOMETRY;
 
/// ------ VSECHNY PROMENNE PRO MYS
var MOUSE = {
	down : {
		x: 0.0,
		y: 0.0,
	} ,
	move : {
		x: 0.0,
		y: 0.0,
		angle: {
			x: 0.0,
			y: 0.0,
		} ,
	} ,
	wheel : {
		sensitivity: 1.5/10,
		reduction: 1.3, // radius/4
		delta: 0.0,
		deltaMax: 0.0,
		deltaMin: 0.0,
	} ,

	active : false,
	interrupt: false,
	amort: 0.0
};



/// ------ VSECHNY PROMENNE PRO KLAVESNICI
var KEYBOARD = {
	active : true,
	sensitivity : {
		x: 0.06,
		y:  0.06,
	}
};


/// ------ VSECHNY nastaveni PROGRAMU
var SETTINGS = {
	mode : {
		equirectangular : {
			panorama : {
				active: true,
			},
			video : {
				active: false,
			},
		} ,
		fisheye : {
			panorama : {
				active: false,
			},
			video : {
				active: false,
				latitudes: 60,
				longtitudes: 60,
				radius: 7,
			} ,
		} ,	
	},
	default : {
		canvas : {
			width: null,
			height:  null,
			resize: null,
		} ,
	} ,
	input : {
		video: null,
		image:  null,
	} ,
	field_vision : {
		width: 200,
		height:  200,
		canvas_position_x:  0.85,
		canvas_position_y:  1.0,
		object: null,
		angle: 0.0,
		shift: 0.0,
	} ,
	compass : {
		width: 180,
		height:  180,
		canvas_position_x:  0.6,
		canvas_position_y:  1.0,
		north: 20, // umisteni severu v kompasu
		angle: 0.0,
		object: null,
	} ,
	video_controlls : {
		created: null,
		user_inactive: false,
		object: null,
		width: null,
		height:  75,
		canvas_position_x:  0.0,
		canvas_position_y:  1.0,
 	},
	video_status_bar : {
		object: null,
		width: 170,
		height:  20,
		canvas_position_x:  1.0,
		canvas_position_y:  0.0,
 	},
	panorama_controlls : {
		object: null,
		width: 260,
		height:  50,
		canvas_position_x:  1.0,
		canvas_position_y:  1.0,
		btn: {
			settings: {// jde o okno nastaveni
				object: null,
				show_window: false,
				width: 150,
				height:  300,
				canvas_position_x:  1.0,
				canvas_position_y:  0.2
			}
		},
		// jedna se box s titulky
		subtitles_box : {
			object: null,
			width: 250,
			height:  50,
			canvas_position_x:  0.2,
			canvas_position_y:  0.85,
			active: false,
			current_subtitle: '...'
	 	},
 	},

	info_screen : {
		width: 300,
		height:  150,
 	} ,
};



/// ------ VSECHNY promenne PROGRAMU
var PROG = {

	shader : {
		equirectangular : {
			panorama: null,
			video: null,
		} ,
	},

	// BUFFERY programu
	buffer : {
		normal: null,
		index: null,
		vertex: null,
		texture: null,
	} ,

	// ATRIBUTY programu
	attributes : {
		vertex: null,
		fragment: null,
		texture: null,
	} ,

	// MATICE
	matrices : {
		model : {
			link: null,
			data: null,
		} ,
		view : {
			link: null,
			data: null,
		} ,
		projection : {
			link: null,
			data: null,
			fov: null,
		} ,
	} ,


	texture: null,
	sampler: null,
	program: null,
	canvas: null,
	time: null,
	startTime: null,
	fatal_error: false
};



/// ------ CACHE PROGRAMU
var CACHE = {
	json_object: null,
};

//SETTINGS.input.video =  createVideo("data/R0010082.mp4"); // R0010014_20161217101030_er / R0010081
//SETTINGS.input.video =  createVideo("data/R0010082.mp4"); // R0010014_20161217101030_er / R0010081

 //SETTINGS.input.video =  createVideo("theta/data/new/new2/knihovna.mp4");
//SETTINGS.input.video =  createVideo("data/R0010014_20161217101030_er.mp4");





if (getParamByKey("video"))
	SETTINGS.input.video =  createVideo(getParamByKey("video"));

setFishVideoMode();
/*
SETTINGS.mode.fisheye.panorama.active 			= false;
SETTINGS.mode.fisheye.video.active 				= false;

SETTINGS.mode.equirectangular.panorama.active 	= false;
SETTINGS.mode.equirectangular.video.active 		= false;

SETTINGS.mode.fisheye.video.active = true;
*/
/*
setEquiVideoMode();
setFishPanoMode();
setEquiPanoMode();
*/
 //SETTINGS.input.video = document.getElementById('video');
//SETTINGS.input.image = createImage("theta/data/t1.jpg"); // p7.jpg / t1.jpg
//SETTINGS.input.image = createImage("theta/data/p6.jpg"); // p7.jpg / t1.jpg
//SETTINGS.input.image = createImage("theta/data/p7.jpg"); // p7.jpg / t1.jpg

//SETTINGS.input.image = createImage("data/images/equirectangular/R0010090.JPG"); // p7.jpg / t1.jpg


 


//aktivae pomoci argumentu ma prednost
if (getParamByKey("fishVM")) {	//fishVM_json_key
	setFishVideoMode();
} 

if (getParamByKey("equiVM")) {	//equiVM_json_key
	setEquiVideoMode();
}

if (getParamByKey("fishPM")) {
	setFishPanoMode();
}

if (getParamByKey("equiPM")) {
	setEquiPanoMode();
}



// jestli pouzijeme vstupni argumenty
if (getParamByKey("notJSON")) 
{
	if (getParamByKey("video_src")) {
		SETTINGS.input.video = createVideo(getParamByKey("video_src")); 
	}
	else if (getParamByKey("image_src")) {
		SETTINGS.input.image =  createImage(getParamByKey("image_src")); // p7.jpg / t1.jpg
	}
	else {
		w('ERROR: Byl ocekavan vstup pomoci parametru, ktery ale nebyl zadan!');
		createInfoScreen(
			"ERROR: Byl ocekavan vstup pomoci parametru, ktery ale nebyl zadan!", 
			SETTINGS.info_screen.width,
			SETTINGS.info_screen.height
		);
		PROG.fatal_error = true;
	}

	// pridani jsounu pokd je zadan parametrem
	if (getParamByKey("JSON_file")) {
		loadJSONfile();
	}

}

// druha moznost je pouzit JSON, je vyhodnejsi v priapde, ze bychom potrebovali menit pozici kompasu k videu aj.
else {
	var JSON = loadJSONfile();

	if (JSON===false) {
		PROG.fatal_error = true;
	}

	if (  SETTINGS.mode.fisheye.video.active || SETTINGS.mode.equirectangular.video.active) {
		if (JSON && JSON.video && JSON.video) {
			SETTINGS.input.video = createVideo(JSON.video); 
		}
		else {
			w('v souboru JSON neni video, nebo jeho zdroj');
			createInfoScreen(
				"v souboru JSON neni video, nebo jeho zdroj", 
				SETTINGS.info_screen.width,
				SETTINGS.info_screen.height
			);
		}
	}
	else if (SETTINGS.mode.fisheye.panorama.active || SETTINGS.mode.equirectangular.panorama.active ) {

		if (JSON && JSON.image && JSON.image) {
				SETTINGS.input.image =  createImage(JSON.image); // p7.jpg / t1.jpg

		}
		else {
			w('v souboru JSON neni obrazek, nebo jeho zdroj');
			createInfoScreen(
				"v souboru JSON neni obrazek, nebo jeho zdroj", 
				SETTINGS.info_screen.width,
				SETTINGS.info_screen.height
			);
		}

	}
}

/**
 *	Nacteme JSON se soubory videi a panoramat
 *
 *  v pripade že JSON nebude true, tak se nastavi deafaultni hodnot. Naddefaultnimi hodnotami 
 *	jeste stoji vstup pomoci adresni parametr
 */
function loadJSONfile() {

	// pokud neni JSON v cache, tak nejrpve ulozim 
	if (CACHE.json_object == null) {
		var current_file_name = getCurrentProgramFilename().split('.')[0];
		var dest_json_file = current_file_name+'.json';
		// jeste primda moznost zadat externi JSON parametrem
		if (getParamByKey("JSON_file") && isFileExists(getParamByKey("JSON_file"))) {
			dest_json_file = getParamByKey("JSON_file");
		}

		var request = new XMLHttpRequest();
		request.open("GET", dest_json_file, false);
		request.send(null);
		if (request.status==200   && request.statusText === 'OK') {
			var JSON_object = JSON.parse(request.responseText);
			CACHE.json_object = JSON_object;
		} 
		else {
			w('nepogedlo se nacist soubor JSON!');
			return false;
		}
	}
	else {
		// v opacnem rpipade nactu z cache
		var JSON_object = CACHE.json_object;
	}


	var JSON_video_src = false;
	var JSON_image_src = false;

	// aktualizace objektu zadanym parametrem
	var objUpdateValues = function(current_obj, settings_obj) {
		if (current_obj.width!=null  && !isNaN(current_obj.width)) 				settings_obj.width = current_obj.width;
		if (current_obj.height!=null && !isNaN(current_obj.height)) 			settings_obj.height = current_obj.height;
		if (current_obj.canvas_position_x!=null && !isNaN(current_obj.canvas_position_x)) settings_obj.canvas_position_x = current_obj.canvas_position_x;
		if (current_obj.canvas_position_y!=null && !isNaN(current_obj.canvas_position_y)) {
 			settings_obj.canvas_position_y = current_obj.canvas_position_y;
		}
	};

	// moznost vstupu dvema mody
	// RYBI OKO
	if (JSON_object.fisheye) 
	{
		if (JSON_object.fisheye.video && SETTINGS.mode.fisheye.video.active) 
		{
			var indexOfSrc = (getParamByKey("fishVM_json_key") ? getParamByKey("fishVM_json_key") : 0);
			var fishEye = JSON_object.fisheye.video[indexOfSrc];
			
			// nastaveni zdroje videa
			if (fishEye && fishEye.src)	JSON_video_src = fishEye.src;
			else {
				w('nepodarilo se nacist data ze souboru JSON');
				return false;
			}

			// nastaveni kompasu ze souboru
			if (fishEye.compass) 
			{
				// aktualizace hodnot z JSON souboru
				objUpdateValues(fishEye.compass, SETTINGS.compass);

				// prenastavuju jen pokud se hodnoty nerovnaji
				if (fishEye.compass.north!=null && !isNaN(fishEye.compass.north) && fishEye.compass.north!=SETTINGS.compass.north) {
					SETTINGS.compass.north = fishEye.compass.north;
					if (fishEye.compass.width)				SETTINGS.compass.width = fishEye.compass.width;
					if (fishEye.compass.height) 			SETTINGS.compass.height = fishEye.compass.height;
					if (fishEye.compass.canvas_position_x)	SETTINGS.compass.canvas_position_x = fishEye.compass.canvas_position_x;
					if (fishEye.compass.canvas_position_y)	SETTINGS.compass.canvas_position_y = fishEye.compass.canvas_position_y;
					log('Compass: uspesne prenastaveno');
				}
			}

			// aktualizace hodnot z JSON souboru
			if (fishEye.field_vision) {
				objUpdateValues(fishEye.field_vision, SETTINGS.field_vision);
			}


		}
		else if (JSON_object.fisheye.panorama && SETTINGS.mode.fisheye.panorama.active) 
		{
			var indexOfSrc = (getParamByKey("fishPM_json_key") ? getParamByKey("fishPM_json_key") : 0);
			var fishPano = JSON_object.fisheye.panorama[indexOfSrc];

			// nastaveni zdroje panoramatu
			if (fishPano && fishPano.src)	JSON_image_src = fishPano.src;
			else {
				w('nepodarilo se nacist data ze souboru JSON');
				return false;
			}

			// nastaveni kompasu ze souboru
			if (fishPano.compass) 
			{
				// aktualizace hodnot z JSON souboru
				objUpdateValues(fishPano.compass, SETTINGS.compass);

				// prenastavuju jen pokud se hodnoty nerovnaji
				if (fishPano.compass.north!=null && !isNaN(fishPano.compass.north) && fishPano.compass.north!=SETTINGS.compass.north) {
					SETTINGS.compass.north = fishPano.compass.north;
					log('Compass: uspesne prenastaveno');
				}
			}

			// aktualizace hodnot z JSON souboru
			if (fishPano.field_vision) {
				objUpdateValues(fishPano.field_vision, SETTINGS.field_vision);
			}

		}
	}
	// Equirectangular INPUT
	if (JSON_object.equirectangular) 
	{
		if (JSON_object.equirectangular.video && SETTINGS.mode.equirectangular.video.active) 
		{

			var indexOfSrc = (getParamByKey("equiVM_json_key") ? getParamByKey("equiVM_json_key") : 0);
			var equirectVideo = JSON_object.equirectangular.video[indexOfSrc];

			// nastaveni zdroje videa
			if (equirectVideo && equirectVideo.src)	JSON_video_src = equirectVideo.src;
			else {
				w('nepodarilo se nacist data ze souboru JSON');
				return false;
			}

			// nastaveni kompasu ze souboru
			if (equirectVideo.compass) 
			{
				// aktualizace hodnot z JSON souboru
				objUpdateValues(equirectVideo.compass, SETTINGS.compass);

				// prenastavuju jen pokud se hodnoty nerovnaji
				if (equirectVideo.compass.north!=null && !isNaN(equirectVideo.compass.north) && equirectVideo.compass.north!=SETTINGS.compass.north) {
					SETTINGS.compass.north = equirectVideo.compass.north;
					log('Compass: uspesne prenastaveno');
				}
			}

			// aktualizace hodnot z JSON souboru
			if (equirectVideo.field_vision) {
				objUpdateValues(equirectVideo.field_vision, SETTINGS.field_vision);
			}

		}
		else if (JSON_object.equirectangular.panorama && SETTINGS.mode.equirectangular.panorama.active) 
		{
			var indexOfSrc = (getParamByKey("equiPM_json_key") ? getParamByKey("equiPM_json_key") : 0);
			var equirectPano = JSON_object.equirectangular.panorama[indexOfSrc];

			// nastaveni zdroje videa
			if (equirectPano && equirectPano.src)	JSON_image_src = equirectPano.src;
			else {
				w('nepodarilo se nacist data ze souboru JSON');
				return false;
			}

			// nastaveni kompasu ze souboru
			if (equirectPano.compass) 
			{
				// aktualizace hodnot z JSON souboru
				objUpdateValues(equirectPano.compass, SETTINGS.compass);

				// prenastavuju jen pokud se hodnoty nerovnaji
				if (equirectPano.compass.north!=null && !isNaN(equirectPano.compass.north) && equirectPano.compass.north!=SETTINGS.compass.north) {
					SETTINGS.compass.north = equirectPano.compass.north;
					log('Compass: uspesne prenastaveno');
				}
			}

			// aktualizace hodnot z JSON souboru
			if (equirectPano.field_vision) {
				objUpdateValues(equirectPano.field_vision, SETTINGS.field_vision);
			}

		}
	}


	return {
		video: JSON_video_src,
		image: JSON_image_src
	};
}



/**
 *	Nastavuje a aktualizuje potřebné objektoveo proměnné programu,
 *
 *  
 *
 */
function updateObjectVariables() {

	// inicializace GUI prvku 
	SETTINGS.compass.object = createCompass(
		SETTINGS.compass.width, 
		SETTINGS.compass.height, 
		SETTINGS.compass.canvas_position_x, 
		SETTINGS.compass.canvas_position_y, 
		SETTINGS.compass.north, 
		SETTINGS.compass.angle
	);

	// zorne pole
	SETTINGS.field_vision.object = createFieldVision(
		SETTINGS.field_vision.width, 
		SETTINGS.field_vision.height, 
		SETTINGS.field_vision.canvas_position_x, 
		SETTINGS.field_vision.canvas_position_y, 
		SETTINGS.field_vision.angle, 
		SETTINGS.field_vision.shift
	); 

	// ovladaci prvky
	SETTINGS.video_controlls.object = createVideoControlls(
		SETTINGS.video_controlls.width,
		SETTINGS.video_controlls.height, 
		SETTINGS.video_controlls.canvas_position_x, 
		SETTINGS.video_controlls.canvas_position_y 
	) ;

	// obecne ovladaci prvky panoramatu
	SETTINGS.panorama_controlls.object = createPanoramaControlls(
		SETTINGS.panorama_controlls.width, 
		SETTINGS.panorama_controlls.height, 
		SETTINGS.panorama_controlls.canvas_position_x, 
		SETTINGS.panorama_controlls.canvas_position_y
	);

	// videostatus bar
	SETTINGS.video_status_bar.object = createVideoStatusBar(
		SETTINGS.video_status_bar.width,
		SETTINGS.video_status_bar.height,
		SETTINGS.video_status_bar.canvas_position_x,
		SETTINGS.video_status_bar.canvas_position_y,
		SETTINGS.input.video
	);

	// nastaveni nastrojoveho okna 
	settings_window(SETTINGS.panorama_controlls.btn.settings.show_window);

	// nastaveni okna titulku
	subtitles_window(SETTINGS.panorama_controlls.subtitles_box.active, '');
}


/**
 * Nastavuje potřebné proměnné programu, inicializuje webgl apod
 *
 *  v případě , že se vše povede vrací true a program pokračuje
 * @returns bool
 */
function initProgram() {

	// nastaveni modu geometrie
	var fisheye_or_equi_mode = null;
	if (SETTINGS.mode.equirectangular.panorama.active  || SETTINGS.mode.equirectangular.video.active) {
		fisheye_or_equi_mode = 0;
	}
	else if (SETTINGS.mode.fisheye.panorama.active || SETTINGS.mode.fisheye.video.active ) {
		fisheye_or_equi_mode = 1;
	}
 

	// init webgl
	PROG.canvas = document.querySelector("canvas");
	gl =  PROG.canvas.getContext("webgl") || PROG.canvas.getContext("experimental-webgl");
	if (!gl) {
		var notice = 'Webgl se nepodařilo inicializovat. Není podporováno. ';
		e(notice);
		createInfoScreen(notice, SETTINGS.info_screen.width,SETTINGS.info_screen.height);
		return false;
	}

	// kontrola vstupnic dat
	if ((SETTINGS.mode.equirectangular.video.active || SETTINGS.mode.fisheye.video.active) && !SETTINGS.input.video) {
		var notice = 'Video se nepodařilo načíst!';
		e(notice);
		createInfoScreen(notice, SETTINGS.info_screen.width,SETTINGS.info_screen.height);
		return false;
	}
	
	if ((SETTINGS.mode.equirectangular.panorama.active || SETTINGS.mode.fisheye.panorama.active) && !SETTINGS.input.image) {
		var notice = 'Panorama se nepdařilo načíst!';
		e(notice);
		createInfoScreen(notice, SETTINGS.info_screen.width,SETTINGS.info_screen.height);
		return false;
	}


	// nastaveni vychozich data platna
	SETTINGS.default.canvas.width = PROG.canvas.width;
	SETTINGS.default.canvas.height = PROG.canvas.height;


	// vypocet geometrie
	GEOMETRY = createSphereGeometry(
		SETTINGS.mode.fisheye.video.latitudes, 
		SETTINGS.mode.fisheye.video.longtitudes, 
		SETTINGS.mode.fisheye.video.radius, 
		fisheye_or_equi_mode
	);

	// incializace matic
	PROG.matrices.model.data = createIdentityMatrix4();
	PROG.matrices.view.data = createIdentityMatrix4();
	PROG.matrices.projection.data = createIdentityMatrix4();
	PROG.matrices.projection.fov = Math.PI/1.75;


	// zorne pole
	SETTINGS.field_vision.angle = radToDeg(PROG.matrices.projection.fov)*1.2;

	// ovladaci prvky
	SETTINGS.video_controlls.width = PROG.canvas.width/2;


	// definovani startovniho casu programu
	PROG.startTime = (new Date()).getTime();

	//loadJSONfile();

	// aktualizace obj. promennaych
	updateObjectVariables();

	return true;
}





// funkce pro zobrazeni nastrojoveho okna
function settings_window(active) {
	SETTINGS.panorama_controlls.btn.settings.show_window = active;

	// volani a aktualizace objektove promenne
	SETTINGS.panorama_controlls.btn.settings.object = createWindowSettings(
		SETTINGS.panorama_controlls.btn.settings.width, 
		SETTINGS.panorama_controlls.btn.settings.height, 
		SETTINGS.panorama_controlls.btn.settings.canvas_position_x, 
		SETTINGS.panorama_controlls.btn.settings.canvas_position_y, 
		SETTINGS.panorama_controlls.btn.settings.show_window
	);
}


// funkce pro zobrazeni nastrojoveho okna
function subtitles_window(active, text) {
	// volani a aktualizace objektove promenne
	SETTINGS.panorama_controlls.subtitles_box.active = active;
	SETTINGS.panorama_controlls.subtitles_box.object = createSubtitlesBox(
		SETTINGS.panorama_controlls.subtitles_box.width,
		SETTINGS.panorama_controlls.subtitles_box.height,
		SETTINGS.panorama_controlls.subtitles_box.canvas_position_x,
		SETTINGS.panorama_controlls.subtitles_box.canvas_position_y,
		SETTINGS.panorama_controlls.subtitles_box.active, 
		text
	);
}




/**
 * Zde se děje všecho nastavení programu
 *
 * 1.) nastavuje buffery
 * 2.) aktivuje JS listenery vsech vstupu
 * 3.) pripravy shader a projekci
 * 4.) vytvori/zpracuje texturu
 * @returns bool
 */
function setupProgram() 
{
	if (!initProgram()) {
		e('FATALNI CHYBA, nepodarilo se inicializovat program');
		createLoader(150, 150, 0.5, 0.5, 1, 1258) 
		createInfoScreen("FATALNI CHYBA, nepodarilo se inicializovat program", SETTINGS.info_screen.width,SETTINGS.info_screen.height);
		return false;
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////////// 
	//////////////////////////////////////  LISTENERY   ////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////// 

	PROG.canvas.addEventListener( 'mousemove', onDocumentMouseMove, false );
	PROG.canvas.addEventListener( 'mousedown', onDocumentMouseDown, false );
	PROG.canvas.addEventListener( 'mouseup',   onDocumentMouseUp,   false );

	// dotykova zařízení
	PROG.canvas.addEventListener( 'touchmove', onDocumentMouseMove, false );
	PROG.canvas.addEventListener( 'touchstart', onDocumentMouseDown, false );
	PROG.canvas.addEventListener( 'touchend',   onDocumentMouseUp,   false );

	// osetreni moznosti najeti do okna prohlizece (doslo by k chybe mysi)
	document.addEventListener( 'mouseout',  onDocumentMouseOut,  false );	// vsechny operace se provadi jen nad canvasem
	 
	// vyjimku tvori kompas a field vision
	var actions = [
		'mousemove', 
		'mousedown', 
		'mouseup', 
		'touchmove', 
		'touchstart', 
		'touchend'
	];
	var action_functions = [
		onDocumentMouseMove, 
		onDocumentMouseDown, 
		onDocumentMouseUp, 
		onDocumentMouseMove, 
		onDocumentMouseDown, 
		onDocumentMouseUp
	];

	// pridani vyjimek - aby se mys nesnimala po najeti na prvek pri posouvani v canvasu
	for (var i = 0; i < actions.length; i++) {
		// compass
		SETTINGS.compass.object.addEventListener( actions[i], action_functions[i], false );
		// zorne pole
		SETTINGS.field_vision.object.addEventListener( actions[i], action_functions[i], false );
		// panel ovladani panaromatu
		SETTINGS.panorama_controlls.object.controlls.addEventListener( actions[i], action_functions[i], false );
		// okno nastaveni
		SETTINGS.panorama_controlls.btn.settings.object.settings.addEventListener( actions[i], action_functions[i], false );
	};

	/*
		SETTINGS.compass.object.addEventListener( 'mousemove', onDocumentMouseMove, false );
		SETTINGS.compass.object.addEventListener( 'mousedown', onDocumentMouseDown, false );
		SETTINGS.compass.object.addEventListener( 'mouseup', onDocumentMouseUp, false );

		SETTINGS.field_vision.object.addEventListener( 'mousemove', onDocumentMouseMove, false );
		SETTINGS.field_vision.object.addEventListener( 'mousedown', onDocumentMouseDown, false );
		SETTINGS.field_vision.object.addEventListener( 'mouseup', onDocumentMouseUp, false );
	*/

	// ovládací prvky videa -> LISTETERY
	if ((SETTINGS.mode.equirectangular.video.active || SETTINGS.mode.fisheye.video.active)) 
	{
			// pri prejeti mysi nad prvekm se mys deaktivuje
			SETTINGS.video_controlls.object.controlls.addEventListener( 'mouseover',  onDocumentMouseOver,  false );	

			/// ======================= OVLADANI VIDEA ===========================================
			// lisnenery
			SETTINGS.video_controlls.object.btn.play.addEventListener("click", function() {

				if (SETTINGS.input.video.paused == true) {
					// Play the video
					SETTINGS.input.video.play();

					// Update the button text to 'Pause'
		 			SETTINGS.video_controlls.object.btn.play.setAttribute('class', 'pause_icon'); 
				} else {
					// Pause the video
					SETTINGS.input.video.pause();

					// Update the button text to 'Play'
		 			SETTINGS.video_controlls.object.btn.play.setAttribute('class', 'play_icon'); 
				}
			});


			//////// =============== primo nad videem =====================
			SETTINGS.input.video.addEventListener("timeupdate", function() {
		 		var value = (100 / SETTINGS.input.video.duration) * SETTINGS.input.video.currentTime;
		 		var timeLine = SETTINGS.input.video.currentTime;
				
				// korekce komapsu a tisk titulku se deje pouze pokud je prilozen JSON soubor
		 		if (CACHE.json_object) {

					// nejdriv je potreba vybrat pro jaky rezim videa se jedna
					var whichVideo = 0;
					var whichMode = 0;

					if (SETTINGS.mode.equirectangular.video.active) {
						whichVideo = getParamByKey("equiVM_json_key") ? getParamByKey("equiVM_json_key") : 0;
						whichMode =  CACHE.json_object.equirectangular.video[whichVideo];
					}

					if (SETTINGS.mode.fisheye.video.active) { 
						whichVideo = getParamByKey("fishVM_json_key") ? getParamByKey("fishVM_json_key") : 0;
						whichMode =  CACHE.json_object.fisheye.video[whichVideo];
					}

					// pokud jsou titulky aktivni
					if (SETTINGS.panorama_controlls.subtitles_box.active) 
					{

						//titulky ve scene
						if (whichMode && whichMode.titles) 
						{
							for (var i = 0; i < whichMode.titles.length; i++) 
							{

								var tit = whichMode.titles[i];
								if (timeLine>= tit.time/* && timeLine<= tit.time+tit.duration*/) 
								{
									// aktualizace objektu titulku
									subtitles_window(true, tit.text);
									SETTINGS.panorama_controlls.subtitles_box.current_subtitle = tit.text;
								}
							};
						}
					}

					//zmena kompasu ve scene
					if (whichMode.compass && whichMode.compass.correction) 
					{
						for (var i = 0; i < whichMode.compass.correction.length; i++) 
						{

							var com_angle = whichMode.compass.correction[i];
							if (timeLine>= com_angle.time ) 
							{
								//d(com_angle.time);
								//d(com_angle.angle);
								
								// aktualizace objektu compasu
								SETTINGS.compass.north = com_angle.angle;
								SETTINGS.compass.object = createCompass(
									SETTINGS.compass.width, 
									SETTINGS.compass.height, 
									SETTINGS.compass.canvas_position_x, 
									SETTINGS.compass.canvas_position_y, 
									SETTINGS.compass.north, 
									SETTINGS.compass.angle
								);

							}
						};
					}
				}


		 		SETTINGS.video_controlls.object.btn.slider.value = value;
		 		SETTINGS.video_status_bar.object.text.innerHTML = '<div>'+Math.round(SETTINGS.input.video.currentTime/SETTINGS.input.video.duration*100)+' %</div>';
		 		SETTINGS.video_status_bar.object.box.setAttribute('value', ''+SETTINGS.input.video.currentTime/SETTINGS.input.video.duration+'');
		 	});

			SETTINGS.input.video.addEventListener("ended", function() {
				SETTINGS.video_controlls.object.btn.play.setAttribute('class', 'play_icon'); 
		 	});


			// nacitani videa
			SETTINGS.input.video.addEventListener('progress', function() {
			    var range = 0;
			    var buffered = SETTINGS.input.video.buffered;
			    var time = this.currentTime;
			});


			//// ================================= PROGRAMOVE TLACITKA A SLIDERY ===== 
			// aktualizace casove osy videa
			SETTINGS.video_controlls.object.btn.slider.addEventListener("change", function() {
				var time = (SETTINGS.video_controlls.object.btn.slider.value / 100) *  SETTINGS.input.video.duration ;
				SETTINGS.input.video.currentTime = time;
			});


			// ovladani posunu videa
			SETTINGS.video_controlls.object.btn.slider.addEventListener("mousedown", function() {
				SETTINGS.input.video.pause();
				SETTINGS.video_controlls.object.btn.play.setAttribute('class', 'play_icon'); 
			});


			SETTINGS.video_controlls.object.btn.slider.addEventListener("mouseup", function() {
				SETTINGS.input.video.play();
				SETTINGS.video_controlls.object.btn.play.setAttribute('class', 'pause_icon'); 

			});

		 
			// ovladani hlasitosti
			SETTINGS.video_controlls.object.btn.volume_slider.addEventListener("change", function() {
				SETTINGS.input.video.volume = SETTINGS.video_controlls.object.btn.volume_slider.value;
			});
		 

			// zapnout/vypnout zvuk
			SETTINGS.video_controlls.object.btn.volume.addEventListener("click", function() {
				if (SETTINGS.input.video.muted) {
					SETTINGS.input.video.muted = false;
					SETTINGS.video_controlls.object.btn.volume.setAttribute('class', 'volume_on_icon'); 
				}
				else if (!SETTINGS.input.video.muted) {
					SETTINGS.input.video.muted = true;
					SETTINGS.video_controlls.object.btn.volume.setAttribute('class', 'volume_off_icon'); 
				}
			});



	}
	/// ======================= OVLADANI VIDEA, KONEC ===========================================

	/// ======================= OVLADANI PANORAMATU, zacatek ===========================================

		// fullscreen
		SETTINGS.panorama_controlls.object.btn.fullscreen.addEventListener('click', function() {
	 		// nastaveni ikon
			if (SETTINGS.panorama_controlls.object.btn.fullscreen.getAttribute('class') == 'fullscreen_icon'){
				SETTINGS.panorama_controlls.object.btn.fullscreen.setAttribute('class', 'normalscreen_icon');
				//fullscreen
				PROG.canvas.width =window.innerWidth;
				PROG.canvas.height = window.innerHeight;;
				gl.viewport(0, 0, PROG.canvas.width, PROG.canvas.height);
				resize();
			}
			else if (SETTINGS.panorama_controlls.object.btn.fullscreen.getAttribute('class') == 'normalscreen_icon'){
				SETTINGS.panorama_controlls.object.btn.fullscreen.setAttribute('class', 'fullscreen_icon');
				//normalscreen
				PROG.canvas.width = SETTINGS.default.canvas.width;
				PROG.canvas.height = SETTINGS.default.canvas.height;
				gl.viewport(0, 0, PROG.canvas.width, PROG.canvas.height);
				resize();
			}
		});


		// zoom_plus
		SETTINGS.panorama_controlls.object.btn.zoom_plus.addEventListener('click', function() {
			zoom_plus();
 		});

		// zoom_minus
		SETTINGS.panorama_controlls.object.btn.zoom_minus.addEventListener('click', function() {
			zoom_minus()

		});

		// settings
		SETTINGS.panorama_controlls.object.btn.settings.addEventListener('click', function() {
 			// nastaveni nastrojoveho okna 
			if (SETTINGS.panorama_controlls.btn.settings.show_window) {
				settings_window(0);
			}
			else {
				settings_window(1);
			}
		});

		// kliknuti na tlacitko nastaveni vyp/zap titulku
		SETTINGS.panorama_controlls.btn.settings.object.btn.subtit.addEventListener("click", function() {
			if (SETTINGS.panorama_controlls.subtitles_box.active) {
				subtitles_window(false, SETTINGS.panorama_controlls.subtitles_box.current_subtitle);
				SETTINGS.panorama_controlls.btn.settings.object.btn.subtit.setAttribute('class', 'window_settings_btn_inactive');
			}

			else {
				subtitles_window(true, SETTINGS.panorama_controlls.subtitles_box.current_subtitle);
				SETTINGS.panorama_controlls.btn.settings.object.btn.subtit.setAttribute('class', 'window_settings_btn_active');
			}
		});


	/// ======================= OVLADANI PANORAMATU, KONEC ===========================================



	// detekce aktivniho/nekativniho oka
	window.addEventListener('focus', playVideoWhenInactive);
	window.addEventListener('blur', pauseVideoWhenInactive);

	// kolecko a klavesnice
	// osetreni nepodporujici udalosti ze strany firefoxu
	var mouse_wheel_event = "mousewheel";
	if (/Firefox/i.test(navigator.userAgent)) {
		mouse_wheel_event = "DOMMouseScroll";
	}
	document.addEventListener(mouse_wheel_event, onDocumentMouseWheel, false);

	// klavesnice
	document.addEventListener("keypress", onDocumentKeyPress, false);
	//document.addEventListener("keydown", onDocumentKeyPress, false);
	window.addEventListener('resize', onWindowResize, true);

	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////  SHADERY  A PROGRAM  ///////////////////////////////////////// 
	//////////////////////////////////////////////////////////////////////////////////////////////////////

	// nacteni, zkompilovani a overeni vertext shaderu
	var str = document.querySelector("#vs").textContent;
	var vs = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vs, str);
	gl.compileShader(vs);
	var vertextSucces = gl.getShaderParameter(vs, gl.COMPILE_STATUS);
	if (!vertextSucces) {
		w('nepodařilo se zkompilovat VERTEX_SHADER');
		createInfoScreen("nepodařilo se zkompilovat VERTEX SHADER", SETTINGS.info_screen.width,SETTINGS.info_screen.height);
		//createLoader(150, 150, 0.5, 0.5, 1, 1258) ;
		return false;
	}
	
	// nacteni, zkompilovani a overeni fragment shaderu
	var str = document.querySelector("#fs").textContent;
	var fs = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fs, str);
	gl.compileShader(fs);
	var fragmentSucces = gl.getShaderParameter(fs, gl.COMPILE_STATUS);
	if (!fragmentSucces) {
		w('nepodařilo se zkompilovat FRAGMENT_SHADER');
		createInfoScreen("nepodařilo se zkompilovat FRAGMENT SHADER", SETTINGS.info_screen.width,SETTINGS.info_screen.height);
		createLoader(150, 150, 0.5, 0.5, 1, 1258) ;
		return false;
	}

	// vytvoreni programu, pridani vertex a fragment shaderu a overeni
	PROG.program = gl.createProgram();
	gl.attachShader(PROG.program, vs);
	gl.attachShader(PROG.program, fs);
	gl.linkProgram(PROG.program);
	gl.useProgram(PROG.program);
	var programSuccess = gl.getProgramParameter( PROG.program, gl.LINK_STATUS);
	if ( ! programSuccess) {
	  var info = gl.getProgramInfoLog(PROG.program);
	  createLoader(150, 150, 0.5, 0.5, 1, 1258) ;
	  w ('nepodařilo se zkompilovat WebGL PROG. \n\n' + info);
	  createInfoScreen("nepodařilo se zkompilovat WebGL PROG", SETTINGS.info_screen.width,SETTINGS.info_screen.height);
	  return false;
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////  MATICE   ////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////

	// -------- ZOBRAZOVACI matice
	// MODEL matrix

	scale(PROG.matrices.model.data, 1.0, 1.0, 1.0);
	translate(PROG.matrices.model.data, 0.0, 0.0, 0.0);

	// ---- otoceni kamery do pocatecni pozice
	// PRO equirectangular
	if (SETTINGS.mode.equirectangular.panorama.active || SETTINGS.mode.equirectangular.video.active) {
		rotateZ(PROG.matrices.model.data,   Math.PI/2);
		rotateX(PROG.matrices.model.data,   3/2*Math.PI);
		rotateY(PROG.matrices.model.data,   Math.PI );
	}
	// PRO fisheye
	else if (SETTINGS.mode.fisheye.panorama.active || SETTINGS.mode.fisheye.video.active){
		rotateZ(PROG.matrices.model.data,   Math.PI/2);
		rotateX(PROG.matrices.model.data,   2*Math.PI );
		rotateY(PROG.matrices.model.data,   2*Math.PI );
	}



	// DEBUG===========================================
	if (getParamByKey("angleX")) {
		rotateX(PROG.matrices.model.data,    Math.PI * getParamByKey("angleX") );
	}

	if (getParamByKey("angleZ")) {
		rotateZ(PROG.matrices.model.data,    Math.PI * getParamByKey("angleZ") );
	}

	if (getParamByKey("angleY")) {
		rotateY(PROG.matrices.model.data,    Math.PI * getParamByKey("angleY") );
	}

	// VIEW matrix
	if (getParamByKey("camera")) {
		translate(PROG.matrices.model.data,  0, 0, getParamByKey("camera"));
	}
	// DEBUG===========================================, konec


	// perspektivni matice
	// zorny uhel je 90%, pomer je jasnej
	PROG.matrices.projection.data = createPerspectiveMatrix(PROG.matrices.projection.fov, PROG.canvas.width/PROG.canvas.height, 0.1, 100);

	// ------ nahrani matic do promennych ==============================================================
	PROG.matrices.model.link = gl.getUniformLocation(PROG.program, "M_Matrix");
	gl.uniformMatrix4fv(PROG.matrices.model.link, false, PROG.matrices.model.data);

	PROG.matrices.view.link = gl.getUniformLocation(PROG.program, "V_Matrix");
	gl.uniformMatrix4fv(PROG.matrices.view.link, false, PROG.matrices.model.data);

	PROG.matrices.projection.link = gl.getUniformLocation(PROG.program, "P_Matrix");
	gl.uniformMatrix4fv(PROG.matrices.projection.link, false, PROG.matrices.projection.data);

	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////  ATRIBUTY A SAMPLER   ///////////////////////////////////////// 
	//////////////////////////////////////////////////////////////////////////////////////////////////////

	// sampler
	PROG.sampler = gl.getUniformLocation(PROG.program, "sampler");
	gl.uniform1i(PROG.sampler, 0);


	// -------- atributy
	PROG.attributes.vertex = gl.getAttribLocation(PROG.program, "pos");
	if (PROG.attributes.vertex===-1) w('Nebyl nalezen atribut "pos" ve vertex shaderu');
	gl.enableVertexAttribArray(PROG.attributes.vertex);

	PROG.attributes.fragment = gl.getAttribLocation(PROG.program, "fragPos");
	if (PROG.attributes.fragment==-1) w('Nebyl nalezen atribut "fragPos" ve vertex shaderu');
	gl.enableVertexAttribArray(PROG.attributes.fragment);

	PROG.attributes.texture = gl.getAttribLocation(PROG.program, "texture");
	if (PROG.attributes.texture==-1) w('Nebyl nalezen atribut "texture" ve vertex shaderu');
	gl.enableVertexAttribArray(PROG.attributes.texture);

	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////  BUFFER   ////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////

	// -------- BUFFERY
	PROG.buffer.vertex = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, PROG.buffer.vertex);
	gl.bufferData(gl.ARRAY_BUFFER, (GEOMETRY.vertices), gl.STATIC_DRAW);
	gl.vertexAttribPointer(PROG.attributes.vertex, 3, gl.FLOAT, false, 0, 0);
	
	PROG.buffer.normal = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, PROG.buffer.normal);
	gl.bufferData(gl.ARRAY_BUFFER, (GEOMETRY.normals), gl.STATIC_DRAW);
	gl.vertexAttribPointer(PROG.attributes.fragment, 3, gl.FLOAT, false, 0, 0);

	PROG.buffer.texture = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, PROG.buffer.texture);
	gl.bufferData(gl.ARRAY_BUFFER, (GEOMETRY.textures), gl.STATIC_DRAW);
	gl.vertexAttribPointer(PROG.attributes.texture, 2, gl.FLOAT, false, 0, 0);

	PROG.buffer.index = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, PROG.buffer.index);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, (GEOMETRY.indices), gl.STATIC_DRAW);

	// ---- NASTAVENI
	//gl.disable(gl.DEPTH_TEST);
	gl.enable(gl.DEPTH_TEST);
	//gl.clearColor(0, 0, 0, 1);

	 //gl.enable(gl.BLEND);
	//gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	// prednasobeni alfa kanalu ještě než se nahraje textura -> zrychli to zpracování
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
	//gl.viewport(0, 0, PROG.canvas.width, PROG.canvas.height);

	/////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////  TEXTURA   ////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////////////////////////////

	// ----- VYTVORENI TEXTURY
	PROG.texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, PROG.texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.bindTexture(gl.TEXTURE_2D, null);


	// mapovani OBRAZKU =======================================
	// MUSI BYT TADY, protoze textura se narozdil od videa neaktualizuje
	// equirectangular
	if (SETTINGS.mode.equirectangular.panorama.active || SETTINGS.mode.fisheye.panorama.active) 
	{
		createLoader(150, 150, 0.5, 0.5, 1, 1258) ;
		if (imgLoaded){
			createLoader(150, 150, 0.5, 0.5, 0, 1258) ;
			gl.bindTexture(gl.TEXTURE_2D, PROG.texture);
			if (SETTINGS.mode.equirectangular.panorama.active) {
				//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			}
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, SETTINGS.input.image);
		}
		else {
			w('obrazek se nepodarilo uspesne nacist');
			return false;
		}
	}

	return true;
}

// aktualizace textury v pripade videa
function updateTexture() 
{
	// plati pouze pro video
	if (SETTINGS.mode.fisheye.video.active || SETTINGS.mode.equirectangular.video.active) 
	{
		if (SETTINGS.input.video.readyState >= SETTINGS.input.video.HAVE_CURRENT_DATA) 
		{
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, PROG.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB,gl.UNSIGNED_BYTE, SETTINGS.input.video);
			gl.bindTexture(gl.TEXTURE_2D, null);
			createLoader(150, 150, 0.5, 0.5, 0, 1258) ;
			return true;
		}

		if (SETTINGS.input.video.readyState < SETTINGS.input.video.HAVE_CURRENT_DATA) 
		{
			console.log('video se nacita...');
			createLoader(150, 150, 0.5, 0.5, 1, 1258) ;
			return false;

		}
	}
	else {
		// pro všechny ostatni případy je true
		return true;
	}
}


function initViewMatrix() {
	
	/// ROTACNI MATICE pomoci MYSI
	var atr = 0;
	makeIdentityFrom(PROG.matrices.view.data );
	translate(PROG.matrices.view.data,0, 0, atr);
}

// otoci kamerou ve scene
function updateCameraPosition() {
	/// ROTACe MATICE pomoci MYSi a klavesnice
	translate(PROG.matrices.view.data,0, 0, MOUSE.wheel.delta);
	rotateY( PROG.matrices.view.data, MOUSE.move.angle.y);
	rotateX( PROG.matrices.view.data, MOUSE.move.angle.x);
	
}

function getCameraPosition() {
	return PROG.matrices.view.data[14];
}

// prehravani/zastaveni videoa pri aktivnim/neaktivnim okne
function pauseVideoWhenInactive() {
	if (SETTINGS.mode.fisheye.video.active || SETTINGS.mode.equirectangular.video.active)  {
		if (SETTINGS.input.video.paused == false) {
			SETTINGS.video_controlls.user_inactive = true;
			SETTINGS.input.video.pause();
			SETTINGS.video_controlls.object.btn.play.setAttribute('class', 'play_icon'); 
		} else {
			SETTINGS.video_controlls.user_inactive = false;
		}
	}
}

function playVideoWhenInactive() {
	if (SETTINGS.mode.fisheye.video.active || SETTINGS.mode.equirectangular.video.active)  {
		if (SETTINGS.video_controlls.user_inactive == true && SETTINGS.input.video.paused == true) {
			SETTINGS.input.video.play();
			SETTINGS.video_controlls.object.btn.play.setAttribute('class', 'pause_icon'); 
			SETTINGS.video_controlls.user_inactive == false
		}
	}
}

/**
 * Vykreslovací funkce volána pomocí requestAnimationFrame(), čímž vytváří animační smyčku
 *
 * 1.) nahrava data matic do paměti
 * 2.) renderuje pomoci drawArray/drawElement podle vstupniho modu
 */
function render(time) {
	// METADATa PRO VIDEO VIDEO
	// status bar a cas
	if (SETTINGS.mode.fisheye.video.active  || SETTINGS.mode.equirectangular.video.active) {
		var elem = document.getElementById("data").innerHTML = 'Čas: '+SETTINGS.input.video.currentTime;
	}
		
 	var shift = (MOUSE.move.angle.y * (180/Math.PI))%360 ;

	// kompas
	SETTINGS.compass.angle = shift;

	SETTINGS.compass.object = createCompass(
		SETTINGS.compass.width, 
		SETTINGS.compass.height, 
		SETTINGS.compass.canvas_position_x, 
		SETTINGS.compass.canvas_position_y, 
		SETTINGS.compass.north, 
		SETTINGS.compass.angle
	);

	// aktualizace textury
	if (updateTexture()) 
	{
		// inicializace zobrazovaci matice
		initViewMatrix();

 		// vylepseni mysi, TO DO
		var delay = 700;
		if ((new Date()).getTime() < PROG.time+delay) {
	 		
			//MOUSE.move.angle.y *= MOUSE.amort;

			//MOUSE.move.angle.x *= MOUSE.amort;
			if (MOUSE.amort >= 1.001) {
				MOUSE.amort =  MOUSE.amort - 0.001;
			}
		}

		// scena je rozlisena i o titulky ve scene v panoramatech
		if (SETTINGS.mode.equirectangular.panorama.active || SETTINGS.mode.fisheye.panorama.active)  
		{
	 		if (SETTINGS.panorama_controlls.subtitles_box.active) 
	 		{
				var whichVideo = 0;
				var whichMode = 0;

				if (SETTINGS.mode.equirectangular.panorama.active) {
					whichVideo = getParamByKey("equiPM_json_key") ? getParamByKey("equiPM_json_key") : 0;
					whichMode =  CACHE.json_object.equirectangular.panorama[whichVideo];
				}

				if (SETTINGS.mode.fisheye.panorama.active) { 
					whichVideo = getParamByKey("fishPM_json_key") ? getParamByKey("fishPM_json_key") : 0;
					whichMode =  CACHE.json_object.fisheye.panorama[whichVideo];
				}


				//titulky ve scene
				for (var i = 0; i < whichMode.titles.length; i++) 
				{
					var tit = whichMode.titles[i];
					var timeLine =  parseInt(((new Date()).getTime() - PROG.startTime)/1000);
					if (timeLine>= tit.time && timeLine<= tit.time+tit.duration) 
					{
						// aktualizace objektu titulku
						subtitles_window(true, tit.text);
						SETTINGS.panorama_controlls.subtitles_box.current_subtitle = tit.text;
					}
				};
	 		}
		}


		// zmena pozice zobrazeni
		updateCameraPosition();

		// nahrani matic do programu
		gl.uniformMatrix4fv(PROG.matrices.projection.link, false, PROG.matrices.projection.data);
		gl.uniformMatrix4fv(PROG.matrices.view.link, false, PROG.matrices.view.data);
		gl.uniformMatrix4fv(PROG.matrices.model.link, false, PROG.matrices.model.data);


		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, PROG.texture);
		gl.uniform1i(PROG.sampler, 0);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		//gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, PROG.buffer.index);

		// zde prepinanim renderovani
		if (!GEOMETRY.noIndices) {
			// renderuje se equirectangularni zobrazeni, takze muzu pouzit indexy
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, PROG.buffer.index);
			gl.drawElements(gl.TRIANGLES, GEOMETRY.indices.length, gl.UNSIGNED_SHORT, 0);
		}
		else {

			gl.bindBuffer(gl.ARRAY_BUFFER, PROG.buffer.vertex);
			gl.drawArrays(gl.TRIANGLES,0, GEOMETRY.normals.length/3);
		}
	}
	requestAnimationFrame(render);
}



/**
 * Olvadání kolečkem
 *
 * Mimo kolečka zastřešuje take zorny uhel
 */
function onDocumentMouseWheel( event ) {
	var newDelta = 0;
	if (event.wheelDeltaY) {
	// WebKit
	newDelta +=event.wheelDeltaY;
	}
	else if (event.wheelDelta) {
	// Opera / Explorer 9
	newDelta += event.wheelDelta;
	}
	else if (event.detail) {
	// Firefox
		newDelta  += event.detail * (-1);
	}

	// meze kolecka
	var reduction = (MOUSE.wheel.reduction > 1.0) ? MOUSE.wheel.reduction : 1.0;
	MOUSE.wheel.deltaMax = (SETTINGS.mode.fisheye.video.radius-2*MOUSE.wheel.sensitivity)/reduction;
	MOUSE.wheel.deltaMin = -MOUSE.wheel.deltaMax;

	// je pozitivni
	if (newDelta>0) 
	{ 	
		zoom_plus();
	}
	else {
		zoom_minus();
	}



  	/*
	*	RESENI zorneho uhlu:
	*
	*	uhel nabyva hodnot: 0° - (2*a), kde a = uhel perspektivniho zobrazeni
	*	velikost  polomeru koule, ktera se zmensuje koleckem, je dana promennou: radius, takze prumer: d = 2*radius; // radius v zakladu je 7
	*
	*	pohyb kamery tedy bude napriklad na intervalu: (0, 14) maximalne: <2,12>, takze pohyb kamery v rozmezi <0,1> tj 0-100% musi byt ponizen o orez!!!
	*
	*
 	*/

	// zorny uhel
	var perspAngle = radToDeg(PROG.matrices.projection.fov); // uhel kamery, je dan staticky
	var maxAngleNotInView = perspAngle * 2;	// pocita se ze stredu


	var radiusDistance = 2*SETTINGS.mode.fisheye.video.radius; radiusDistance
 	var delta = (radiusDistance - ((radiusDistance)/MOUSE.wheel.reduction))/2;
	 

 	var mouse_move = (1-(MOUSE.wheel.delta + MOUSE.wheel.deltaMax)/(MOUSE.wheel.deltaMax * 2));
  	SETTINGS.field_vision.angle =  (delta/10*maxAngleNotInView) + maxAngleNotInView*mouse_move*(1-delta/10);


	// aktualizace zorneho pole
 	createFieldVision(
 		SETTINGS.field_vision.width, 
 		SETTINGS.field_vision.height, 
 		SETTINGS.field_vision.canvas_position_x, 
 		SETTINGS.field_vision.canvas_position_y,  
 		SETTINGS.field_vision.angle, 
 		SETTINGS.field_vision.shift
 	);


}


// osetreni mysi a metadat
// v pripade ze mys najede na nejaky html prvek, protoze je platno prekryto, bude sestale snimat mys -> problem nastane v momente kdy mysi pri tahu vyjedeme z canvasu
// nedojde tak k preruseni funkce mysi a po navratu do canvasu staůe funguje snimani a nacitani mysi, coz pusobi rusive
function onDocumentMouseOut( event ) {
 	if (MOUSE.active && !MOUSE.interrupt) {
	    checkEvent = event ? event : window.event;
	    var who = checkEvent.relatedTarget || checkEvent.toElement;
	    if (who.nodeName == "HTML" || !who ) {
	        MOUSE.active = false;
	        d('mys opustila okno');
	    }
	}
}

function onDocumentMouseOver( event ) {
	if (MOUSE.active && !MOUSE.interrupt) {
		MOUSE.active = false;
	}
}

function onDocumentMouseUp( event ) {
	MOUSE.active = false;
	var date = new Date();
	PROG.time = date.getTime();
	MOUSE.amort = 1.02;
}


function onDocumentMouseDown( event ) {
	// podpora dotykovyým zařízením
	if (event.type=='touchstart') {
		event.pageX = event.changedTouches[0].pageX;
		event.pageY = event.changedTouches[0].pageY;
	}

	MOUSE.active = true;
	MOUSE.down.x = event.pageX;
	MOUSE.down.y = event.pageY;
	event.preventDefault();
	return false;
}

/**
 * Pohyb mysi
 *
 * Jakmile je mys aktivni, a bude sniman vstup, zacne nacitat dat do globalni obj. promenne
 */
function onDocumentMouseMove( event ) {
	if (MOUSE.active && !MOUSE.interrupt) 
	{
		// podpora dotykovyým zařízením
		if (event.type=='touchmove') {
			event.pageX = event.changedTouches[0].pageX;
			event.pageY = event.changedTouches[0].pageY;
		}

 		// zastavi mys pred vyjetim z canvasu
		if (event.pageX >= (PROG.canvas.width-10) || event.pageY >= (PROG.canvas.height-10)) {
			MOUSE.active = false;
			return false;
		}
 
		MOUSE.move.x = (event.pageX - MOUSE.down.x)*2*Math.PI/PROG.canvas.width,
		MOUSE.move.y = (event.pageY - MOUSE.down.y)*2*Math.PI/PROG.canvas.height;
		MOUSE.move.angle.y+= MOUSE.move.x;
		MOUSE.move.angle.x+=MOUSE.move.y;

		MOUSE.move.angle.y = MOUSE.move.angle.y % (Math.PI*2);
		MOUSE.move.angle.x	= MOUSE.move.angle.x % (Math.PI*2);

		// osetreni pohybu vic jak +-90 pro vertikalni osu
		if (MOUSE.move.angle.x  >= Math.PI/2) {
			MOUSE.move.angle.x = Math.PI/2 - MOUSE.move.x;
		}
		else if (MOUSE.move.angle.x  <= -Math.PI/2) {
			MOUSE.move.angle.x = -Math.PI/2 + MOUSE.move.x;
		}




		MOUSE.down.x = event.pageX; 
		MOUSE.down.y = event.pageY;
		event.preventDefault();
	}
}


/**
 * Pribložení scény
 *
 *  Mění globální obj. proměnnou pro kolečko
 */
function zoom_plus() {
	var reduction = (MOUSE.wheel.reduction > 1.0) ? MOUSE.wheel.reduction : 1.0;
	MOUSE.wheel.deltaMax = (SETTINGS.mode.fisheye.video.radius-2*MOUSE.wheel.sensitivity)/reduction;
	MOUSE.wheel.deltaMin = -MOUSE.wheel.deltaMax;
	if (Math.abs(MOUSE.wheel.delta) < MOUSE.wheel.deltaMax) 
	{
		MOUSE.wheel.delta+=MOUSE.wheel.sensitivity;
	}
	else 
	{
		if (MOUSE.wheel.delta>0) {
			MOUSE.wheel.delta-=MOUSE.wheel.sensitivity;
		}
		else {
			MOUSE.wheel.delta+=MOUSE.wheel.sensitivity;
		}
	}
}

/**
 * Oddálení scény
 *
 *  Mění globální obj. proměnnou pro kolečko
 */
function zoom_minus() {
	var reduction = (MOUSE.wheel.reduction > 1.0) ? MOUSE.wheel.reduction : 1.0;
	MOUSE.wheel.deltaMax = (SETTINGS.mode.fisheye.video.radius-2*MOUSE.wheel.sensitivity)/reduction;
	MOUSE.wheel.deltaMin = -MOUSE.wheel.deltaMax;

	if (Math.abs(MOUSE.wheel.delta) < MOUSE.wheel.deltaMax) 
	{
		MOUSE.wheel.delta-=MOUSE.wheel.sensitivity;
	}
	else 
	{
		if (MOUSE.wheel.delta>0) {
			MOUSE.wheel.delta-=MOUSE.wheel.sensitivity;
		}
		else {
			MOUSE.wheel.delta+=MOUSE.wheel.sensitivity;
		}
	}
}



/**
 * Obstarává zpracování vstupu klavesnice
 *
 *  Mění globální obj. proměnnou pro klávesnici
 */
function onDocumentKeyPress( event ) {
	if (KEYBOARD.active) 
	{
		// FUNKCE VIDEA
		if (SETTINGS.mode.fisheye.video.active || SETTINGS.mode.equirectangular.video.active)  
		{
			// sputeni videa
			if (event.keyCode == 113 || event.keyCode == 81) { // q/Q
				log('video: play');
	 			SETTINGS.input.video.play();
			}

			// zastaveni videa
			if (event.keyCode == 101 || event.keyCode == 69) { // e/E
				log('video: pause');
				SETTINGS.input.video.pause();
	 		}

			// start/stop pomoci mezerniku
			if (event.keyCode === 0 || event.keyCode === 32) {
				if (SETTINGS.input.video.paused == true) {
					log('video: play');
					SETTINGS.input.video.play();
					SETTINGS.video_controlls.object.btn.play.setAttribute('class', 'pause_icon'); 
				} else {
					log('video: pause');
					SETTINGS.input.video.pause();
					SETTINGS.video_controlls.object.btn.play.setAttribute('class', 'play_icon'); 
				}
			}
		}


		// pohyb pozorovatele
		if (event.keyCode == 97  ||  event.keyCode==97-32 ) { // a/A
			MOUSE.move.angle.y += KEYBOARD.sensitivity.x;
		}
		else if (event.keyCode == 100    ||  event.keyCode==100-32) {  // d/D
			MOUSE.move.angle.y -= KEYBOARD.sensitivity.x;
		}

		else if (event.keyCode == 119 ||   event.keyCode == 119-32 ) {  // w/W
			MOUSE.move.angle.x -=  KEYBOARD.sensitivity.y;
		}
		else if (event.keyCode == 115 ||    event.keyCode == 115-32) {  //	s/S
			MOUSE.move.angle.x +=  KEYBOARD.sensitivity.y;
		}



		// osetreni mezi kolecka
		var reduction = (MOUSE.wheel.reduction > 1.0) ? MOUSE.wheel.reduction : 1.0;
 		if (event.keyCode == 43 ) {//	+
 			zoom_plus()
		}
		
		if (event.keyCode == 45  ) {//	-
			zoom_minus()
		}
	}
}

function setFishVideoMode() {
	SETTINGS.mode.fisheye.video.active 				= true;
	SETTINGS.mode.fisheye.panorama.active 			= false;
	SETTINGS.mode.equirectangular.panorama.active 	= false;
	SETTINGS.mode.equirectangular.video.active 		= false;
}

function setEquiVideoMode() {
	SETTINGS.mode.fisheye.video.active 				= false;
	SETTINGS.mode.fisheye.panorama.active 			= false;
	SETTINGS.mode.equirectangular.panorama.active 	= false;
	SETTINGS.mode.equirectangular.video.active 		= true;
}

function setFishPanoMode() {
	SETTINGS.mode.fisheye.video.active 				= false;
	SETTINGS.mode.fisheye.panorama.active 			= true;
	SETTINGS.mode.equirectangular.panorama.active 	= false;
	SETTINGS.mode.equirectangular.video.active 		= false;
}

function setEquiPanoMode() {
	SETTINGS.mode.fisheye.video.active 				= false;
	SETTINGS.mode.fisheye.panorama.active 			= false;
	SETTINGS.mode.equirectangular.panorama.active 	= true;
	SETTINGS.mode.equirectangular.video.active 		= false;
}

function onWindowResize( event ) {

	var element_canvas = document.querySelector("canvas");
	if (element_canvas ) 
	{ // blocked
		if (
			(window.innerWidth < element_canvas.width || window.innerHeight < element_canvas.height) || 
			(window.innerWidth >= element_canvas.width && SETTINGS.default.canvas.resize)) 
		{
			element_canvas.width = window.innerWidth;
			element_canvas.height = window.innerHeight;
			gl.viewport(0, 0, element_canvas.width, element_canvas.height);
	  		resize() ;
	  		SETTINGS.default.canvas.resize = true;
		}
	}
}

function resize() {
	updateObjectVariables();
}

/**
 * Hlavní funkce
 *
 */
function main() 
{

	if (PROG.fatal_error) {
		e('Doslo k chybe... PROGRAM se ukonci ');
		return false;
	}
	//if (!SETTINGS.input.video)  return false;

	if (!initProgram()) {
		return false;
	}

	if (!setupProgram()) {
		return false;
	}

	render(0);
 


	if (SETTINGS.input.video) {
		SETTINGS.input.video.addEventListener("loadedmetadata",function() { 
			this.currentTime = (getParamByKey("time") ? getParamByKey("time") : 0) ;
		},false);
	}
}


