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
				name: '鼓舞人心激励前进背景配乐',
				url: '0.mp3'
			},
			{
				name: '快乐轻松愉悦的背景音乐',
				url: '1.mp3'
			},
			{
				name: '正能量团队精神背景配乐',
				url: '2.mp3'
			},
			{
				name: '轻松温暖感人背景音乐',
				url: '3.mp3'
			},
			{
				name: '唯美的旋律动感的鼓点',
				url: '4.mp3'
			},
			{
				name: '日系小清新的动漫配乐',
				url: '5.mp3'
			},
			{
				name: '轻音乐小清新纯正音符',
				url: '6.mp3'
			},
			{
				name: '安静轻松背景配乐',
				url: '7.mp3'
			},
			{
				name: '轻松欢乐的乌克丽丽和口哨声组成的快乐素材',
				url: '8.mp3'
			},
			{
				name: '抒情正能量背景音乐',
				url: '9.mp3'
			},
			{
				name: '充满正能量的素材音',
				url: '10.mp3'
			},
			{
				name: '感动催泪的背景音乐',
				url: '11.mp3'
			},
		].map((item)=>{return {name: item.name,url: `${window.audioAssets}${item.url}`}})

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
							// alert('加载成功！');
							commit('showSnackbar',{
								text: '加载背景音乐成功！',
								timeout: 1000
							});
						}
					} else {
						commit('showSnackbar', {
							text: '加载背景音乐出错！',
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
		// 不用
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
		// 不用
		fetchAudioNew({rootState, state, commit}, {item}) {
			state.selectedAudioID = item.id;
			let audioUrl =  `${window.audioAssets}${item.url}`;

			let sn = document.createElement('script');
			sn.id = item.id;
			sn.src = audioUrl; 
			document.body.appendChild(sn);

			return;
		},
		//  不用
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
				commit('togglePlayState');
			}
		}
		
	}// end actions 
}
export default store;
