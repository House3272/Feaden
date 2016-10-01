

const pages = Array.from(document.querySelectorAll('#pageCon>div'));
const buttons = [];
for (var i = 0; i<pages.length; i++) {
	buttons[buttons.length] = document.createElement("BUTTON");
	buttons[buttons.length-1].textContent = pages[i].id.slice(1);
	document.querySelector('#navCon').appendChild(buttons[buttons.length-1]);
}
document.addEventListener('click',function(e){
	console.log(e);
	if(e && e.target && ~buttons.indexOf(e.target)){
		document.querySelector('.activePage').classList.remove('activePage');
		document.querySelector('#a'+e.target.textContent).classList.add('activePage');
		document.querySelector('#navCon .active').classList.remove('active');
		e.target.classList.add('active');
	}
},false);


pages[0].classList.add('activePage');
buttons[0].classList.add('active');
buttons[0].focus();


const bradBon = document.querySelector('#bradBon');
bradBon.addEventListener('click',function(){
	new Audio('bawn.mp3').play();
});




// setTimeout(function(){
// var dearly = new Audio('db.mp3');
// dearly.addEventListener('ended',function(){
// this.currentTime = 0;
// this.play();
// },false);
// dearly.play();
// },3200);



// var x = document.querySelector('#scrollNav>div');
// setTimeout(function(){x.style.left='50%'},3000);









// const aButt = document.querySelector('#aButt');
// const aMeat = document.querySelector('#aMeat');
// document.addEventListener('click',function(e){
// 	if( e.target===aButt )
// 		aboutToggle();
// });
// function aboutToggle(){
// 	if(aButt.textContent==='close'){
// 		aButt.textContent='About';
// 		aButt.className='';
// 		aMeat.style.display='none';
// 	}else{
// 		aButt.textContent='close';
// 		aButt.className='open';
// 		aMeat.style.display='flex';
// 	}
// }





window.requestAnimationFrame = (function(){
	return window.requestAnimationFrame  ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function(cb){window.setTimeout(cb,1000/60);};
})();





const canvas = document.querySelector('#canvas');
canvas.width = document.body.getBoundingClientRect().width;
canvas.height = document.body.getBoundingClientRect().height;

var WIDTH = canvas.width;
var HEIGHT = canvas.height;


var canvasCtx = canvas.getContext('2d');

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();


var analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;
var freqBins = analyser.frequencyBinCount-360;
//analyser.smoothingTimeConstant = 0.9;
var freqDataArray = new Uint8Array(freqBins);


analyser.getByteFrequencyData(freqDataArray);

var barWidth = WIDTH/freqBins;
function draw() {
	analyser.getByteFrequencyData(freqDataArray);
	canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
	for (var i = 0; i<freqBins; i++) {
		var hue = i/freqBins * 192 + 128;
		canvasCtx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';

		var value = freqDataArray[i];
		var barFillAmount = HEIGHT * value/260;
		canvasCtx.fillRect(i * barWidth, 0, barWidth, barFillAmount+2);
	}
	requestAnimationFrame(draw);
};




var song = new Audio('db.mp3');
//song.crossOrigin = "anonymous";
var source = audioCtx.createMediaElementSource(song);
source.connect(analyser);
analyser.connect(audioCtx.destination);


draw();
song.play();
song.addEventListener('ended',function(){
	this.currentTime = 0;
	this.play();
},false);


// booChrome(song.play());


// song.addEventListener('ended',function(){
// 	this.currentTime=0;
// 	booChrome(this.play());
// },false);

// function booChrome(promise){
// 	if (playPromise) {
// 		playPromise.then(function() {
// 		}).catch(function(error) {
// 			//console.log(error);
// 		});
// 	}
// }