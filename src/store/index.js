/*
 * @Author: zhangzhenyang 
 * @Date: 2019-02-21 09:18:10 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-05-07 09:45:11
 */

import http from '../script/http';
import api from '../script/api';
import util from '../script/util';
import utilTimeline from '../script/utilTimeline';
import canvasRender from '../script/canvasRender';
// import templates from '../script/templates/templates';
import {convertStreams, accessWorder, convertImageToVideo, combineAudio} from '../script/convert.1.js';
import watermark from '../script/watermark';
import Vue from 'vue';

// import {convertStreamsNew, accessWorderNew} from '../script/convertNew.js';

// import {covertNew} from '../script/termimal.js';


import dialogGoods from './dialogGoods';
import dialogImage from './dialogImage';
// import dialogTemplate from './dialogTemplate';
import dialogAudio from './dialogAudio';
import dialogGenerate from './dialogGenerate';
import dialogSetting from './dialogSetting';
import dialogDownload from './dialogDownload';
import dialogVideoClip from './dialogVideoClip';
import dialogVoice from './dialogVoice';

import tl from './tl';
import test from './test.js';
import optionsSetting from './optionsSetting';
import demo from '../script/templateDemo.js';
import demo2 from '../script/templateDemo2.js';
import demo3 from '../script/templateDemo3.js'; // 新
import demoEmpty from '../script/templateEmpty'; // 空白模板
const store = {
	state: {
		goods: {
			list: [],
			price: 200,
			promotionPrice: 100,

			listInited: false,
			promotionPriceInited: false,
			title: 'video',
		},
		asmInitedStatus: 'initing',
		activeIndex: 0,
		timeline: null,
		update: () => {},
		position: 0,
		playing: true,
		recording: false,
		// 
		// project: {...templates[16].data},
		audio: null,

		snackbar: {
			text: '',
			timeout: '',
			show: false,
		},
		// 模板
		project: demoEmpty,
		// 背景音乐
		bgMusic: '',
		bgMusicName: '',
		activeLayerIndex: [0],
		stage: null,
		timeline: null,
		// 是否在播放视频
		playing: true,
	},
	// ---------------------------------------------------------------------------------------------------------
	getters: {
		// 是否管理员
		isAdmin(state) {
			// return false;
			if(window.user.id == '105227988' && util.getQueryString().admin != undefined) {
				return true;
			}
			return false;
		},
		queryObj() {
			return util.getQueryString();
		},
	},
	// -----------------------------------------------------------------------------------------------------------
	mutations: {
		setActiveIndex(state, {activeIndex}) {
			state.activeIndex = activeIndex;
			state.subActiveIndex = null;
		},
		positionChange(state, {position}) {
			state.position = position;
		},
		togglePlayState(state) {
			if(state.recording) return;
			if(state.timeline) {
				// console.log('togglePlayState', state.playing);
				state.timeline.setPaused(state.playing);
				state.playing = !state.playing;
				// console.log(state.timeline.paused);

			}
		},
		// 设置播放位置
		setPosition(state, {position}) {
			// 如果是正在录制 不做任何操作
			if(state.recording) return;
			if(state.timeline) {
				if(state.playing) {
					state.timeline.gotoAndPlay(position);
				} else {
					state.timeline.gotoAndStop(position);
				}
				
			}
			// alert(position);
		},
		// 设置尺寸
		setSize(state, {val}) {
			state.project.width = val[0];
			state.project.height = val[1];
			state.update();
		},
		// 显示提示
		showSnackbar(state,{text,timeout=2000}) {
			state.snackbar.text = text;
			state.snackbar.timeout = timeout;
			state.snackbar.show = true;
		},
		// 更新舞台
		update(state) {
			state.update();
		},
		// 将宝贝图片填充
		fillGoods(state) {
			if(state.goods.list.length > 0) {
				console.warn([state.goods.price, state.goods.promotionPrice]);
				let newQueue = state.goods.list.map((item, index)=>{
					return {
						...state.project.queue[state.project.queue.length - 1],
						pic_url: item.url,
					}
				})
				state.project.queue = newQueue;
				state.project.wordEffectOptions.forEach((item, index)=>{
					if(item.tag == 'price') {
						item.value = item.value.replace(/[0-9]+\.?[0-9]*/, state.goods.price);
					}
					if(item.tag == 'promotionPrice') {
						item.value = item.value.replace(/[0-9]+\.?[0-9]*/, state.goods.promotionPrice);
					}
				})
				state.update();
			}
		},
		// 设置音频的播放位置
		setAudioPosition(state) {
			try{
				let audio = document.getElementById('audio');
				
				let audioDuration = audio.duration * 1000;
				let shouldPosition = state.position % audioDuration;
				audio.currentTime =  shouldPosition / 1000;
			}catch(e){
				console.log(e);
			}
		},
		// 更新水印
		updateWatermark(state) {
			watermark({stage: state.stage,timeline: state.timeline,project: state.project});			
		}
	},
	// -------------------------------------------------------------------------------------------------------------
	actions: {
		initnew({state, commit, dispatch, getters}){
			window.localImages = {};
			state.project = demo3;
			state.project.voices.forEach((item, index)=>{
				console.log(item);
				dispatch('fetchTTSAudio', {
					tex: item.tex,
					oldTex: item.tex,
					callback: (res)=>{
						if(res.success) {
							item.data = res.blob;
							item.duration = res.duration;
						} else {

						}
					}
				})
			})
			canvasRender.render({
				canvas: document.getElementById('canvas'),
				project: state.project,
				state: state
			})
			window.timeline.gotoAndStop(0);
			accessWorder().then(()=>{
				// alert('ddddd');
				state.asmInitedStatus = 'success';
			}, ()=>{
				alert('视频合成库加载失败，可能无法生成视频。');
				state.asmInitedStatus = 'error';
			})
			dispatch('initLoadFonts');
		},
		// 初始化字体  
		initLoadFonts({state, commit, dispatch, getters}) {
			let fontsUse = {

			};
			state.project.layers.forEach((item, index)=>{
				if(item.type == 'text') {
					/*dispatch('loadFont', {
						fontFamily:item.fontFamily,
						text: item.text,
						callback: () => {
							dispatch('updateTween', {topIndex: index, subIndex: -1});
						}
					})*/
					fontsUse[item.fontFamily] = true;
				} else if(item.type == 'container'){
					item.children.forEach((cItem, cIndex)=>{
						if(cItem.type == 'text') {
							/*dispatch('loadFont', {
								fontFamily:cItem.fontFamily,
								text: cItem.text,
								callback: () => {
									dispatch('updateTween', {topIndex: index, subIndex: cIndex});
								}
							})*/
							fontsUse[cItem.fontFamily] = true;
						}
					});
				}
			});
			Object.keys(fontsUse).filter((item)=>{state.os.localFonts.indexOf(item) < 0}).forEach((item)=>{
				dispatch('loadFont', {
					fontFamily:item,
					text: item.text,
					callback: () => {
						// 图层
						state.project.layers.forEach((lItem, index)=>{
							if(lItem.type == 'text' && lItem.fontFamily == item) {
								dispatch('updateTween', {topIndex: index, subIndex: -1});
							} else if(lItem.type == 'container'){
								lItem.children.forEach((cItem, cIndex)=>{
									if(cItem.type == 'text' && lItem.fontFamily == item) {
										dispatch('updateTween', {topIndex: index, subIndex: cIndex});
									}
								});
							}
						});
						// 音频
						let fontFamilyInVoice = false;
						state.project.voices.forEach((vItem)=>{
							if(vItem.fontFamily == item) {
								fontFamilyInVoice = true;
							}
						})
						if(fontFamilyInVoice) {
							canvasRender.renderSubtitle({project: state.project, parent: window.stage, timeline: window.timeline});
						}
					}
				})
			})
		},
		// 初始化 网络请求
		init({state, commit, dispatch, getters}){
			dispatch('getSettingFromStorage');
			accessWorder().then(()=>{
				// alert('ddddd');
				state.asmInitedStatus = 'success';
			}, ()=>{
				state.asmInitedStatus = 'error';
			})
			// 如果有numIid
			let numIid = getters.queryObj.numIid
			if(numIid) {
				dispatch('getItemInfoRoot', {numIid});
				dispatch('getPromotionRoot', {numIid})
			}
		},

		// 获取宝贝详情
		getItemInfoRoot({state, commit, dispatch, getters},{numIid}) {
			let req = {
				numIid: numIid,
				fields: 'pic_url,item_img,product_id,price,title',
			}
			http.post(api.getItemInfo, req).then((res)=>{
				
				if(res.status == 200) {
					
					console.log(res.data);
					if(res.data.success) {
						state.goods.list = res.data.item.itemImgs;
						state.goods.price = res.data.item.price;
						state.goods.title = res.data.item.title;
						if(!state.goods.promotionPriceInited) {
							state.goods.promotionPrice = res.data.item.price;
						}
					} else {
						alert(res.data.msg || '获取宝贝信息出错');
					}
					
				} else {
				}
				state.goods.listInited = true;
				if(state.goods.promotionPriceInited) {
					commit('fillGoods');
					// commit('update');
				}
			})
		},
		// 获取宝贝促销价
		getPromotionRoot({state, commit, dispatch, getters},{numIid}){
			let req = {
				numIid: numIid,
			}
			http.post(api.getPromotion, req).then((res)=>{
			
				if(res.status == 200) {
					
					if(res.data.success) {
						let promotionPrice = res.data.promotionPrice;
						// alert((typeof promotionPrice) == 'undefined');
						if(typeof promotionPrice != 'undefined'){
							state.goods.promotionPrice = promotionPrice || state.goods.price;
							// alert(promotionPrice || state.goods.price);
						} else {
							if(state.goods.listInited) {
								// alert('dddd');
								state.goods.promotionPrice = state.goods.price;
							}
						}
					} else {
						// alert(state.goods.price);
						if(state.goods.listInited) {
							state.goods.promotionPrice = state.goods.price;
						}
						// commit('showSnackbar',{text:'获取宝贝促销价出错', timeout: 1000});
					}
				} else {
					if(state.goods.listInited) {
						state.goods.promotionPrice = state.goods.price;
					}
					commit('showSnackbar',{text:'获取宝贝促销价出错(net)', timeout: 1000});
				}
				state.goods.promotionPriceInited = true;
				if(state.goods.listInited) {
					commit('fillGoods');
					// commit('update');
				}
			})
		},
		// 开始生成
		generate({state, commit, dispatch, getters}) {
			dispatch('generateNew');
			return;

			// 弃用 (web RTC有不足之处)
			console.time('startRecord')
			/* dispatch('testImgToVideo', {});
			return;*/
			state.recording = true;
			let prevPosition = 0;
			if(state.timeline) {
				let canvas = document.getElementById('canvas')
				// 开始录制
				var recordRTC = RecordRTC(canvas, {
					type: 'canvas',
					// recorderType: RecordRTC.WhammyRecorder,
					// frameInterval: 5,
					// mimeType: 'video/h264',
					// frameRate: 5,
					useWhammyRecorder: true,
				});
				state.timeline.gotoAndStop(0);
				state.playing = false;
				setTimeout(()=>{
					state.playing = true;
					state.timeline.setPaused(false);

					// 开始录制
					recordRTC.startRecording();

					/* setTimeout(()=>{
						// 结束录制
						recordRTC.stopRecording(function(videoURL) {
							// video.src = videoURL;
		
							var recordedBlob = recordRTC.getBlob();
							util.funDownload(null, recordedBlob, 'video.webm');
							
							// dispatch('convert', {recordedBlob});
							convert(recordedBlob, state.audio, {t: 1 });
							// convertStreams(recordedBlob, audioFile);
		
							recordRTC.getDataURL(function(dataURL) {
								// console.log(dataURL);
								// video.src = dataURL;
							});
						});
						console.log('生成完成');
					}, 1000)*/

					let handle = state.timeline.on('change', ()=>{
						let currentPositon = state.timeline.position;
						if(currentPositon < prevPosition) {
							state.recording = false;
							state.timeline.off('change', handle);
							// 结束录制
							recordRTC.stopRecording(function(videoURL) {
								console.log('d1', Date.now());
								// video.src = videoURL;
			
								var recordedBlob = recordRTC.getBlob();
								console.log('d2', Date.now());
								util.funDownload(null, recordedBlob, 'video.webm');
								
								return;
								// dispatch('convert', {recordedBlob});

								let audioCode = '';

								try{
									if(state.dialogAudio.audioFrom == 'net') {
										if(state.dialogAudio.selectedAudioID != null) {
											audioCode = getters.idMapAudio[state.dialogAudio.selectedAudioID];
										}
									} else if(state.dialogAudio.audioFrom == 'local'){
										audioCode = state.dialogAudio.audioData;
									}

									if(audioCode) {
										let bytes = atob(audioCode);
										var bytesCode = new ArrayBuffer(bytes.length);
										// 转换为类型化数组
										var byteArray = new Uint8Array(bytesCode);
										
										// 将base64转换为ascii码
										for (var i = 0; i < bytes.length; i++) {
											byteArray[i] = bytes.charCodeAt(i);
										}
										// 生成Blob对象（文件对象）
										let b =  new Blob( [bytesCode] , {type : 'audio/wav'});
										// console.log(b);
										audioCode = b;
									}
								}catch(e){
									console.error(e);
								}
								convertStreams(recordedBlob, audioCode, {t: state.timeline.duration / 1000 });
								// convertStreams(recordedBlob, audioFile);
			
								// recordRTC.getDataURL(function(dataURL) {
									// console.log(dataURL);
									// video.src = dataURL;
								// });
							});
							console.log('生成完成');
							console.timeEnd('startRecord')
						}
						prevPosition = currentPositon;
					});

				}, 200)
			}
			
		},
		// 获取合成后的音频
		getGenerateVoice({state, commit, dispatch, getters}, {callback}) {
			let voices = state.project.voices;

			voices.forEach((item)=>{
				console.log(item);
			})
			
			let allVoicesPromises = voices.filter((item)=>{return !!item.data});

			if(allVoicesPromises.length == 0) {
				callback({
					success: true,
					res: null
				})
			}
			
			allVoicesPromises = allVoicesPromises.map((item)=>{
				return new Promise((resolve, reject)=>{
					util.blobToArrayBuffer(item.data).then((data)=>{
						resolve({
							data,
							time: item.time,
						})
					})
				},()=>{})
			})
			
			Promise.all(allVoicesPromises).then((res)=>{

				let padVoices = res.map((item)=>{
					let appender = new WaveEditor();
					return appender.delay([item.data], parseInt(item.time / 10) / 100, 'blob', 'AppendedWav');
				})


				
				let allPadVoicesArrayBuffer = padVoices.map((item)=>{
					return util.blobToArrayBuffer(item);
				})

				if(state.bgMusic) {
					allPadVoicesArrayBuffer.push(util.blobToArrayBuffer(state.bgMusic));
				}

				Promise.all(allPadVoicesArrayBuffer).then((res)=>{
					console.log(res);
					let appender = new WaveEditor();
					//return appender.mix(res, 'play', 'AppendedWav');
					let distAudioList = res.map((item)=>{return new Uint8Array(item)});
					// distAudioList.push(window.music);
					combineAudio(
						distAudioList,
						//[window.music, new Uint8Array(res[0])],
						(res)=>{
							console.log(res);
							if(res.type == 'done') {
								let blob = new Blob([res.data[0].data], {
									type: 'audio/wav'
								});
								// util.funDownload('', blob, 'test.wav');
								util.blobToArrayBuffer(blob).then((data)=>{
									console.log('=======================================',data);
									callback({
										success: true,
										res: data
									})
								})

							} else if(res.type == 'error') {
								state.dialogGenerate.show = false;
								alert('出错:' + res.e.message || '');
							}
						},
						window.timeline.duration / 1000

					);
					

				})
				
			})
			
		},
		// 获取所有的图片帧
		getGenerateImage({state, commit, dispatch, getters}, {callback}) {
			let datas = [];
			console.log('new');

			state.timeline.removeAllEventListeners();
			
			// 时长
			const duration = state.timeline.duration
			let currentPosition = 0;
			state.timeline.gotoAndStop(0.05);
			// 显示弹窗
			state.dialogGenerate.show = true;
			state.dialogGenerate.step = 1;
			// 帧数
			// let f = 12;
			let f = state.dialogSetting.frames;
			// 每帧占用的时间
			let tseperate = 1000 / f;
			state.recording = true;
			var tickHandler = state.timeline.on('change', () => {
				const thisPosition = state.timeline.position;
				console.log('positon', thisPosition);
				//刷新 动画画面
				state.stage.update();

				
				// 获取图片数据(1)
				const base64str = window.canvas.toDataURL('image/jpeg', 0.9);
				var imgdata =  base64str.slice(23)
				var bytes = atob(imgdata);
				//console.log('ddddddddddddddddddddddddddddddddddddddddddddddddd', bytes.slice(0, 100));
				//var bytes = base64;
				var bytesCode = new ArrayBuffer(bytes.length);
				// 转换为类型化数组
				var byteArray = new Uint8Array(bytesCode);
				// 将base64转换为ascii码
				for (var i = 0; i < bytes.length; i++) {
					byteArray[i] = bytes.charCodeAt(i);
				}
				datas.push(byteArray);
							
				if(thisPosition + tseperate < duration) {
					setTimeout(()=>{
						state.timeline.gotoAndStop(thisPosition + tseperate);
					}, 0);
				} else { // 播放结束
					state.recording = false;
					state.timeline.off('change',tickHandler);
					// console.log(datas.length);
					console.log('获取图片帧完毕');
					if(state.playing) {
						state.timeline.gotoAndPlay(0);
					} else{
						state.timeline.gotoAndStop(0);
					}
					callback({
						success: true,
						res: datas,
					})
					/*let audioCode = null;
					try{
						if(state.dialogAudio.audioFrom == 'net') {
							if(state.dialogAudio.selectedAudioID != null) {
								audioCode = getters.idMapAudio[state.dialogAudio.selectedAudioID];
							}
						} else if(state.dialogAudio.audioFrom == 'local'){
							audioCode = state.dialogAudio.audioData;
						}

						if(audioCode) {
							let bytes = atob(audioCode);
							var bytesCode = new ArrayBuffer(bytes.length);
							// 转换为类型化数组
							var byteArray = new Uint8Array(bytesCode);
							
							// 将base64转换为ascii码
							for (var i = 0; i < bytes.length; i++) {
								byteArray[i] = bytes.charCodeAt(i);
							}
							audioCode = byteArray;
						}
					}catch(e) {
						console.error(e);
					}*/
					
				}
				
			});
			state.timeline.gotoAndStop(0);
		},
		// 生成（new）
		generateNew({state, commit, dispatch, getters}) {
			if(state.asmInitedStatus == 'error') {
				alert('视频合成库加载失败，可能无法生成视频。');
				// return;
			}
			let voice = {
				done: false,
				success: false,
				res: ''
			}
			let image = {
				done: false,
				success: false,
				res: ''
			}

			dispatch('getGenerateVoice', {
				callback:(res)=>{
					voice.done = true;
					voice.success = res.success;
					voice.res = res.res;
					if (image.done) {
						dispatch('generateVideoFromImageAndVoice', {voice: voice.res, image: image.res})
					}
				}
			});
			dispatch('getGenerateImage', {
				callback:(res)=>{
					image.done = true;
					image.success = res.success;
					image.res = res.res;
					if (voice.done) {
						dispatch('generateVideoFromImageAndVoice', {voice: voice.res, image: image.res})
					}
				}
				
			});
			
		},
		// 从图片和音频生成视频
		generateVideoFromImageAndVoice({state, commit, dispatch, getters}, {voice, image}) {
			let {width, height} = state.stage.canvas;
			let total = width * height;
			let f = state.dialogSetting.frames;
			// 每帧占用的时间
			let tseperate = 1000 / f;
			// 比特率
			// let bit = (total / 1000 * 5) | 0;
			let bit = (total / 1000 * state.dialogSetting.quality / 10 * f / 10) | 0;
			state.dialogGenerate.step = 2;
			// console.log('voice voice voice voice ',voice);
			// console.log('777777777777777777777777777777777777777777777',new Uint8Array(voice));
			// 转换图片到视频
			convertImageToVideo(
				image,
				voice? new Uint8Array(voice) : null,
				{
					f: f,
					t: state.timeline.duration / 1000,
					b: bit
				},
				(msg)=>{
					if (msg.type == "ready") {
						
					} else if (msg.type == "stdout") {
						
					} else if (msg.type == "start") {
					} else if (msg.type == "done") {
						state.dialogGenerate.show = false;
						setTimeout(()=>{
							commit('showSnackbar', {
								text: '视频生成完毕,请点击链接下载！',
							});
							// alert();
						},0)
						state.dialogDownload.show = true;
						Vue.nextTick(()=>{

						})
					} else if(msg.type == "error") {
						state.dialogGenerate.show = false;
						alert('出错:' + msg.e.message || '');
					}
				}
			);
		},
		// 更新时间轴
		updateTimeline({state, commit, dispatch, getters}, {timeline}) {
			state.timeline = timeline;
			let position = state.position % timeline.duration;
			timeline.gotoAndStop(position);
			state.timeline.setPaused(!state.playing);
			// console.log(timeline);
		},
		// setAudio
		setAudio({state, commit, dispatch, getters}, {file}){
			state.audio = file;
			console.log(state.audio);
		},
		// 转换
		convert({state, commit, dispatch, getters}, {recordedBlob}) {
			console.log('recordedBlob', typeof recordedBlob);
			convert(recordedBlob, state.audio );
		},
		// 测试图片转视频
		testImgToVideo({state, commit, dispatch, getters}) {
			let canvas = document.getElementById('canvas');
			let count = 0;
			let images = [];
			state.project.queue.forEach((item, index)=>{
				if(item.file) {
					images.push(item.file)
				}
				console.log(images.length);
			})
			let fetchImage = function() {
				if(count > 3) {
					convertImageToVideo({images});
					console.log('images.length', images.length);
					console.log(images[0]);
					/* util.blobToUint8Array(window.atob(canvas.toDataURL('image/png').slice(22))).then((res)=>{
						console.log(res);
					})*/
				} else {
					// images.push(util.convertBase64ToBlob(canvas.toDataURL('image/png'), 'byteArray'));
					setTimeout(fetchImage, 100);
				}
				
				count += 1;
			}
			fetchImage();

		},
		// 删除，左移，右移
		setAction({state,commit, dispatch}, {type, index}) {
			let pickItem;
			switch(type) {
				// 向左
				case 'left':
					if(index == 0) {
						return;
					}
					// dispatch('addStep');
					if(state.activeIndex > 0 ) {
						const distIndex = state.activeIndex - 1;
						commit('setActiveIndex',{activeIndex: distIndex});
					}
					pickItem = state.project.queue.splice(index, 1);
					state.project.queue.splice(index - 1,0,pickItem[0]);
					commit('update');
					break;
				// 向右
				case 'right':
					// dispatch('addStep');
					pickItem = state.project.queue.splice(index + 1, 1)
					state.project.queue.splice(index,0,pickItem[0]);
					commit('setActiveIndex',{activeIndex: index + 1});
					commit('update');
					break;
				// 删除
				case 'delete':
					if(state.project.queue.length == 1) {
						alert('不能少于一个模块');
						return;
					}
					if(confirm('确定要删除该模块')) {
						// dispatch('addStep');
						if(index + 1 == state.project.queue.length) {
							commit('setActiveIndex',{activeIndex: index - 1});
						}
						pickItem = state.project.queue.splice(index, 1);
					}
					commit('update');
					break;
				default: break;
			}
		},
		// 设置价格标签
		setEffectWords({state,commit}, {type}) {
			if(state.project.wordEffect != type) {
				state.project.wordEffect = type;
				commit('update');
			}
		},
		// 保存项目到本地
		saveProject({state, commit}) {
			let project = JSON.stringify(utilTimeline.cloneObj(state.project));
			var blob = new Blob([project]);
			util.funDownload('', blob, 'project.temp');
		},
		// 保存到后端
		saveUpload({state, commit}){
			let obj = utilTimeline.cloneObj(state.project);
			obj.layers.forEach((layer)=>{
				if(layer.type == 'image') {
					layer.pic_url = utilTimeline.getPicKeyByItem(layer);
				} else if(layer.type == 'container') {
					layer.children.forEach((clayer)=>{
						if(clayer.type == 'image') {
							clayer.pic_url = utilTimeline.getPicKeyByItem(clayer);
						}
					})
				}
			})
			let distObj = {
				project: obj,
				playing: rootState.playing,
				position:rootState.position,
				topIndex: state.topIndex,
				subIndex: state.subIndex,
				tweenIndex: state.tweenIndex,
			};
			let params = JOSN.stringify(distObj);
		}
		
	},
	modules: {
		dialogGoods,
		dialogImage,
		// dialogTemplate,
		dialogDownload,
		dialogGenerate,
		dialogSetting,
		dialogAudio,
		tl,
		os: optionsSetting,
		dialogVideoClip,
		dialogVoice,
		test,
	}
}
export default store;