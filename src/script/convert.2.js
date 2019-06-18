

import util from './util.js';
var workerPath = window.asm2;
/* if(document.domain == 'localhost') {
	workerPath = location.href.replace(location.href.split('/').pop(), '') + 'script/ffmpeg_asm.js';
	// alert(workerPath);
}*/
let commandWorker;
function processInWebWorker() {
	// 生成时内容区大小
	let TOTAL_MEMORY =  1024 * 1024 * 128;
	var blob = URL.createObjectURL(new Blob(
		[
			`importScripts("${workerPath}");

			var now = Date.now;
			
			function print(text) {
			  postMessage({
				'type' : 'stdout',
				'data' : text
			  });
			}
			
			onmessage = function(event) {
			
			  var message = event.data;
			
			  if (message.type === "command") {
			
				var Module = {
				  print: print,
				  printErr: print,
				  files: message.files || [],
				  arguments: message.arguments || [],
				  TOTAL_MEMORY: message.totalMemory || ${ TOTAL_MEMORY}
				  // Can play around with this option - must be a power of 2
				  // TOTAL_MEMORY: 268435456
				};
			
				postMessage({
				  'type' : 'start',
				  'data' : Module.arguments.join(" ")
				});
			
				postMessage({
				  'type' : 'stdout',
				  'data' : 'Received command: ' +
							Module.arguments.join(" ") +
							((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")
				});
			
				var time = now();
				var result = ffmpeg_run(Module);
			
				var totalTime = now() - time;
				postMessage({
				  'type' : 'stdout',
				  'data' : 'Finished processing (took ' + totalTime + 'ms)'
				});
			
				postMessage({
				  'type' : 'done',
				  'data' : result,
				  'time' : totalTime
				});
			  }
			};
			
			postMessage({
			  'type' : 'ready'
			});
			`
		], {
			type: 'application/javascript'
		}
	));
	var worker = new Worker(blob);
	URL.revokeObjectURL(blob);
	return worker;
}


function accessWorker2() {
	return new Promise((resolve, reject)=>{
		let initWorder = processInWebWorker();
		initWorder.onmessage = function(event) {
			// alert(event);
			resolve();
			initWorder.terminate();
		}
		initWorder.onerror = function(e) {
			// alert(e);
			console.log(e);
			reject();
			initWorder.terminate();
		}
	});
}


function convertStreams2(videoBlob, audioBlob, {t}) {
	var worker;
	var vab;
	var aab;
	var buffersReady;
	var workerReady;
	var posted = false;

	// 视频
	var fileReader1 = new FileReader();
	fileReader1.onload = function() {
		vab = this.result;
		if (!audioBlob || aab ) buffersReady = true;
		if (buffersReady && workerReady && !posted) postMessage();
	};

	// 音频
	var fileReader2 = new FileReader();
	fileReader2.onload = function() {
		aab = this.result;
		if (vab) buffersReady = true;
		if (buffersReady && workerReady && !posted) postMessage();
	};

	fileReader1.readAsArrayBuffer(videoBlob);
	if(audioBlob) {
		fileReader2.readAsArrayBuffer(audioBlob);
	}

	if (!worker) {
		worker = processInWebWorker();
	}
	worker.onmessage = function(event) {
		var message = event.data;
		if (message.type == "ready") {
			log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file has been loaded.');
			workerReady = true;
			if (buffersReady)
				postMessage();
		} else if (message.type == "stdout") {
			log(message.data);
		} else if (message.type == "start") {
			log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file received ffmpeg command.');
		} else if (message.type == "done") {
			log(JSON.stringify(message));
			var result = message.data[0];
			log(JSON.stringify(result));
			var blob = new Blob([result.data], {
				type: 'video/mp4'
			});
			log(JSON.stringify(blob));
			PostBlob(blob);
			worker = null;
		}
	};
	console.log('--------------time', t);
	var postMessage = function() {
		posted = true;
		
		/*
			[
				'-i', 'video.webm',
				'-i', 'audio.wav',
				'-s', '1280x720',
				'-c:v', 'mpeg4',
				'-c:a', 'aac',
				'-b:v', '1450k',
				'-b:a', '96k',
				'-bf', '2',
				'-g', '90',
				'-sc_threshold', '0',
				'-ar', '32000',
				'-strict', 'experimental', 'output.mp4'
			]
		*/
		
		let args = audioBlob ? [
			'-i', 'video.webm',
			'-i', 'audio.wav',
			'-i', 'audio.wav',
			'-i', 'audio.wav',
			'-t', t,
			'-q:v', '4',
			'-strict', 'experimental',
			'-r', 24,
			'output.mp4'
		] : [
			'-i', 'video.webm',
			'-t', t,
			'-q:v', '4',
			'-strict', 'experimental',
			'-r', 24,
			'output.mp4'
		];
		let files = audioBlob ? [
			{
				data: new Uint8Array(vab),
				name: 'video.webm'
			},
			{
				data: new Uint8Array(aab),
				name: "audio.wav"
			}
		] : [
			{
				data: new Uint8Array(vab),
				name: 'video.webm'
			},
		]
		console.log(new Uint8Array(vab));
		worker.postMessage({
			type: 'command',
			arguments:  args,
			files: files
		});
	};
}

