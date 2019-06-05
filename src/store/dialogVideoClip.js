/*
 * @Author: zhangzhenyang 
 * @Date: 2019-04-20 14:34:53 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-06-05 17:36:10
 */


import http from '../script/http';
import api from '../script/api';

import util from '../script/util';
import Vue from 'vue';

import {convertStreams, accessWorker, convertImageToVideo, combineAudio} from '../script/convert.1.js';
import {convertStreams2, accessWorker2, convertImageToVideo2, combineAudio2, convertTo264, getVideoFrames2, runCommand2} from '../script/convert.2.js';

const store = {
	state: {
		show: false,
		item: null,
		src: null,
		start_time: 0,
		end_time: 0,
		// 存放本地视频数据 UUID: ArrayBuffer
		localVideo: {

		},
	},
	// ---------------------------------------------------------------------------------------------------------
	getters: {
		
	},
	// -----------------------------------------------------------------------------------------------------------
	mutations: {
		
	},
	// ------------------------------------------------------------------------------------------------------------
	actions: {
		// 获取视频信息
		getVideoMessage({state, commit, dispatch, getters}, {data, name, size,callback}) {
			let fps = 1;
			let UUID = new util.getUUID().id;
			/* state.localVideo[UUID] = {
				data,
				name,
				size,
				list: [],
				thumbnails: [],// 存放缩略图 
				duration: 0,
				canplay: false,
				lastAction: 'initing',
			}*/
			Vue.set(state.localVideo, UUID, {
				data,
				name,
				size,
				list: [],
				thumbnails: [],// 存放缩略图 
				duration: 0,
				canplay: false,
				lastAction: 'initing',
				fps
			})

			let video = document.createElement('video');

			let blob = new Blob([data], {type: 'video/mp4'});
			let url = URL.createObjectURL(blob);
			video.src = url;
			
			// 视频能在网页播放
			video.onloadedmetadata = ()=>{
				console.log(video.duration);
				state.localVideo[UUID].canplay = true;
				state.localVideo[UUID].duration = video.duration;

				callback({
					uuid: UUID
				})
				video = null;

			}
			// 视频不能在网页播放
			video.onerror = ()=>{
				let duration = 0;
				callback({
					uuid: UUID
				})
				state.localVideo[UUID].canplay = false;
				let files = [
					{
						name: 'input.mp4',
						data: new Uint8Array(data)
					}
				]
				let promiseVideoData = new Promise((resolve, reject) => {
					let command = `-i input.mp4`;
					runCommand2({files, command}, (res)=>{
						if(res.type == 'stdout') {
							if(res.data.indexOf('Duration') > -1){
								
								// alert(util.getDurationByMessage({message: res.data}));
								let duration = util.getDurationByMessage({message: res.data});
								state.localVideo[UUID].duration = duration;
								state.localVideo[UUID].lastAction = 'duration';
								resolve({duration});
							}
						} else if (res.type == 'done') {

						}
					})

				});
				
				promiseVideoData.then(({duration})=>{
					console.log('duration', duration);
					let t;
					if(duration > 60) {
						t = 60;
					}
					let command = `-i input.mp4 -f image2 -vf fps=fps=${fps},scale=w=300:h=300:force_original_aspect_ratio=decrease,showinfo ${t ? ('-t '+t) : ''} -an out%d.jpeg`;
					runCommand2({files, command}, (res)=>{
						console.log(res);
						if(res.type == 'stdout') {
							if(res.data.indexOf('Duration') > -1){
								// alert(res.data);
								// let 
								state.localVideo[UUID].duration = util.getDurationByMessage({message: res.data});
								state.localVideo[UUID].lastAction = 'duration';
							}
						} else if (res.type == 'done') {
							state.localVideo[UUID].thumbnails = res.data.map((item)=>{
								console.log(item);
								// return 'https://imgs.aixifan.com/content/2019_5_13/1.5577201185622222E9.png';
								let url = URL.createObjectURL(new Blob([item.data], {type: 'image/jpeg'}));
								return url;
							})
							state.localVideo[UUID].lastAction = 'done';
						}
		
					});
				}, ()=>{

				});

				
			}

		},
		
	}// end actions 
}
export default store;
