var aCon = document.querySelector('#aCon');
var canvas = document.querySelector('#canvas');


var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
setTimeout(function(){
	if( audioCtx ){
		startCanvas();
	}else{
		aCon.style.display = 'none';
	}
},0);







function startCanvas(){

	window.requestAnimationFrame = (function(){
		return 	window.requestAnimationFrame
			|| 	window.webkitRequestAnimationFrame
			|| 	window.mozRequestAnimationFrame
			|| 	window.oRequestAnimationFrame
			|| 	window.msRequestAnimationFrame
			//|| 	function(cb){window.setTimeout(cb,1000/60);}
			;
	})();
	var cWidth,cHeight;
	var canvasCtx = canvas.getContext('2d');



	var analyser = audioCtx.createAnalyser();
	analyser.smoothingTimeConstant = 0.9;

	var freqBins;
	var barWidth;
	var freqDataArray;



	canvasResize();
	if( cWidth<481 ){
		analyser.fftSize = 256;
		freqBins = analyser.frequencyBinCount-50;
	}else
	if( cWidth<801 ){
		analyser.fftSize = 512;
		freqBins = analyser.frequencyBinCount-100;
	}else
	if( cWidth<1290 ){
		analyser.fftSize = 1024;
		freqBins = analyser.frequencyBinCount-200;
	}else
	if( 1290<cWidth ){
		analyser.fftSize = 2048;
		freqBins = analyser.frequencyBinCount-400;
	}
	freqDataArray = new Uint8Array(freqBins);
	analyser.getByteFrequencyData(freqDataArray);
	canvasResize();



	function canvasResize(){
		canvas.width = document.body.getBoundingClientRect().width;
		canvas.height = document.body.getBoundingClientRect().height;
		cWidth = canvas.width;
		cHeight = canvas.height;
		barWidth = cWidth/(freqBins-4);
	}
	window.addEventListener("resize",canvasResize);

	function draw() {
		analyser.getByteFrequencyData(freqDataArray);
		canvasCtx.clearRect(0, 0, cWidth, cHeight);
		for( var i=4; i<freqBins; i++ ){
			var hue = i/freqBins * 192 + 128;
			canvasCtx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';

			var barFillAmount = cHeight * freqDataArray[i] / 260;
			canvasCtx.fillRect((i-4) * barWidth, 0, barWidth, barFillAmount);
		}
		requestAnimationFrame(draw);
	};

	setTimeout(function(){
	},99);



	var xhr = new XMLHttpRequest();
	xhr.open("get", "tunes/");
	xhr.onload = function(e) {
		if( xhr.status===200 ){
			var res = (JSON.parse(xhr.response));
			var songsList=[];
			for (var i = 0; i < res.length; i++) {
				songsList.push('https://feaden.me/tunes/'+res[i].name);
			}
			enableAudio(songsList);
			draw();
		}
	};
	xhr.send();



	const aPlayButt = document.querySelector('#aPlayButt');
	const aSkipButt = document.querySelector('#aSkipButt');
	var source;
	function enableAudio(songsList){
		var song = new Audio();
		song.src=songsList[1];
		song.loop = true;


		source = audioCtx.createMediaElementSource(song);
		source.connect(analyser);
		analyser.connect(audioCtx.destination);


		song.addEventListener('play',function(){
			aPlayButt.children[0].textContent = 'pause';
		});
		song.addEventListener('pause',function(){
			aPlayButt.children[0].textContent = 'play_arrow'; // ♪ &#9834; | ♫  &#9835;
		});


		aPlayButt.addEventListener("click",function(e){
			song.paused ? song.play() : song.pause();
		},{capture:true},true);


		aSkipButt.addEventListener("click",function(e){
			song.pause();

			var thisIDX = songsList.indexOf(song.src);
			var nextIDX = (thisIDX+1)%songsList.length;

			song.src = songsList[nextIDX];
			song.play();
		},{capture:true},true);


		//song.play();
	}





}
