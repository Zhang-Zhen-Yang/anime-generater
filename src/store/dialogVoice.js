/*
 * @Author: zhangzhenyang 
 * @Date: 2019-04-20 15:35:36 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-04-20 15:36:21
 */
// 文本转语音

import http from '../script/http';
import api from '../script/api';

import util from '../script/util';
import Vue from 'vue';
const store = {
	state: {
		show: false,
		voice: [
			{
				name: '小燕',
				value: 'xiaoyan',
			},
			{
				name: '许久',
				value: 'aisjiuxu',
			},
			{
				name: '小萍',
				value: 'aisxping',
			},
			{
				name: '小婧',
				value: 'aisjinger',
			},
			{
				name: '许小宝',
				value: 'aisbabyxu',
			},
		]
	},
	// ---------------------------------------------------------------------------------------------------------
	getters: {
		
	},
	// -----------------------------------------------------------------------------------------------------------
	mutations: {
		
	},
	// ------------------------------------------------------------------------------------------------------------
	actions: {
		
		
	}// end actions 
}
export default store;
