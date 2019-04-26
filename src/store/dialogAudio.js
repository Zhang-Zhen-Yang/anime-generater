/*
 * @Author: zhangzhenyang 
 * @Date: 2019-01-21 16:52:24
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: yyyy-01-dd 16:09:26
 */


import http from '../script/http';
import api from '../script/api';
import audios from '../script/audios/audio.js';
import util from '../script/util';
import Vue from 'vue';
const store = {
	state: {
		show: false,
		lastAction: 'loading',
		count: 0,
		list: audios,
		pageNo: 1,
		pageSize: 15,
		selectedAudioID: null,

		audioFrom: 'net',
		audioData: '',
		audioUrl: '',
		audioType: 'audio/mp3',

		audioList: [
			{
				name: '绯闻女孩 - Good Day',
				url: 'audio/绯闻女孩 - Good Day.mp3',
			},
			{
				name: '欧美群星-Ima Boss(Meek Mill and Rick Ross)',
				url: 'audio/欧美群星-Ima Boss(Meek Mill and Rick Ross).mp3',
			},
			{
				name: 'wav 欧美群星-Ima Boss(Meek Mill and Rick Ross)',
				url: 'audio/欧美群星-Ima Boss(Meek Mill and Rick Ross)_WAV.wav',
			},
			{
				name: '早晨轻松愉快的音乐',
				url: 'audio/早晨轻松愉快的音乐.wav',
			},
			{
				name: '鈴木雅之,伊原六花 - ラブ・ドラマティック (TV Size)',
				url: 'audio/鈴木雅之,伊原六花 - ラブ・ドラマティック (TV Size).mp3',
			},
		]

	},
	// ---------------------------------------------------------------------------------------------------------
	getters: {
		idMapAudio(state) {
			let map = {};
			state.list.forEach((item, index) => {
				map[item.id] = item.data;
			})
			return map;
		},
		audioData(state) {

		}
	},
	// -----------------------------------------------------------------------------------------------------------
	mutations: {
		showTemplateDialog(state, {}) {
			state.show = true;
		},
	},
	// ------------------------------------------------------------------------------------------------------------
	actions: {
		// 获取背景音乐
		fetchBgMusic({rootState, state, commit,dispatch}, {item}) {
			dispatch('request', {
				link: item.url,
				callback:(res)=>{
					rootState.bgMusic = res;
					rootState.bgMusicName = item.name;
				}
			})
		},

		request({state, rootState,commit,dispatch}, {link, callback}) {

			var xhr = new XMLHttpRequest();
			xhr.open("GET", link, true);
			xhr.responseType = 'blob';//"arraybuffer";

			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					if (xhr.status == 200 || xhr.status == 304) {
						let blob = xhr.response;
						if(blob) {
							callback(blob);
						}
					} else {
						commit('showSnackbar', {
							text: '加载出错！',
						});
					}
				}
			}
			/* xhr.onload = function (oEvent) {
				let blob = xhr.response;
				if(blob) {
					callback(blob);
				}
			}; */

			xhr.send(null);
		},


		// 获取宝贝列表
		fetchTemplates({rootState, state, commit},{pageNo = 1}){
			
		},
		fetchAudio({rootState, state, commit}) {
			let audioUrl =  `${window.audioAssets}1.a`;
			http.get(audioUrl,{}).then((res)=>{
				if(res.status == 200 || res.status == 304) {
					// let blob = new Blob([Array.prototype.map.call( res.data , function( c ) { return c.charCodeAt(0); } )], {type: "audio/wav"});
					// let blob = new Blob([res.data], {type: "audio/wav"});
					

					try{
						// console.log(res.data.code);
						// 将base64解码
						var bytes = atob(res.data.code);
						//var bytes = base64;
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
						rootState.audio = b;

					}catch(e) {
						console.error(e);
					}
					// console.log(rootState.audio);
					// console.log(res.data);
					/*let fileReader = new FileReader();
					fileReader.onload = function(){
						console.log('success');
						console.log(fileReader.result);
					}
					fileReader.onerror = function(e) {
						console.log(e)
					}
					fileReader.readAsArrayBuffer(new Blob([res.data]));*/
					// console.log(typeof res.data);*/
				} else {
					alert('获取音频失败');
				}
			})
		},
		fetchAudioNew({rootState, state, commit}, {item}) {
			state.selectedAudioID = item.id;
			let audioUrl =  `${window.audioAssets}${item.url}`;

			let sn = document.createElement('script');
			sn.id = item.id;
			sn.src = audioUrl; 
			document.body.appendChild(sn);

			return;
			http.get(audioUrl,{}).then((res)=>{
				console.log(res.data.id)
				let id = res.data.id;
				state.list.forEach((item, index)=>{
					if(item.id == id){
						state.list[index].data = res.data.code;
					}
				})
				
				/*let bytes = atob(res.data.code);
				var bytesCode = new ArrayBuffer(bytes.length);
				// 转换为类型化数组
				var byteArray = new Uint8Array(bytesCode);
				
				// 将base64转换为ascii码
				for (var i = 0; i < bytes.length; i++) {
					byteArray[i] = bytes.charCodeAt(i);
				}
				// 生成Blob对象（文件对象）
				let b =  new Blob( [bytesCode] , {type : 'audio/mp3'});
				// console.log(b);
				rootState.audio = b;*/
			})
		},
		jsonpCallback({rootState, state, commit}, data) {

			let id = data.id;
			state.list.forEach((item, index)=>{
				if(item.id == id){
					state.list[index].data = data.code;
				}
			})
			let sn = document.getElementById(id);
			if(sn) {
				document.body.removeChild(sn);
			}
			if(!rootState.playing) {
				commit('togglePlayState')
			}
		}
		
	}// end actions 
}
export default store;
