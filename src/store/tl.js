/*
 * @Author: zhangzhenyang 
 * @Date: 2019-03-22 11:25:38 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-03-23 17:23:25
 */

 // 时间轴组件

import http from '../script/http';
import api from '../script/api';

import util from '../script/util';
import Vue from 'vue';
const store = {
	state: {
		name: 'timeline',
		scale: 0.5,
		offsetX: 0,
		// 显示时间轴的
    duration: 20000,

    // 当前选中的补间
    currentTween: null,
    topIndex: -1,
    subIndex: -1,
    tweenIndex: -1,
	},
	// ---------------------------------------------------------------------------------------------------------
	getters: {
		
	},
	// -----------------------------------------------------------------------------------------------------------
	mutations: {
		
	},
	// ------------------------------------------------------------------------------------------------------------
	actions: {
    // 添加图层，删除图层
		layerAction({state, rootState,commit,dispatdh}, {type}) {
			switch(type) {
        case 0:
          rootState.project.layers.push({
            type: 'image',
            UUID: 'test',
            pic_url: 'http://n.sinaimg.cn/sinacn13/400/w720h1280/20180406/7d86-fysuuyc1778445.png',
            visible: true,
            editable: true,
            tween: [
              {
                action: 'to',
                props: {
                  regX: 'ow / 2',
                  regY: 'oh / 2',
                  x: 'cw / 2',
                  y: 'ch / 2',
      
                },
                time: 0
              },
              {
                action: 'to',
                props: {
                  
                  rotation: -45
                },
                pic_url: 'https://img.moegirl.org/common/thumb/4/4e/%E5%88%91%E9%83%A8%E5%A7%AC3.png/200px-%E5%88%91%E9%83%A8%E5%A7%AC3.png',
                time: 1000,
                ease: 'linear'
              },
              {
                action: 'to',
                props: {
                  scaleX: 'cw / ow',
                  scaleY: 'cw / ow',
                },
                time: 1000,
                ease: 'linear',
              },
              {
                action: 'to',
                props: {
                  rotation: 360,
                },
                time: 2000,
                ease: 'linear',
              }
            ]
          },)
				 break;
				case 1:
				 break;
				case 2:
				 break;
				default: break;
			}
    },
    // 设置当前选中的补间
    setActiveTween({state,rootState,dispatdh}, {t, topIndex, subIndex, tweenIndex}) {
      state.currentTween = t;
      state.topIndex = topIndex;
      state.subIndex = subIndex;
      state.tweenIndex = tweenIndex;

      if(subIndex > -1) {
        rootState.activeLayerIndex = [topIndex, subIndex]
      } else {
        rootState.activeLayerIndex = [topIndex]
      }
    }
		
	}// end actions 
}
export default store;
