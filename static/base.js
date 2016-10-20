Array.from||(Array.from=function(){console.log('unsupported');var r=Object.prototype.toString,n=function(n){return"function"==typeof n||"[object Function]"===r.call(n)},t=function(r){var n=Number(r);return isNaN(n)?0:0!==n&&isFinite(n)?(n>0?1:-1)*Math.floor(Math.abs(n)):n},e=Math.pow(2,53)-1,o=function(r){var n=t(r);return Math.min(Math.max(n,0),e)};return function(r){var t=this,e=Object(r);if(null==r)throw new TypeError("Array.from requires an array-like object - not null or undefined");var a,i=arguments.length>1?arguments[1]:void 0;if("undefined"!=typeof i){if(!n(i))throw new TypeError("Array.from: when provided, the second argument must be a function");arguments.length>2&&(a=arguments[2])}for(var f,u=o(e.length),c=n(t)?Object(new t(u)):new Array(u),h=0;h<u;)f=e[h],i?c[h]="undefined"==typeof a?i(f,h):i.call(a,f,h):c[h]=f,h+=1;return c.length=u,c}}());

const pages = Array.from(document.querySelectorAll('#pageCon>div'));
const buttons = [];
const commentBoxTemplate = document.querySelector('#commentBox').content.querySelector('.commentBox');
for (var i = 0; i<pages.length; i++) {
	var newButt = document.createElement("BUTTON");
	newButt.id = 'p'+(i+1)+'butt';
	newButt.textContent = pages[i].id.slice(1);
	document.querySelector('#navCon').appendChild(newButt);
	buttons[buttons.length] = newButt;
	makeCommentBox(i);
}
function makeCommentBox(pageIDX){
	var commentBox = commentBoxTemplate.cloneNode(true);
	commentBox.querySelector('.addCommentButt').name = pageIDX+1;
	pages[pageIDX].appendChild(commentBox);
}




// page navigation

function switchPage(page){
	if(typeof page ==='number' && page>=0 && page<=pages.length){
		var aPage = document.querySelector('.activePage');
		if( aPage ){
			if( pages.indexOf(aPage)===page-1 )
				return; //same as current page
			aPage.classList.remove('activePage');
		}
		var aButt = document.querySelector('.activeButt');
		if( aButt )
			aButt.classList.remove('activeButt');


		var nButt = document.querySelector('#p'+page+'butt');
		if( nButt )
			nButt.classList.add('activeButt');
		var nPage = document.querySelector('#p'+page);
		if( nPage ){
			nPage.classList.add('activePage');
			if( !nPage.zLoaded ){
				updateComments(page);
			}
		}
	}
}

document.querySelector('#navCon').addEventListener('click',function(e){
	if(e && e.target && ~buttons.indexOf(e.target)){
		switchPage(parseInt(e.target.textContent));
	}
},false);


function pageLR(direction){
	var currentIDX = pages.indexOf(document.querySelector('.activePage'));
	var nextIDX;
	if( direction==='R' ){// right
		if(currentIDX>=pages.length-1)
			return;
		nextIDX = (currentIDX+1)%pages.length;
	}	else
	if( direction==='L' ){// left
		if(currentIDX<=0)
			return;
		nextIDX = (currentIDX-1+pages.length)%pages.length;
	}
	switchPage(nextIDX+1);
}



// nav for touch events
document.querySelector('#pageCon').addEventListener('touchstart', handleTouchStart, {passive:true}, false);
document.querySelector('#pageCon').addEventListener('touchmove', handleTouchMove, {passive:true}, false);
var xDown = null;
var yDown = null;
function handleTouchStart(e) {
	xDown = e.touches[0].clientX;
	yDown = e.touches[0].clientY;
};
function handleTouchMove(e) {
	if( ! xDown || ! yDown )
		return;

	var xUp = e.touches[0].clientX;
	var yUp = e.touches[0].clientY;

	var xDiff = xDown - xUp;
	var yDiff = yDown - yUp;

	if( Math.abs( xDiff ) > Math.abs( yDiff ) ){/*most significant*/
		if ( xDiff > 0 ) {
			pageLR('R');
		} else {
			pageLR('L');
		}
	}
	// else {
	// 	if ( yDiff > 0 ) { //up swipe  
	// 	} else { //down swipe
	// 	}
	// }
	xDown = null;
	yDown = null;
};










// function resizeElem(el){
// 		//el.style.cssText = 'height:auto;';
// 		// for box-sizing other than "content-box" use:
// 		//el.style.cssText = '-moz-box-sizing:content-box';
// 		//el.style.cssText = 'height:' + el.scrollHeight + 'px';
// 	setTimeout(function(){
// 		el.style.cssText = 'height:' + el.scrollHeight + 'px';
// 	},0);
// }


