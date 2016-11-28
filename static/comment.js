



// ------------------------ load comments -------------------------

const commentBoxTemplate = document.querySelector('#commentBox').content.querySelector('.commentBox');
const commentTemplate = document.querySelector('#aComment').content.querySelector('.aComment');




if( pages && commentBoxTemplate && commentTemplate ){
	makeCommentBox();
}

function makeCommentBox(){
	for (var i = 0; i<pages.length; i++) {
		if( pages[i].id === 'p9' )
			continue;
		var newBox = commentBoxTemplate.cloneNode(true);
		newBox.querySelector('.addCommentButt').name = i+1;
		pages[i].appendChild(newBox);
	}
}


// get comments from server
function updateComments(pageID){
	var ajax = new XMLHttpRequest();
	ajax.open("get", "comments/"+pageID);
	ajax.onload = function(e) {
		if( ajax.status===200 ){
			pages[pageID-1].zLoaded = true;

			var res = (JSON.parse(ajax.response));
			if( res && res.length>0 ){
				var pageComments = pages[pageID-1].querySelector('.commentsCon');
				pageComments.innerHTML = '';

				res.sort(function(a,b){
					return new Date(a.when) - new Date(b.when);
				});
				for (var i = 0; i < res.length; i++) {
					pageComments.appendChild( createCommentElem(res[i]) );
				}
			}
		}
	};
	ajax.send();
}

function createCommentElem(comment){
	var commentNode = commentTemplate.cloneNode(true);
	commentNode.querySelector('.commentWho').textContent = comment.who;
	commentNode.querySelector('.commentMeat').textContent = comment.what;

	var timestamp =  new Date(comment.when).toLocaleString();
	commentNode.time = timestamp;
	commentNode.querySelector('.commentWhen').textContent = timestamp;

	return commentNode;
}


//var testComment = [{"who":"Zhao","what":"loren bro","when":"2016-10-10T19:27:04.966Z"}];
//createComment(0, testComment[0]);


// ------------------------ end load comments -------------------------





















// var testUser = {
// 	id: 'cesarez@uw.edu'
// 	,dName: 'asdf'
// 	,default: 'cesarez'
// 	,pLink: 'https://feaden.me'
// };


// ------------------------ authenticated user block -------------------------



const aNonBlankChar = /[^\x00-\x20\x7F]/;

