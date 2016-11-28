Array.from||(Array.from=function(){var r=Object.prototype.toString,n=function(n){return"function"==typeof n||"[object Function]"===r.call(n)},t=function(r){var n=Number(r);return isNaN(n)?0:0!==n&&isFinite(n)?(n>0?1:-1)*Math.floor(Math.abs(n)):n},e=Math.pow(2,53)-1,o=function(r){var n=t(r);return Math.min(Math.max(n,0),e)};return function(r){var t=this,e=Object(r);if(null==r)throw new TypeError("Array.from requires an array-like object - not null or undefined");var a,i=arguments.length>1?arguments[1]:void 0;if("undefined"!=typeof i){if(!n(i))throw new TypeError("Array.from: when provided, the second argument must be a function");arguments.length>2&&(a=arguments[2])}for(var f,u=o(e.length),c=n(t)?Object(new t(u)):new Array(u),h=0;h<u;)f=e[h],i?c[h]="undefined"==typeof a?i(f,h):i.call(a,f,h):c[h]=f,h+=1;return c.length=u,c}}());

const pages = Array.from(document.querySelectorAll('#pageCon .aPage'));
const buttons = [];

for (var i = 0; i<pages.length; i++) {
	var hasLink = pages[i].querySelector('a');
	if( hasLink )
		hasLink.setAttribute('target','_blank');
	var newButt = document.createElement("BUTTON");
	newButt.id = pages[i].id+'butt';
	newButt.textContent = pages[i].id.slice(1);
	document.querySelector('#navCon').appendChild(newButt);
	buttons[buttons.length] = newButt;
	//makeCommentBox(i);
}




//___________________________ page navigation _______________________________

const umbrella = document.querySelector('#umbrella');

// clicks
setTimeout(function(){
	document.querySelector('#navCon').addEventListener('click',function(e){
		if(e && e.target && ~buttons.indexOf(e.target)){
			switchPage(parseInt(e.target.textContent));
		}
	},false);
},0);


function switchPage(page){
	if( typeof page ==='number' ){

		// validate target page exists
		var newButt = document.querySelector('#p'+page+'butt');
		var newPage = document.querySelector('#p'+page);
		if( !newButt || !newPage )
			return;

		// hide old
		var actiButt = document.querySelector('.activeButt');
		if( actiButt )
			actiButt.classList.remove('activeButt');
		var actiPage = document.querySelector('.activePage');
		if( actiPage ){
			if( actiPage.id.slice(1) === page )
				return; //same as current page
			actiPage.classList.remove('activePage');
		}

		// enlarge button, show page
		newButt.classList.add('activeButt');
		newPage.classList.add('activePage');
		if( !newPage.zLoaded ){
			updateComments(page);
		}

	}
}



// keyboard events
setTimeout(function(){
	umbrella.addEventListener("keydown",function(e){
		if( ~['INPUT','TEXTAREA'].indexOf(e.target.nodeName) || e.target.contentEditable===true 
			|| e.target.classList.contains('textBox') ){
			//console.log(e.target.contentEditable);
		}else{
			var key = e.which || e.keyCode || 0;
			switch(key) {
				case 27: // escape
				break;
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
},0);




// touch events
setTimeout(function(){
	document.querySelector('#pageCon').addEventListener('touchstart', handleTouchStart, {passive:true}, false);
	document.querySelector('#pageCon').addEventListener('touchmove', handleTouchMove, {passive:true}, false);
},0);

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
},1);


//____________________________ end page navigation _______________________













//____________________________ start image enlarge onClick _______________________

const images = Array.from(document.querySelectorAll('.pageMeat img'));
var bigImgRef;
for (var i = 0; i < images.length; i++) {
	images[i].onclick = function(e){
		document.activeElement.blur();
		bigImgRef = this.cloneNode(false);
		bigImgRef.classList.add('enlargePic');
		umbrella.appendChild(bigImgRef);
		bigImgRef.addEventListener('click', minimize);
		//this.classList.add('enlargePic');
		//this.addEventListener('click', minimize);
	}
}

function minimize(e) {
	//e.target.classList.remove('enlargePic');
	umbrella.removeChild(bigImgRef);
	umbrella.focus();
	e.target.removeEventListener(e.type, minimize);
	bigImgRef = null;
}


//____________________________ end image enlarge onClick _______________________



















// page specific
setTimeout(function(){

	const bradBonz = document.querySelector('#bradBon');
	bradBonz.addEventListener('click',function(){
		new Audio('./pageAssets/01/bawn.mp3').play();
	});

},1);




