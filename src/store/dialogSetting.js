/*
 * @Author: zhangzhenyang 
 * @Date: 2019-02-10 16:46:16 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-05-10 11:13:23
 */


import http from '../script/http';
import api from '../script/api';

import util from '../script/util';
import Vue from 'vue';
const store = {
	state: {
		show: false,
		lastAction: 'loading',
		quality: 50,
		frames: 20,
		encoder: 'mpeg4',
		switchShow: false,
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
		}
		
		
	}// end actions 
}
export default store;
