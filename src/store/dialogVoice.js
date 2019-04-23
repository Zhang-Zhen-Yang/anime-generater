/*
 * @Author: zhangzhenyang 
 * @Date: 2019-04-20 15:35:36 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-04-23 17:18:26
 */
// 文本转语音 百度tts

import http from '../script/http';
import api from '../script/api';

import util from '../script/util';
import Vue from 'vue';
import { join } from 'path';
import { convertStreams } from '../script/convert.1';
import btts from '../script/baidu_tts_cors';
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
		fetchTTSAudio({state, commit, dispatch, getters}, {tex, oldTex, callback}){
			btts({
				tex: tex,
				tok: '24.e829d1ce750c342c063fbca11bca0879.2592000.1558517552.282335-16069189',
				cuid: '1234567JAVA',
				ctp: 1,
				spd: 5,
				pit: 5,
				vol: 15,
				per: 0,
				aue: 6,
			}, {
				volume: 0.3,
				autoDestory: true,
				timeout: 10000,
				hidden: false,
				onInit: function (htmlAudioElement) {
				},
				onMySuccess: function(res) {
					alert('成功');
					console.log(res);
					util.blobToArrayBuffer(res).then((r)=>{
						console.log(r);
						var appender = new WaveEditor();

						appender.delay([r], 0.5, 'download', 'AppendedWav');
						callback({
							success: true,
							oldTex,
							tex,
							duration: appender.getDuration(r),
							blob: res,
						})
					});

				},
				onError: function(text) {
					alert(text);
					callback({
						success: false,
						oldTex,
						tet
					})
					
				},
				onTimeout: function () {
					alert('timeout');
					callback({
						success: false,
						oldTex,
						tet
					})
				}
			});

		},
		getTTSAudio({state, commit, dispatch, getters}, {text} = {text: ''}) {
			// let tempText = '偶像，是女孩子们一直以来的憧憬。但能站在顶点的，只有仅仅数人。13位少女，就此经她们所属的事务所"765 Production"，跨进了那个充满竞争的世界。出道约半年，事务所来了一位全新的制作人。他跟少女们都下定决心，向顶级偶像之路进发。';
			// let tempText = '做事一本正经，对于歌唱有比普通人多一倍的热情和才能，觉得不能唱歌就活不下去，其实是为了已去世的弟弟如月优而唱歌。对唱歌以外的东西没有兴趣，所以一开始时很排斥"呱呱厨房"，但是在贵音和制作人的帮助下放下偏见。在意自己的小胸部，有着奇怪的笑点，不擅长使用电子设备。';
			let tempText = '偶像，是女孩子们一直以来的憧憬。';

			btts({
				tex: tempText,
				tok: '24.e829d1ce750c342c063fbca11bca0879.2592000.1558517552.282335-16069189',
				cuid: '1234567JAVA',
				ctp: 1,
				spd: 5,
				pit: 5,
				vol: 15,
				per: 3,
				aue: 6,
			}, {
				volume: 0.3,
				autoDestory: true,
				timeout: 10000,
				hidden: false,
				onInit: function (htmlAudioElement) {
				},
				onSuccess: function(htmlAudioElement) {
					console.log(htmlAudioElement);
					// audio = htmlAudioElement;
					// playBtn.innerText = '播放';
				},
				onMySuccess: function(res) {
					alert('成功');
					console.log(res);
					util.blobToArrayBuffer(res).then((r)=>{
						console.log(r);
						var appender = new WaveEditor();
						appender.delay([r], 0.5, 'download', 'AppendedWav');
					});

				},
				onError: function(text) {
					alert(text);
					
				},
				onTimeout: function () {
					alert('timeout')
				}
			});
			

		}
		
	}// end actions 
}
export default store;

/**
 * tex	必填	合成的文本，使用UTF-8编码。小于2048个中文字或者英文数字。（文本在百度服务器内转换为GBK后，长度必须小于4096字节）
	tok	必填	开放平台获取到的开发者access_token（见上面的“鉴权认证机制”段落）
	cuid	必填	用户唯一标识，用来计算UV值。建议填写能区分用户的机器 MAC 地址或 IMEI 码，长度为60字符以内
	ctp	必填	客户端类型选择，web端填写固定值1
	lan	必填	固定值zh。语言选择,目前只有中英文混合模式，填写固定值zh
	spd	选填	语速，取值0-15，默认为5中语速
	pit	选填	音调，取值0-15，默认为5中语调
	vol	选填	音量，取值0-15，默认为5中音量
	per	选填	发音人选择, 0为普通女声，1为普通男生，3为情感合成-度逍遥，4为情感合成-度丫丫，默认为普通女声
	aue	选填	3为mp3格式(默认)； 4为pcm-16k；5为pcm-8k；6为wav（内容同pcm-16k）; 注意aue=4或者6是语音识别要求的格式，但是音频内容不是语音识别要求的自然人发音，所以识别效果会受影响。
 */