// 生成下载链接
function PostBlob(blob) {
	var h2 = document.querySelector('#log');
	var downloadWrap  = document.getElementById('download-wrap');
	var downloadName = '图文视频' +util.getTimeString();
	// h2.innerHTML = '<a href="' + URL.createObjectURL(blob) + '" target="_blank" download="Recorded Audio+Canvas File.mp4">Download Recorded Audio+Canvas file in MP4 container and play in VLC player!</a>';
	let link = '<a href="' + URL.createObjectURL(blob) + '" target="_blank" download="'+downloadName+'.mp4">点击下载视频文件!<div id="video-download-icon"></div></a>';
	h2.innerHTML = link;
	downloadWrap.innerHTML = link;
	h2.setAttribute('contenteditable', 'false');
	downloadWrap.setAttribute('contenteditable', 'false');
}
function log(message) {
	var h2 = document.querySelector('#log');
	h2.innerHTML = message;
	console.log(message);
}

// 将图片生成视频
function convertImageToVideo2(imagesArray, audio, {f, t, b}, callback,size, encoder, totalMemory) {
	var worker;	
	if (!worker) {
		worker = processInWebWorker();
	}
	let files = imagesArray.map((item, index)=>{
		console.log(`input${index}.jpeg`);
		return {
			name: `input${index}.jpeg`,
			data: item,
		}
	})
	files.push({
		"name": "input.wav",
		"data": audio
	})

	// let commands = `-r ${f}  -f image2 -i input%d.jpeg ${audio? '-i input.wav' :  '' }  -strict -2 -b:v ${b}k -t ${t}  -af volume=5dB output.mp4`;
	//let commands = `-r ${f}  -f image2 -i input%d.jpeg ${audio? '-i input.wav' :  '' }  -strict -2 -b:v ${b}k -t ${t} -af volume=4dB -pix_fmt yuv420p -s 800*800 output.mp4`;
	console.log('ver2 ==============================================================================================================================');
	console.log(size);
	// let commands = `-r ${f}  -f image2 -i input%d.jpeg ${audio? '-i input.wav' :  '' }  -strict -2 -b:v ${b}k -t ${t} -pix_fmt yuv420p -s 800x800 output.mp4`;
	// let commands = `-r ${f}  -f image2 -i input%d.jpeg ${audio? '-i input.wav' :  '' }  -strict -2 -b:v ${b}k -t ${t} -pix_fmt yuv420p output.mp4`;

	// let commands = `-r ${f}  -f image2 -i input%d.jpeg ${audio? '-i input.wav' :  '' }  -strict -2 -b:v ${b}k -t ${t} -c:v libvpx-vp9 output.webm`; // 不可用
	// let commands = `-r ${f}  -f image2 -i input%d.jpeg ${audio? '-i input.wav' :  '' }  -strict -2 -t ${t} -b:v ${b / 10}k -t ${t} -pix_fmt yuvj420p -preset slow -profile:v baseline -q:v 4 -s  ${size} output.mp4`; // 不可用
	
	
	// let commands = `-r ${f}  -f image2 -i input%d.jpeg ${audio? '-i input.wav' :  '' }  -strict -2 -b:v ${b}k -t ${t} -vcodec mpeg4 -af volume=1dB output.mp4`; // 可用 但不是h.264
	let commands = `-r ${f}  -f image2 -i input%d.jpeg ${audio? '-i input.wav' :  '' }  -strict -2 -b:v ${b}k -t ${t} -vcodec mpeg4 -af volume=1.5 output.mp4`; // 可用 但不是h.264
	// let commands = `-r ${f}  -f image2 -i input%d.jpeg ${audio? '-i input.wav' :  '' }  -strict -2 -t ${t} -b:v ${b / 10}k -t ${t} -pix_fmt yuv420p output.mp4`; // 可用
	
	if(encoder == 'H.264') {
		// alert('H.264');
		commands = `-r ${f}  -f image2 -i input%d.jpeg ${audio? '-i input.wav' :  '' }  -strict -2 -t ${t} -b:v ${b / 10}k -t ${t} -pix_fmt yuv420p -af volume=1.5 output.mp4`;
	}

	let args = util.parseArguments(commands);

	let postMessage = ()=>{
		worker.postMessage({
			type: 'command',
			arguments:  args,
			files,
			totalMemory,
		})
	}
	// console.log(files);
	worker.onmessage = function(event) {
		var message = event.data;
		if(callback) {
			callback(message);
		}
		if (message.type == "ready") {
			log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file has been loaded.');
			// workerReady = true;
			postMessage();
		} else if (message.type == "stdout") {
			log(message.data);
		} else if (message.type == "start") {
			log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file received ffmpeg command.');
		} else if (message.type == "done") {
			log(JSON.stringify(message));
			var result = message.data[0];
			log(JSON.stringify(result));
			var blob = new Blob([result.data], {
				type: 'video/mp4'
			});
			log(JSON.stringify(blob));
			PostBlob(blob);
			worker = null;
		}
	};
	worker.onerror = function(e) {
		if(callback) {
			callback({
				type: 'error',
				e: e,
			})
		}
	}
}

