

const pages = Array.from(document.querySelectorAll('#pageCon>div'));
const buttons = [];
const commentBoxTemplate = document.querySelector('#commentBox').content.querySelector('.commentBox');
for (var i = 0; i<pages.length; i++) {
	buttons[buttons.length] = document.createElement("BUTTON");
	buttons[buttons.length-1].textContent = pages[i].id.slice(1);
	document.querySelector('#navCon').appendChild(buttons[buttons.length-1]);
	//makeCommentBox(i);
}
document.addEventListener('click',function(e){
	if(e && e.target && ~buttons.indexOf(e.target)){
		document.querySelector('.activePage').classList.remove('activePage');
		document.querySelector('#p'+e.target.textContent).classList.add('activePage');
		document.querySelector('#navCon .active').classList.remove('active');
		e.target.classList.add('active');
	}
},false);


pages[0].classList.add('activePage');
buttons[0].classList.add('active');



var hash = window.location.hash;
if( !hash || hash.length<2 || !/^#\d+$/.test(hash) ){
	history.replaceState("", document.title, window.location.pathname + window.location.search);
}else{
	hash = hash.slice(1);
	if( hash >= buttons.length ){
		buttons[buttons.length-1].click();
	}else
	if( hash < buttons.length && hash > 1 ){
		buttons[hash].click();
	}
}



function makeCommentBox(pageID){
	var commentBox = commentBoxTemplate.cloneNode(true);
	commentBox.querySelector('.addCommentButt').name = pageID;
	pages[pageID].appendChild(commentBox);
}




const commentTemplate = document.querySelector('#aComment').content.querySelector('.aComment');
function createComment(pageID, who, when, what){
	var comment = commentTemplate.cloneNode(true);
	comment.querySelector('.commentWho').textContent = who;
	comment.querySelector('.commentWhen').textContent = when;
	comment.querySelector('.commentMeat').textContent = what;
	pages[pageID].querySelector('.commentsCon').appendChild(comment);
}

// createComment(0,'mario',new Date(),'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse	cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non	proident, sunt in culpa qui officia deserunt mollit anim id est laborum.');



// var ajax = new XMLHttpRequest();
// ajax.open("get", "comments");
// ajax.onload = function(e) {
// 	console.log(ajax.response);
// 	if( ajax.status===200 ){
// 		var res = (JSON.parse(ajax.response));
// 		console.log(res);
// 	}
// };
// ajax.send();



















const bradBon = document.querySelector('#bradBon');
bradBon.addEventListener('click',function(){
	new Audio('bawn.mp3').play();
});

















//___Canvas + Audio____________________________________________________________________________







window.requestAnimationFrame = (function(){
	return 	window.requestAnimationFrame
		|| 	window.webkitRequestAnimationFrame
		|| 	window.mozRequestAnimationFrame
		|| 	window.oRequestAnimationFrame
		|| 	window.msRequestAnimationFrame
		|| 	function(cb){window.setTimeout(cb,1000/60);};
})();



const canvas = document.querySelector('#canvas');
var cWidth,cHeight;
var canvasCtx = canvas.getContext('2d');


var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
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

function draw() {
	analyser.getByteFrequencyData(freqDataArray);
	canvasCtx.clearRect(0, 0, cWidth, cHeight);
	for( var i = 0; i<freqBins; i++ ){
		var hue = i/freqBins * 192 + 128;
		canvasCtx.fillStyle = 'hsl(' + hue + ', 100%, 50%)';

		var barFillAmount = cHeight * freqDataArray[i] / 260;
		canvasCtx.fillRect(i * barWidth, 0, barWidth, barFillAmount);
	}
	requestAnimationFrame(draw);
};




function canvasResize(){
	canvas.width = document.body.getBoundingClientRect().width;
	canvas.height = document.body.getBoundingClientRect().height;
	cWidth = canvas.width;
	cHeight = canvas.height;
	barWidth = cWidth/freqBins;
}
window.addEventListener("resize",canvasResize);

setTimeout(function(){
draw();
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
	}
};
xhr.send();



const aCon = document.querySelector('#aCon');
const aPlayButt = document.querySelector('#aPlayButt');
const aSkipButt = document.querySelector('#aSkipButt');
var source;
function enableAudio(songsList){

	var song = new Audio(songsList[2]);
	song.loop = true;
	song.addEventListener('play',function(){
		aPlayButt.innerHTML = '&#10074;&#10074;'; // ♪ &#9834; | ♫  &#9835;
	});
	song.addEventListener('pause',function(){
		aPlayButt.innerHTML = '&#9658;';
	});


	source = audioCtx.createMediaElementSource(song);
	source.connect(analyser);
	analyser.connect(audioCtx.destination);


	aPlayButt.addEventListener("click",function(e){
		song.paused ? song.play() : song.pause();
	});


	aSkipButt.addEventListener("click",function(e){
		song.pause();

		var thisIDX = songsList.indexOf(song.src);
		var nextIDX = (thisIDX+1)%songsList.length;

		song.src = songsList[nextIDX];
		song.play();
	});


	song.src=songsList[0];
	//song.play();
}












// document.addEventListener("click",function(e){
// 	var wasRightClick;
// 	e = e || window.event;
// 	if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
// 		wasRightClick = e.which == 3; 
// 	else if ("button" in e)  // IE, Opera 
// 		wasRightClick = e.button == 2;

// 	if( !~['IMG','BUTTON',"A"].indexOf(e.target.nodeName) && !wasRightClick && e.target!=bradBon )
// 		song.paused? song.play() : song.pause();
// });


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
















// var x = document.querySelector('#scrollNav>div');
// setTimeout(function(){x.style.left='50%'},3000);