// content.js


const API_URL_PROTOCOL = 'http://online.knesset.gov.il/api/Protocol/GetProtocolBulk';
const API_URL_BK = 'http://online.knesset.gov.il/api/Protocol/WriteBKArrayData';
const API_URL_VIDEOPATH = 'http://online.knesset.gov.il/api/Protocol/GetVideoPath';

let protocolId = /ProtocolID\=(\d+)/i.exec(window.location.href)[1];

function get(method, url, params){
	let xhr = new XMLHttpRequest();
	let queryString = params ? Object.keys(params).map(key => key + '=' + params[key]).join('&') : '';
	xhr.open(method, url + '?' + queryString);
	console.log(url + '?' + queryString);

	return new Promise( (resolve, reject) => {
	  xhr.addEventListener("load", () => {
		  resolve(JSON.parse(xhr.responseText));
	  });
	  xhr.send(params.protocolNum || null);
  })
}

setTimeout(function(){
	//get(API_URL_VIDEOPATH, {protocolNum: 81275}).then(d => console.log(d));
	let data = {html:'', times:[]};
	let hasLastTextRegExp = null;
	get("GET", API_URL_BK, {sProtocolNum: protocolId}).then(times => {
		data.times = times;
		hasLastTextRegExp = new RegExp('txt_' + (data.times.length - 1));
		scrapeNextPage();
	});
	let pageNum = 0;
	function scrapeNextPage(){
		get("GET", API_URL_PROTOCOL, {sProtocolNum: protocolId, pageNum: pageNum++}).then(page => {
			data.html += page.sContent;
			if(hasLastTextRegExp.test(page.sContent))
				finish();
			else
				setTimeout(scrapeNextPage, 2000);
		});
	}

	function getTimeById(timeId){
		timeId = timeId.substring('txt_'.length);
		return data.times[timeId];
	}

	function finish(){
		let doc = document.createElement('div');
		doc.innerHTML = data.html;
		let speeches = [];
		let subjects = [];
		let assembly = {};
		let speech = null;
		let subject;
		let child;

		assembly.protocolId = protocolId;
		assembly.videoUrl = document.querySelector('video source').src;

		for(var i=0, len=doc.children.length; i<len; i++){
			child = doc.children[i];
			if(child.className == "SPEAKER" || child.className == "YOR"){
				if(speech) speeches.push(speech);
				speech = {protocolId, speaker: child.textContent, paragraphs: [], time: getTimeById(child.firstChild.id), index: speeches.length}
			}
			if(child.firstChild.className == "SUBJECT"){
				speech = null;
				subject = {protocolId, title: child.textContent, time: getTimeById(child.firstChild.firstChild.id) , index: subjects.length };
				subjects.push(subject);
			}
			if(speech != null){
				if(child.textContent != speech.speaker && /[^\s]/.test(child.textContent))
					speech.paragraphs.push(child.textContent);
			} else if(!('subtitle' in assembly)){
				if('title' in assembly)
					assembly.subtitle = child.textContent;
				else
					assembly.title = child.textContent;
			}
		}
		speeches.push(speech);
		let xhr = new XMLHttpRequest();
		xhr.open("POST", "http://localhost:3000/add_to_database");
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		console.log(subjects);
		xhr.send(JSON.stringify({ protocolId, speeches, subjects, assembly }));
		//console.log(conversation);
	}

	console.log(document.querySelector('video source').src);
}, 1000)
