/*
 * @Author: zhangzhenyang 
 * @Date: 2019-04-20 15:35:36 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-04-25 13:47:49
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
		tok: '24.e829d1ce750c342c063fbca11bca0879.2592000.1558517552.282335-16069189',
	},
	// ---------------------------------------------------------------------------------------------------------
	getters: {
		
	},
	// -----------------------------------------------------------------------------------------------------------
	mutations: {
		
	},
	// ------------------------------------------------------------------------------------------------------------
	actions: {
		fetchTTSAudio({state, commit, dispatch, getters}, {tex, oldTex, spd=5, pit=5, per=0, callback}){
			btts({
				tex: tex,
				tok: state.tok,
				cuid: '1234567JAVA',
				ctp: 1,
				spd: spd,
				pit: pit,
				vol: 10,
				per: per,
				aue: 6,
			}, {
				volume: 0.3,
				autoDestory: true,
				timeout: 10000,
				hidden: false,
				onInit: function (htmlAudioElement) {
				},
				onMySuccess: function(res) {
					// alert('成功');
					console.log(res);
					//  Stream #0:1: Audio: aac, 16000 Hz, mono, fltp, 128 kb/s
					// util.funDownload('', res, 'wordddddddddddf.wav')
					util.blobToArrayBuffer(res).then((r)=>{
						console.log(r);
						var appender = new WaveEditor();
						
						// appender.delay([r], 0.5, 'download', 'AppendedWav');
						callback({
							success: true,
							oldTex,
							tex,
							duration: appender.getDuration(r),
							blob: res,
							spd: spd,
							per: per,
							pit,
						})
					});

				},
				onMp3MySuccess: function(res) {
					util.funDownload('', res, 'wordddddddddddf.mp3')
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



 /**
  * 可用
  * 
  * 婚礼音乐震撼开场曲.wav
	容器：Wave
	总码率：768 kb/s
	大小：3.48 MiB
	时长：37 s 991 ms

	音频()：PCM
	大小：3.48 MiB (100%)
	码率：768 kb/s
	采样率：24.0 kHz
	声道数：2

	====详细信息====

	Format                                   : PCM
	Format settings, Endianness              : Little
	Format settings, Sign                    : Signed
	Codec ID                                 : 1
	Duration                                 : 37 s 991 ms
	Bit rate mode                            : Constant
	Bit rate                                 : 768 kb/s
	Channel(s)                               : 2 channels
	Sampling rate                            : 24.0 kHz
	Bit depth                                : 16 bits
	Stream size                              : 3.48 MiB (100%)
  * 
  * 
  * 不可用
  * wordddddddddddf.wav
	容器：Wave
	总码率：256 kb/s
	大小：44.0 KiB
	时长：1 s 405 ms

	音频()：PCM
	大小：43.9 KiB (100%)
	码率：256 kb/s
	采样率：16.0 kHz
	声道数：1

	====详细信息====

	Format                                   : PCM
	Format settings, Endianness              : Little
	Format settings, Sign                    : Signed
	Codec ID                                 : 1
	Duration                                 : 1 s 405 ms
	Bit rate mode                            : Constant
	Bit rate                                 : 256 kb/s
	Channel(s)                               : 1 channel
	Sampling rate                            : 16.0 kHz
	Bit depth                                : 16 bits
	Stream size                              : 43.9 KiB (100%)
  * 

	test.wav
	容器：Wave
	总码率：256 kb/s
	大小：326 KiB
	时长：10 s 430 ms

	音频()：PCM
	大小：326 KiB (100%)
	码率：256 kb/s
	采样率：16.0 kHz
	声道数：1

	====详细信息====

	Format                                   : PCM
	Format settings, Endianness              : Little
	Format settings, Sign                    : Signed
	Codec ID                                 : 1
	Duration                                 : 10 s 430 ms
	Bit rate mode                            : Constant
	Bit rate                                 : 256 kb/s
	Channel(s)                               : 1 channel
	Sampling rate                            : 16.0 kHz
	Bit depth                                : 16 bits
	Stream size                              : 326 KiB (100%)


  */

 // ffmpeg -i voice1.m4a  -filter_complex adelay="1000|1000"  output.m4a    得以把 voice1.m4a  前面延迟（空白）1000毫秒     中间“|”  表示 左右声道都延迟1000毫秒   后得到一个 output.m4a文件 ，它的时间长度 这个文件比voice1.m4a多出了前面空白的的的1000毫秒，