// 合并音频
function combineAudio2(array, callback, duration) {
	var worker;	
	if (!worker) {
		worker = processInWebWorker();
	}
	/* let files = [
		{
			name: `input${0}.wav`,
			data: array[0],
		},
		{
			name: `input${1}.wav`,
			data: array[1],
		}
	];*/
	let files = array.map((item, index)=>{
		console.log(`input${index}.wav`);
		return {
			name: `input${index}.wav`,
			data: item,
		}
	})
	let audioCount = array.length;
	let inputs = array.map((item, index)=>{
		return `-i input${index}.wav`
	})

	// 背景音乐和人声合并
	// let commands = `-i input0.wav -i input1.wav -filter_complex amerge output.wav`;
	// let commands = `-i input0.wav -i input1.wav -acodec copy output.wav`;
	console.log('duration', duration);
	let volume =  array.map((item, index)=>{
		let isLast = index + 1 == array.length;
		return `[${index}:a]volume=${isLast ? 1 : 2}[a${index +1}]`;
	}).join(';');
	let inputsVolume = array.map((item, index)=>{
		return `[a${index+1}]`
	}).join('')
	// let commands = `${inputs.join(' ')} -filter_complex amix=inputs=${audioCount}:duration=longest:dropout_transition=${audioCount} -ar 24k -ab 768k output.wav`;
	// let commands = `${inputs.join(' ')} -filter_complex ${volume};${inputsVolume}amix=inputs=${audioCount}:duration=longest:dropout_transition=${audioCount} -ar 24k -ab 768k output.wav`;
	let commands = `-t ${duration} ${inputs.join(' ')} -filter_complex ${volume};${inputsVolume}amix=inputs=${audioCount}:dropout_transition=${2} -ar 24k -ab 768k output.wav`;
	console.log(commands);
	// let commands = `-i input1.wav -i input0.wav  -filter_complex amerge output.wav`;
	// let commands = `ffmpeg -filters`;
	
	let args = util.parseArguments(commands);

	let postMessage = ()=>{
		worker.postMessage({
			type: 'command',
			arguments:  args,
			files
		})
	}
	// console.log(files);
	worker.onmessage = function(event) {
		var message = event.data;
		if(callback) {
			callback(message);
		}
		if (message.type == "ready") {
			log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file has been loaded.');
			// workerReady = true;
			postMessage();
		} else if (message.type == "stdout") {
			log(message.data);
		} else if (message.type == "start") {
			log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file received ffmpeg command.');
		} else if (message.type == "done") {
			log(JSON.stringify(message));
			var result = message.data[0];
			log(JSON.stringify(result));
			var blob = new Blob([result.data], {
				type: 'audio/wav'
			});
			log(JSON.stringify(blob));
			PostBlob(blob);
			worker = null;
		}
	};
	worker.onerror = function(e) {
		if(callback) {
			callback({
				type: 'error',
				e: e,
			})
		}
	}
}

