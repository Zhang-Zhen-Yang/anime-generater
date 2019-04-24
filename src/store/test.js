/*
 * @Author: zhangzhenyang 
 * @Date: 2019-04-20 15:40:11 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-04-24 16:34:51
 */

// 测试

import http from '../script/http';
import api from '../script/api';
import {convertStreams, accessWorder, convertImageToVideo, combineAudio} from '../script/convert.1.js';
import util from '../script/util';
import Vue from 'vue';
import { join } from 'path';
const store = {
	state: {
		show: false,
	},
	// ---------------------------------------------------------------------------------------------------------
	getters: {
		
	},
	// -----------------------------------------------------------------------------------------------------------
	mutations: {
		
	},
	// ------------------------------------------------------------------------------------------------------------
	actions: {
		convertAudioTest({state, rootState,commit,dispatch}){
			let one = 'http://localhost:8080/audio/one.wav';
			let two = 'http://localhost:8080/audio/two.wav';
			let results = [];

			/* dispatch('request', {link: one, callback: (res)=>{
				results.push(res);
			}});
			dispatch('request', {link: two, callback: (res)=>{
				results.push(res);
			}});

			setTimeout(()=>{
				// combineAudio(results);
			}, 2000)*/
			dispatch('request', {link: 'http://localhost:8080/assets/music.wav', callback: (res)=>{
				window.music = res;
				console.log('222222222222222222222222222222222222222',res);
				// results.push(res);
			}});

			
		},
		request({state, rootState,commit,dispatch}, {link, callback}) {

			var oReq = new XMLHttpRequest();
			oReq.open("GET", link, true);
			oReq.responseType = "arraybuffer";

			oReq.onload = function (oEvent) {
				var arrayBuffer = oReq.response;
				if (arrayBuffer) {
					// alert('dddd');
					console.log('1111111111111111111111111111111111111',arrayBuffer);
					let data = new Uint8Array(arrayBuffer);
					callback(data);
				}
			};

			oReq.send(null);
		}
		
	}// end actions 
}
export default store;