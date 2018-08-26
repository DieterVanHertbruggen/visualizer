
var sourceJs;
var analyser;
var context ;
var source = null;
var audioBuffer = null;

// initalisatie
try {
	if(typeof webkitAudioContext === 'function' || 'webkitAudioContext' in window) {
		context = new webkitAudioContext();
	     }
	else {
		context = new AudioContext();
	     }
    }
catch(e) {
	$('#info').text('Web Audio API is not supported in this browser');
    }


function stopSound() {
  // stopt de muziekbestand
	console.log ("stopsound");
  if (source) {
      source.stop(0);

  }
}

function playSound() {
  // start de muziek
	// en berekend de grootte  van de kubussen door nalyse op de muziek
	console.log ("stopsound");
  document.getElementById("stopsound").disabled=false;
	sourceJs = context.createScriptProcessor(2048, 1, 1);
	sourceJs.buffer = audioBuffer;
	sourceJs.connect(context.destination);
	analyser = context.createAnalyser();
	analyser.smoothingTimeConstant = 0.6;
	analyser.fftSize = 512;
	source = context.createBufferSource();
	source.buffer = audioBuffer;
	source.loop = true;
	source.connect(analyser);
	analyser.connect(sourceJs);
	source.connect(context.destination);


	sourceJs.onaudioprocess = function(e) {
		array = new Uint8Array(analyser.frequencyBinCount);

		analyser.getByteFrequencyData(array);
		boost = 0;
		for (var i = 0; i < array.length; i++) {
						boost += array[i];
				}
				boost = boost / array.length;
    		console.log ("boost"+ boost); 
	  };


	  source.start(0); // Play immediately.
		beforesong=false;
    }


function initSound(arrayBuffer) {
  context.decodeAudioData(arrayBuffer, function(buffer) {
    audioBuffer = buffer;
  }, function(e) {
    console.log('Error decoding file', e);
  });
}

// User selects file, read it as an ArrayBuffer and pass to the API.
var fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', function(e) {
  var reader = new FileReader();
  reader.onload = function(e) {
    initSound(this.result);
  };
  reader.readAsArrayBuffer(this.files[0]);
}, false);
