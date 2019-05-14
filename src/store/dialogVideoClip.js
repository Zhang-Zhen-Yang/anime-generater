/*
 * @Author: zhangzhenyang 
 * @Date: 2019-04-20 14:34:53 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-05-14 17:30:45
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
		getVideoMessage({state, commit, dispatch, getters}, {data, name, size}) {
			let UUID = new util.getUUID().id;
			state.localVideo[UUID] = {
				data,
				name,
				size,
				list: [],
				thumbnails: [],// 存放缩略图 
				duration: 0
			}

			let files = [
				{
					name: 'input.mp4',
					data: new Uint8Array(data)
				}
			]

			let command = `-i input.mp4 -f image2 -vf fps=fps=${1},scale=w=500:h=500:force_original_aspect_ratio=decrease -an out%d.jpeg`;

			runCommand2({files, command}, (res)=>{
				console.log(res);
				if(res.type == 'stdout') {
					if(res.data.indexOf('Duration') > -1){
						alert(res.data);
						// let 
					}
				} else if (res.type == 'done'){

				}

			});

		},
		
	}// end actions 
}
export default store;