var commentInteraction = setTimeout(function(){


var zCss = (function() {
	var style = document.createElement("style");
	style.appendChild(document.createTextNode(""));
	document.head.appendChild(style);
	return style.sheet;
})();


// continue only if cookie
if( !zCss || !document.cookie ){
	return;
}

// get profile info & remove comment box overlay
var xhr = new XMLHttpRequest();
xhr.open("get", "whois");
xhr.onload = function(e) {
	if( xhr.status===200 && xhr.response ){
		window.zWhois = JSON.parse(xhr.response);
		enableCommentBox();
		return;
	}
};
xhr.send();
// window.zWhois = testUser;
// enableCommentBox();



// activate comment box
function enableCommentBox(){

	document.querySelector('.overlay').remove();
	zCss.insertRule(".overlay{ display:none!important;}", 0);
	if( zWhois.dName ){
		zCss.insertRule(".zUser:after{content:'"+zWhois.dName+"';}", 1);
	}else{
		zCss.insertRule(".zUser:after{content:'"+zWhois.default+"';}", 1);
	}
	
	// listen for expand profile & addComments button
	document.querySelector('#pageCon').addEventListener('click',function(e){
		if(e && e.target ){
			if( e.target.classList.contains('addCommentButt') && e.target.name ){
				var thisPage = pages[e.target.name-1];
				var textMeat = thisPage.querySelector('.textBox').innerText;
				addComment(thisPage, textMeat);
			}else
			if(  e.target.classList.contains('zUser') ){
				uBoxCon.style.display='flex';
				uBoxCon.focus();
			}
		}
	},false);

	enableUserBox();
}


function addComment(thisPage, textMeat){
	if( textMeat && aNonBlankChar.test(textMeat) ){
		textMeat = textMeat.trim().replace(/[\x00-\x08]/g,'');
		//encodeURIComponent(tb.innerText);
		var payload = {
			pg:thisPage.id.slice(1),
			txt:textMeat
		};
		var xhr = new XMLHttpRequest();
		xhr.open("post", "submit");
		xhr.setRequestHeader('Content-type','application/json');
		xhr.onload = function(e) {
			if( xhr.status===200 ){
				thisPage.querySelector('.textBox').textContent='';
				// setTimeout(function(){
				// 	updateComments(payload.pg);
				// },9);
				var acceptedComment = {
					who: zWhois.dName || zWhois.default,
					when: parseInt(xhr.response),
					what: payload.txt
				};
				var elem = createCommentElem(acceptedComment);
				elem.classList.add('newComment');
				pages[payload.pg-1].querySelector('.commentsCon').appendChild(elem);
				setTimeout(function(){
					elem.classList.remove('newComment');
				},2222);
			}else{
				statusElem.textContent = 'something went wrong X_X';
			}
		};
		xhr.send(JSON.stringify(payload));
	}
	else{	//bad text entry
		var statusElem = thisPage.querySelector('.addComStatus');
		statusElem.textContent = '-no text detected-';
		var tBox = thisPage.querySelector('.textBox')
		tBox.classList.add('borderRed');

		var bad = {
			box:tBox,
			msg:statusElem,
			handleEvent: function(e){
				this.box.classList.remove('borderRed');
				this.msg.textContent = '';
				tBox.removeEventListener('input',bad,false);
			}
		};
		tBox.addEventListener('input',bad,false);
	}
}



// const uBoxCon = document.querySelector('#uBoxCon');
// const uBoxStatus = uBoxCon.querySelector('#uOptionStatus');
// const uButtCancel = document.querySelector('#uButtCancel');
// const uButtSave = document.querySelector('#uButtSave');
var dName;
var pLink;
var uBoxOptions;

// user profile box stuff
function enableUserBox(){
	uBoxCon.querySelector('p').textContent = zWhois.id;

	uBoxOptions = Array.from(document.querySelectorAll('#uOptions .anOption'));

	dName = uBoxCon.querySelector('#uDisplayName');
	dName.value = zWhois.dName || '';
	dName.placeholder = zWhois.default + ' (default)';

	pLink = uBoxCon.querySelector('#uProfileLink');
	pLink.value = zWhois.pLink || '';
	pLink.parentNode.style.display = 'none';


	uBoxCon.addEventListener('input',function(e){
		if( ~[dName,pLink].indexOf(e.target) ){
			//e.target.value = e.target.value.trim();
			checkNewValue();
		}
	},false);

	// reset fields
	uButtCancel.addEventListener('click',function(e){
		dName.value = zWhois.dName || '';
		pLink.value = zWhois.pLink || '';
		
		uButtCancel.disabled = true;
		uButtSave.disabled = true;
	});

	uButtSave.addEventListener('click',function(e){
		submitChanges();
	});

	// enter to submit & close userBox window
	uBoxCon.addEventListener('keyup',function(e){
		var key = e.which || e.keyCode || 0;
		if( ~['INPUT','TEXTAREA'].indexOf(e.target.nodeName) || e.target.contentEditable===true ){
			if( key===13 ){ //enter
				submitChanges();
				return;
			}
		}else{
			//escape
			if( key===27 && uBoxCon.style.display!=='none') {
				uBoxCon.style.display='none';
				umbrella.focus();
				return;
			}
		}
	},false);
	uBoxCon.addEventListener('click',function(e){
		if(e.target === uBoxCon || e.target === uBoxCon.querySelector('#uBoxCloseButt')){
			uBoxCon.style.display='none';
			umbrella.focus();
		}
	},false);
}


//enable or disable the cancel & save buttons
function checkNewValue(){
	dName.classList.remove('borderRed');
	pLink.classList.remove('borderRed');
	uOptionStatus.textContent='';

	var test = {};
	test.dName = Boolean( dName.value!==zWhois.default && (
									( zWhois.dName && dName.value!==zWhois.dName) ||
									(!zWhois.dName && aNonBlankChar.test(dName.value)) 
								 ) );
	test.pLink = false;//Boolean( pLink.value!==zWhois.pLink || ( !zWhois.pLink && pLink.value ) );

	if( test.dName || test.pLink ){
		uButtCancel.disabled = false;
		uButtSave.disabled = false;
	}else{
		uButtCancel.disabled = true;
		uButtSave.disabled = true;
	}
}


function submitChanges(){
	if( uButtSave.disabled )
		return;

	var toSave = {};
	// display name
	dName.value = dName.value.trim();
	// non-empty value 
	if( dName.value!=='' && /[^\w\d\x20-]/.test(dName.value) ){
		dName.classList.add('borderRed');
		uOptionStatus.style.color = 'red';
		uOptionStatus.textContent='only AlphaNumeric and Spaces ';
		return;
	}else //empty value
	if( dName.value!==zWhois.default && (
			( zWhois.dName && dName.value!==zWhois.dName) ||
			(!zWhois.dName && aNonBlankChar.test(dName.value)) 
		 ) ){
		toSave.dName = dName.value;
	}
	// profile link
	pLink.value = pLink.value.trim();
	if( pLink.value!=='' && !urlTest(pLink.value) ){
		pLink.classList.add('borderRed');
		uOptionStatus.style.color = 'red';
		uOptionStatus.textContent='invalid url';
	}else
	if( pLink.value!==zWhois.pLink || ( !zWhois.pLink && pLink.value ) ){
		toSave.pLink = pLink.value;
	}


	// stop if there is nothing to save
	if( Object.keys(toSave).length<1 ){
		return;
	}

	var xhr = new XMLHttpRequest();
	xhr.open("post", "whois");
	xhr.onload = function(e) {
		if( xhr.status===200 ){
			uOptionStatus.textContent='update successful!';
			zWhois.dName = toSave.dName;
			zCss.deleteRule(1);
			if( zWhois.dName ){
				zCss.insertRule(".zUser:after{content:'"+zWhois.dName+"';}", 1);
			}else{
				zCss.insertRule(".zUser:after{content:'"+zWhois.default+"';}", 1);
			}
		}else
		if( xhr.status===202 ){
			uOptionStatus.style.color = 'red';
			uOptionStatus.textContent = xhr.response;
		}else
		if( xhr.status===400 ){
			uOptionStatus.style.color = 'red';
			uOptionStatus.textContent = xhr.response;
		}
		else{
			uOptionStatus.style.color = 'orange';
			uOptionStatus.textContent='something went wrong :(';
			uButtCancel.disabled = false;
			uButtSave.disabled = false;
		}
	};
	xhr.timeout = 9999;
	xhr.ontimeout = function(e){
		uOptionStatus.style.color = 'orange';
		uOptionStatus.textContent='something went wrong :(\nrequest took too long';
		uButtCancel.disabled = false;
		uButtSave.disabled = false;
	};
	xhr.setRequestHeader("Content-Type","application/json");
	xhr.send(JSON.stringify(toSave));
	uOptionStatus.textContent='saving.....';
	uOptionStatus.style.color = 'green';
	uButtCancel.disabled = true;
	uButtSave.disabled = true;
}






function urlTest(url){
	var uri = url.replace(/\x20/g,"_"); //space -> underscore

	//	^(https?:\/\/)?								optional protocol
	//	(?![\dA-Z-\.]{253,}[^$\/]) 				domain name: 253 char limit & end with $ or /
	//	(([\dA-Z-]+\.)+([A-Z-]{2,63}))($|\/)	domain name: subdomain(s) + tld
	var simpleR = /^(https?:\/\/)?(?![\dA-Z-\.]{253,}[^$\/])(([\dA-Z-]+\.)+([A-Z-]{2,63}))($|\/)/i;

	return simpleR.test(uri);
}






},0); 

// ------------------------ end authenticated user block -------------------------^
