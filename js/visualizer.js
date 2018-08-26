var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50, $(window).width() / $(window).height(), 1, 1000);
var renderer = new THREE.WebGLRenderer();
var cubes = new Array();
var controls;
var beforesong = true;                                             // of er al een muziekbestand werd ingelezen
var array = new Array();
var boost = 0;
var capturer = new CCapture( { format: 'webm' , framerate: 60 } ); // definieert de recording
var aantalbalken=10;                                               // max aantal balken per rij en kolom
var captureongoing;

captureongoing=false;

document.body.appendChild(renderer.domElement);

// de 10 op 10 kubussen worden hier geinitialiseerd
for(var i = 0; i < aantalbalken; i += 1) {
	// 10 balken en 10 lege plaatsen
	cubes[i] = new Array();
	for(var j = 0; j < aantalbalken; j += 1) {
    // grootte
   //console.log(y);
		var geometry = new THREE.CubeGeometry(1.5, 1.5, 1.5);
		var material = new THREE.MeshPhongMaterial({
			color: randomFairColor(),     //random kleur
    	ambient: 0x808080,
			specular: 0xffffff,
			shininess: 20,
			reflectivity: 5.5
		});
		cubes[i][j] = new THREE.Mesh(geometry, material);
		cubes[i][j].position = new THREE.Vector3(i*2, j*2, 1.5);
		scene.add(cubes[i][j]);
	}
}

var light = new THREE.AmbientLight(0x505050);
scene.add(light);

// licht langs alle kanten
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);


directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0, -1, -1);
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(-1, -1, 0);
scene.add(directionalLight);

camera.position.z = 50;

controls = new THREE.OrbitControls(camera);
controls.addEventListener('change', render);

for(var i = 0; i < rows.value/2; i++) {
	//controls.pan(new THREE.Vector3( 0, 0, 0 ));
	controls.pan(new THREE.Vector3( 1, 0, 0 ));
}

var render = function () {
  // zet de cubes op de juiste grootte
  //console.log("render" +rows.value+"  "+columns.value +" k" +array.length );
	  maxarray=0;
    for(var i = 0; i < array.length; i++) {
			  if (array[i]+boost >maxarray) {
					 maxarray=array[i]+boost;
				}
			}
			if (maxarray==0){
				maxarray=1;
			}
		var k = 0;
		for(var i = 0; i < cubes.length; i++) {
			for(var j = 0; j < cubes[i].length; j++) {
				// verwijderen van rijen en kolommen die we niet willen zien
				if (i>=rows.value || j>=columns.value) {
				   cubes[i][j].scale.z =0;
				   cubes[i][j].scale.x =0;
				   cubes[i][j].scale.y =0;
				   }
				else{
					if (beforesong)
					// in het begin gewoon een vierkant
	 			  {		   cubes[i][j].scale.z =scalez.value;
	 							 cubes[i][j].scale.x =scalexy.value/7;
	 							 cubes[i][j].scale.y =scalexy.value/7;
	 			  }
	 			 else { // schaal aanappsen  , voor x-y  kleiner dan Z
        	 			var scale = (array[k] + boost)/maxarray * scalez.value;
	 			        var scale2 = (array[k] + boost)/maxarray * scalexy.value/7;
					      // x en y scale kleiner dan 1 zetten
                 cubes[i][j].scale.x =scale2;
                 cubes[i][j].scale.y = scale2;
                 cubes[i][j].scale.z = scale;

					      //cubes[i][j].scale.x =(scale2 < 5 ? scale2 : 5);
					      //cubes[i][j].scale.y =(scale2 < 5 ? scale2 : 5);
						    // Z scale groter dan 10
 	               //cubes[i][j].scale.z = (scale > 10 ? 10 : scale);
				        //loop de array af tot je op het einde bent daarna terug vanaf begin
				        k += (k+1 < array.length ? 1 : 0);
							}
		    	}
			}
		}


			requestAnimationFrame(render);
			controls.update();
			renderer.render(scene, camera);


	if ( captureongoing){
			capturer.capture( renderer.domElement );
	}
};

render();
renderer.setSize($(window).width(), $(window).height());

function randomFairColor() {
	var min = 64;
	var max = 224;
	var r = (Math.floor(Math.random() * (max - min + 1)) + min) * 65536;
	var g = (Math.floor(Math.random() * (max - min + 1)) + min) * 256;
	var b = (Math.floor(Math.random() * (max - min + 1)) + min);
	return r + g + b;
}

function rowChange(val){
	 // het aantal zichtbare rijen moet worden aangepast
	 console.log("rowchange" );
	 rowValue.innerHTML = "("+val+")";
	 render();
}
function colChange(val){
	 // het aantal zichtbare kolommen moet worden aangepast
	 console.log("colchange" );
	 columnValue.innerHTML = "("+val+")";
	 render();
}

function scalexychange(val){
	 // veranderen schaal xy
	 console.log("scalexychange" );
	 scalexylabel.innerHTML = "("+val+")";
	 render();
}
function scalezchange(val){
	 // veranderen schaal xy
	 console.log("scalezchange" );
	 scalezlabel.innerHTML = "("+val+")";
	 render();
}
function rotationspeedchange(val){
	 // veranderen schaal xy
	 console.log("rotationspeed:" + val);
	 rotationspeedlabel.innerHTML = "("+val+")";
	 THREE.OrbitControls.autoRotateSpeed = val;
	 render();
}


function favcolorChange(){
	// een vaste kleur werd gekozen
	  console.log("favcolorChange" );
		val=favcolor.value;
	 	for(var i = 0; i < aantalbalken; i += 1) {
			for(var j = 0; j < aantalbalken; j += 1) {
			 //console.log( "kleur" + val);
			 cubes[i][j].material.color.setHex(val.replace( '#', '0x' ));
		    }
		  }
			// radio button op fixed zetten
			document.getElementById("fixed").checked = true;
	}

	function favcolorChangeRandom(){
		// een varianle kleur werd gekozen
		 console.log("favcolorChangeRandom" );
		 	for(var i = 0; i < aantalbalken; i += 1) {
				for(var j = 0; j < aantalbalken; j += 1)
			     {	 val2='#'+(Math.random()*0xFFFFFF<<0).toString(16);
				       cubes[i][j].material.color.setHex(val2.replace( '#', '0x' ));
			     }
		     }
}
function enableplaysound(){
  // zet de knop playsound  terug zichtbaar
	console.log("enableplaysound" );
	document.getElementById("playsound").disabled=false;

}
function startRecording(){
	  // start de recording
	  console.log("startrecording" );
		captureongoing=true;
		capturer.start();
		document.getElementById("stopcapturing").disabled=false;
	};

function stopRecording(){
	// stopt de recording en bewaart de file
	console.log("stopttrecording" );
	capturer.stop();
	capturer.save();
 captureongoing=false;
} ;
