/*
 * @Author: zhangzhenyang 
 * @Date: 2019-03-22 11:25:38 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-03-25 17:53:05
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
    // 更新位置
		swipeChild({rootState, state, commit}, {fromIndex, toIndex}) {
			let pickItem = rootState.project.layers.splice(fromIndex,1);
			console.log([fromIndex, toIndex]);
      rootState.project.layers.splice(toIndex, 0, pickItem[0]);
      let prevChild = window.stage.children[fromIndex - 0 +1];
      let nextChild = window.stage.children[toIndex - 0 + 1];
      console.log([fromIndex, toIndex]);
     console.log([prevChild, nextChild]);
      // window.stage.swipe();
      window.stage.swapChildren(nextChild, prevChild);
		},
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
      rootState.playing = false;
      rootState.timeline.setPaused(true);
      state.currentTween = t;
      state.topIndex = topIndex;
      state.subIndex = subIndex;
      state.tweenIndex = tweenIndex;

      if(topIndex >-1 && subIndex > -1) {
        rootState.activeLayerIndex = [topIndex, subIndex];
        let layers = rootState.project.layers[topIndex].children[subIndex] || {};
        let currentPosition = 0;
        for(let i =0; i < (tweenIndex + 1); i++) {
          currentPosition += layers.tween ? (layers.tween[i].time || 0) : 0;
        }
        rootState.timeline.setPosition(currentPosition);
      } else if(topIndex > -1){
        // alert('top');
        rootState.activeLayerIndex = [topIndex];
        let layers = rootState.project.layers[topIndex] || {};
        // 点击当前缓动，时间轴指针要去到的地方
        let currentPosition = 0;
        for(let i =0; i < (tweenIndex + 1); i++) {
          // alert(layers.tween[i].time);
          currentPosition += layers.tween ? (layers.tween[i].time || 0) : 0;
        }
        
        // alert(currentPosition);
        // 如果超出总时长，位置减1
        if(currentPosition >= rootState.timeline.duration) {
          currentPosition -= 0.01;
        }
        rootState.timeline.setPosition(currentPosition);
      }
    },
    startSetValue({state,rootState,dispatch}) {
      let t = state.currentTween;
      let topIndex = state.topIndex;
      let subIndex = state.subIndex;
      let tweenIndex = state.tweenIndex;
  
      dispatch('setActiveTween', {t, topIndex, subIndex, tweenIndex});
    },
    // 测试
    test({state,rootState,dispatdh}) {
      // console.log(window.timeline._tweens[1].target.x);
    }
		
	}// end actions 
}
export default store;