// 将视频转为 h.264编码
function convertTo264(input, callback) {
	var worker;	
	if (!worker) {
		worker = processInWebWorker();
	}

	let files = [
		{
			name: 'input.mp4',
			data: input
		}
	]

	//let commands = '-i input.mp4 -strict -2 -c:v libx264 output.mp4';
	let commands = '-i input.mp4 -vf showinfo -strict -2 -c:v libvpx-vp9 output.webm';

	let args = util.parseArguments(commands);
	let postMessage = ()=>{
		worker.postMessage({
			type: 'command',
			arguments:  args,
			files
		})
	}



	// console.log(files);
	worker.onmessage = function(event) {
		var message = event.data;
		if(callback) {
			callback(message);
		}
		if (message.type == "ready") {
			log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file has been loaded.');
			// workerReady = true;
			postMessage();
		} else if (message.type == "stdout") {
			log(message.data);
		} else if (message.type == "start") {
			log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file received ffmpeg command.');
		} else if (message.type == "done") {
			var result = message.data[0];
			console.log('convert h.264 success');
			console.log(result);
			/*log(JSON.stringify(message));
			var result = message.data[0];
			log(JSON.stringify(result));
			var blob = new Blob([result.data], {
				type: 'audio/wav'
			});
			log(JSON.stringify(blob));
			PostBlob(blob);
			worker = null;*/
		}
	};
	worker.onerror = function(e){
		if(callback) {
			callback({
				type: 'error',
				e: e,
			})
		}
	}
}

// 获取视频帧
function getVideoFrames2(input, {s, t, fps, scale}, callback) {
	var worker;	
	if (!worker) {
		worker = processInWebWorker();
	}

	let files = [
		{
			name: 'input.mp4',
			data: input
		}
	]

	//let commands = '-i input.mp4 -strict -2 -c:v libx264 output.mp4';
	// let commands = '-i input.mp4 -r 1 -ss 00:00:26 -t 00:00:07 %03d.png';
	let commands = `-i input.mp4 -f image2 -vf fps=fps=${fps}${scale ? ',scale=w=500:h=500:force_original_aspect_ratio=decrease' : ''},showinfo ${s ? ('-ss '+ s ): ''} ${t ? ('-t '+ t) : ''} -an out%d.jpeg`;

	let args = util.parseArguments(commands);
	let postMessage = ()=>{
		worker.postMessage({
			type: 'command',
			arguments:  args,
			files
		})
	}


	// console.log(files);
	worker.onmessage = function(event) {
		var message = event.data;
		if(callback) {
			callback(message);
		}
		if (message.type == "ready") {
			log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file has been loaded.');
			// workerReady = true;
			postMessage();
		} else if (message.type == "stdout") {
			log(message.data);
		} else if (message.type == "start") {
			log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file received ffmpeg command.');
		} else if (message.type == "done") {
			var result = message && message.data ? message.data[0] : '' ;
			console.log('convert h.264 success');
			console.log(result);
			/*log(JSON.stringify(message));
			var result = message.data[0];
			log(JSON.stringify(result));
			var blob = new Blob([result.data], {
				type: 'audio/wav'
			});
			log(JSON.stringify(blob));
			PostBlob(blob);
			worker = null;*/
		}
	};
	worker.onerror = function(e){
		if(callback) {
			callback({
				type: 'error',
				e: e,
			})
		}
	}
}

function runCommand2({files, command}, callback) {
	// alert('worker2');
	let worker = commandWorker;	
	

	/*let files = [
		{
			name: 'input.mp4',
			data: input
		}
	]*/

	// let commands = `-i input.mp4 -f image2 -vf fps=fps=${fps}${scale ? ',scale=w=500:h=500:force_original_aspect_ratio=decrease' : ''} ${s ? ('-ss '+ s ): ''} ${t ? ('-t '+ t) : ''} -an out%d.jpeg`;

	let args = util.parseArguments(command);
	let postMessage = ()=>{
		worker.postMessage({
			type: 'command',
			arguments:  args,
			files
		})
	}
	if (!worker) {
		worker = processInWebWorker();
	} else {
		postMessage();
	}


	// console.log(files);
	worker.onmessage = function(event) {
		var message = event.data;
		if(callback) {
			callback(message);
		}
		if (message.type == "ready") {
			log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file has been loaded.');
			// workerReady = true;
			postMessage();
		} else if (message.type == "stdout") {
			log(message.data);
		} else if (message.type == "start") {
			log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file received ffmpeg command.');
		} else if (message.type == "done") {
			var result = message && message.data ? message.data[0] : '' ;
			console.log('convert h.264 success');
			console.log(result);
			/*log(JSON.stringify(message));
			var result = message.data[0];
			log(JSON.stringify(result));
			var blob = new Blob([result.data], {
				type: 'audio/wav'
			});
			log(JSON.stringify(blob));
			PostBlob(blob);
			worker = null;*/
		}
	};
	worker.onerror = function(e){
		if(callback) {
			callback({
				type: 'error',
				e: e,
			})
		}
	}
}


export { convertStreams2, accessWorker2, convertImageToVideo2, combineAudio2, convertTo264, getVideoFrames2, runCommand2};




// ffmpeg -i test.mp4 -i test.mp3 -filter_complex "[0:a][1:a]amix=inputs=2:duration=first[aout]" -map "[aout]" -c:v copy -map 0:v:0 mix_amerge.mp4