document.body.addEventListener("keydown",function(e){

	//if( ~['INPUT','TEXTAREA'].indexOf(e.target.nodeName) )
	if( e.target.nodeName==='TEXTAREA' || e.target.classList.contains('textBox') ){
		//resizeElem(e.target);
	}
	else{
		var key = e.which || e.keyCode || 0;
		switch(key) {
			case 37: // left
				pageLR('L');
			break;
			case 39: // right
				pageLR('R');
			break;
			case 74: // J
			break;
			case 75: // K
			break;
			case 76: // L
			break;
			case 77: // M
			break;
			default:
				return;
		}
	}
},false);





















//pages[0].classList.add('activePage');
//buttons[0].classList.add('activeButt');

// go to certain page if specified
// else go to page 1
setTimeout(function(){
	var hash = window.location.hash;
	if( !hash || hash.length<2 || !/^#\d+$/.test(hash) ){
		history.replaceState("", document.title, window.location.pathname + window.location.search);
		switchPage(1);
	}else{
		hash = parseInt(hash.slice(1));
		if( hash < 1 ){
			hash = 1;
		}else
		if( hash > pages.length ){
			hash = pages.length;
		}

		switchPage(hash);
	}
},0);














// page specific

const bradBonz = document.querySelector('#bradBon');
bradBonz.addEventListener('click',function(){
	new Audio('./pageAssets/01/bawn.mp3').play();
});












// comments communication


const commentTemplate = document.querySelector('#aComment').content.querySelector('.aComment');
function loadComment(pageID, comment){
	var commentNode = commentTemplate.cloneNode(true);
	commentNode.querySelector('.commentWho').textContent = comment.who;
	commentNode.querySelector('.commentMeat').textContent = comment.what;

	var timestamp =  new Date(comment.when).toLocaleString();
	commentNode.time = timestamp;
	commentNode.querySelector('.commentWhen').textContent = timestamp;


	pages[pageID-1].querySelector('.commentsCon').appendChild(commentNode);
}
//var test = [{"who":"Zhao","what":"loren bro","when":"2016-10-10T19:27:04.966Z"}];
//createComment(0, test[0])

function updateComments(pageID){
	var ajax = new XMLHttpRequest();
	ajax.open("get", "comments/"+pageID);
	ajax.onload = function(e) {
		if( ajax.status===200 ){
			pages[pageID-1].zLoaded = true;
			var res = (JSON.parse(ajax.response));

			if( res && res.length>0 ){
				pages[pageID-1].querySelector('.commentsCon').innerHTML = '';
				for (var i = 0; i < res.length; i++) {
					loadComment(pageID, res[i]);
				}
				// for (var i = res.length - 1; i >= 0; i--) {
				// 	loadComment(pageID, res[i]);
				// }
			}
		}
	};
	ajax.send();
}

const aNonBlankChar = /[^\x00-\x20\x7F]/;
setTimeout(function(){
	if( document.cookie ){

		var newSheet = (function() {
			var style = document.createElement("style");
			style.appendChild(document.createTextNode(""));
			document.head.appendChild(style);
			return style.sheet;
		})();
		var xhr = new XMLHttpRequest();
		xhr.open("get", "whois");
		xhr.onload = function(e) {
			if( xhr.status===200 ){
				newSheet.insertRule(".zUser:after{ content:'"+xhr.response+"';}", 0);
				newSheet.insertRule(".overlay{ display:none!important; }", 0);
			}else{

			}
		};
		xhr.send();


		document.querySelector('#pageCon').addEventListener('click',function(e){
			if(e && e.target && e.target.classList.contains('addCommentButt') && e.target.name){
				var textMeat = pages[e.target.name-1].querySelector('.textBox').innerText;
				if( textMeat && aNonBlankChar.test(textMeat) ){
					textMeat = textMeat.trim().replace(/[\x00-\x09\x7F]/g,'');
					//encodeURIComponent(tb.innerText);
					var payload = {
						pg:e.target.name,
						txt:textMeat
					};
					var xhr = new XMLHttpRequest();
					xhr.open("post", "submit");
					xhr.setRequestHeader('Content-type','application/json');
					xhr.onload = function(e) {
						if( xhr.status===200 ){
							setTimeout(function(){
								updateComments(payload.pg);
							},9);
						}
					};
					xhr.send(JSON.stringify(payload));
				}
			}
		},false);

	}
},0);




















//___Canvas + Audio____________________________________________________________________________





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