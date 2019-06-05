/*
 * @Author: zhangzhenyang 
 * @Date: 2019-02-10 16:46:16 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-06-05 09:24:15
 */


import http from '../script/http';
import api from '../script/api';

import util from '../script/util';
import Vue from 'vue';
const store = {
	state: {
		show: false,
		lastAction: 'loading',
		quality: 50,// 生成质量
		frames: 20, // 帧数
		encoder: 'mpeg4',// 编码类型
		switchShow: false,
		imageQuality: 90,// 图片质量
		totalMemory: 128// 分配的内存大小
	},
	// ---------------------------------------------------------------------------------------------------------
	getters: {
		
	},
	// -----------------------------------------------------------------------------------------------------------
	mutations: {
		showSettingDialog(state, {}) {
			state.show = true;
		},
	},
	// ------------------------------------------------------------------------------------------------------------
	actions: {
		getSettingFromStorage({rootState,state}) {
			let quality = localStorage.getItem('setting-quality');
			let frames = localStorage.getItem('setting-frames');
			let encoder = localStorage.getItem('setting-encoder');
			let asmVer = localStorage.getItem('setting-asmVer');

			let imageQuality = localStorage.getItem('setting-imageQuality');
			let totalMemory = localStorage.getItem('setting-totalMemory');
			
			if(quality) {
				state.quality = quality;
			}
			if(frames) {
				state.frames = frames;
			}
			if(encoder) {
				state.encoder = encoder;
			}
			if(asmVer) {
				rootState.convertVer = asmVer;
			}
			if(imageQuality) {
				state.imageQuality = imageQuality;
			}
			if(totalMemory) {
				state.totalMemory = totalMemory;
			}
		}
		
		
	}// end actions 
}
export default store;
