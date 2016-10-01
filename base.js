

const pages = Array.from(document.querySelectorAll('#pageCon>div'));
const buttons = [];
for (var i = 0; i<pages.length; i++) {
	buttons[buttons.length] = document.createElement("BUTTON");
	buttons[buttons.length-1].textContent = pages[i].id.slice(1);
	document.querySelector('#navCon').appendChild(buttons[buttons.length-1]);
}
document.addEventListener('click',function(e){
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












//___Canvas + Audio____________________________________________________________________________

const canvas = document.querySelector('#canvas');
var cWidth,cHeight;
var canvasCtx = canvas.getContext('2d');
window.addEventListener("resize",updateCanvasSize);
function updateCanvasSize(){
	canvas.width = document.body.getBoundingClientRect().width;
	canvas.height = document.body.getBoundingClientRect().height;
	cWidth = canvas.width;
	cHeight = canvas.height;
}

window.requestAnimationFrame = (function(){
	return 	window.requestAnimationFrame
		|| 	window.webkitRequestAnimationFrame
		|| 	window.mozRequestAnimationFrame
		|| 	window.oRequestAnimationFrame
		|| 	window.msRequestAnimationFrame
		|| 	function(cb){window.setTimeout(cb,1000/60);};
})();



var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var analyser = audioCtx.createAnalyser();
analyser.smoothingTimeConstant = 0.9;


var freqBins;
var barWidth;
var freqDataArray;

updateCanvasSize();
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
barWidth = cWidth/freqBins;
freqDataArray = new Uint8Array(freqBins);
analyser.getByteFrequencyData(freqDataArray);


function draw() {
	analyser.getByteFrequencyData(freqDataArray);
	canvasCtx.clearRect(0, 0, cWidth, cHeight);
	for (var i = 0; i<freqBins; i++) {
		var hue = i/freqBins * 192 + 128;
		canvasCtx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';

		var value = freqDataArray[i];
		var barFillAmount = cHeight * value/260;
		canvasCtx.fillRect(i * barWidth, 0, barWidth, barFillAmount);
	}
	requestAnimationFrame(draw);
};





setTimeout(function(){
draw();
},99);




var song = new Audio('db.mp3');
song.loop = true;
var source = audioCtx.createMediaElementSource(song);
source.connect(analyser);
analyser.connect(audioCtx.destination);

document.addEventListener("click",function(e){
	var wasRightClick;
	e = e || window.event;
	if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
		wasRightClick = e.which == 3; 
	else if ("button" in e)  // IE, Opera 
		wasRightClick = e.button == 2;

	if( !~['IMG','BUTTON',"A"].indexOf(e.target.nodeName) && !wasRightClick)
		song.paused? song.play() : song.pause();
});


// booChrome(song.play());
// function booChrome(promise){
// 	if (playPromise) {
// 		playPromise.then(function() {
// 		}).catch(function(error) {
// 			//console.log(error);
// 		});
// 	}
// }
// song.addEventListener('ended',function(){
// 	this.currentTime=0;
// 	booChrome(this.play());
// },false);