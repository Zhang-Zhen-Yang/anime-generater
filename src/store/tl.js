/*
 * @Author: zhangzhenyang 
 * @Date: 2019-03-22 11:25:38 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-03-26 17:47:22
 */

 // 时间轴组件

import http from '../script/http';
import api from '../script/api';

import util from '../script/util';
import utilTimeline from '../script/utilTimeline';
import canvasRender from '../script/canvasRender';
import templateFragment from '../script/templateFragment';
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
    contextMenu: {
      show: true,
      x: 0,
      y: 0,
      menuItems: [
        {
          label: '新建图片图层',
          value: 'image',
        },
        {
          label: '新建文本图层',
          value: 'text',
        },
      ]
    }
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
    // 添加图层，文件夹， 删除图层
		layerAction({state, rootState,commit,dispatch}, {type, layerType}) {
			switch(type) {
        // 图层
        case 0:
          dispatch('addLayer', {layerType});
          break;
        // 文件夹
				case 1:
         break;
        // 删除
        case 2:
          dispatch('removeLayer', {});
				  break;
				default: break;
			}
    },
    // 添加图层
    addLayer({state, rootState,commit,dispatdh}, {layerType}) {

      let newLayer = JSON.parse(JSON.stringify(templateFragment[layerType]));
      rootState.project.layers.push(newLayer);
      let layerLength = rootState.project.layers.length;
      let item = rootState.project.layers[layerLength - 1];
      canvasRender.addLayer({parentType: 'root', parent: window.stage, item,project: rootState.project,timeline: rootState.timeline});
    },
    // 删除图层
    removeLayer({state, rootState,commit,dispatdh}, {}) {
      let activeLayerIndex = rootState.activeLayerIndex;
      let topIndex = typeof activeLayerIndex[0] == 'number' ? activeLayerIndex[0] : -1;
      let subIndex = typeof activeLayerIndex[1] == 'number' ? activeLayerIndex[1] : -1;
      if(topIndex >-1 && subIndex > -1) {
        let currentLayer = rootState.project.layers[topIndex].children[subIndex] || {};
        rootState.project.layers[topIndex].children.splice(subIndex, 1);
        let currentContainer = window.stage.children[topIndex + 1].children[0].children[subIndex];
        
        let currentUUID = currentLayer.UUID;
        let currentTweenObj = currentLayer.tweenObj;
        let currentObj = currentContainer.getChildByName(currentUUID);
        currentContainer.removeChild(currentObj);
        window.timeline.removeTween(currentTweenObj);

      } else if(topIndex > -1){
        let currentLayer = rootState.project.layers[topIndex] || {};
        rootState.project.layers.splice(topIndex, 1);
        let currentContainer = window.stage.children[topIndex + 1];

        window.stage.removeChild(currentContainer);

        let currentUUID = currentLayer.UUID;
        let currentTweenObj = currentLayer.tweenObj;
        /* let currentObj = currentContainer.getChildByName(currentUUID);
        currentContainer.removeChild(currentObj);*/
        window.timeline.removeTween(currentTweenObj);
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
    setActiveTweenVer2({state,rootState,dispatdh}, {t, topIndex, subIndex, tweenIndex}) {
      rootState.playing = false;
      rootState.timeline.setPaused(true);
      state.currentTween = t;
      state.topIndex = topIndex;
      state.subIndex = subIndex;
      state.tweenIndex = tweenIndex;
      if(topIndex >-1 && subIndex > -1) {
        rootState.activeLayerIndex = [topIndex, subIndex];
        let layers = rootState.project.layers[topIndex].children[subIndex] || {};
        let currentPosition = layers.tween ? (layers.tween[tweenIndex].time || 0) : 0;
       
        rootState.timeline.setPosition(currentPosition);
      } else if(topIndex > -1){
        // alert('top');
        rootState.activeLayerIndex = [topIndex];
        let layers = rootState.project.layers[topIndex] || {};
        // 点击当前缓动，时间轴指针要去到的地方
        let currentPosition = layers.tween ? (layers.tween[tweenIndex].time || 0) : 0;

        // 如果超出总时长，位置减1
        if(currentPosition >= rootState.timeline.duration) {
          currentPosition -= 0.01;
        }
        rootState.timeline.setPosition(currentPosition);
      }
    },
    // 开始设定属性值时强制设定时间轴的位置
    startSetValue({state,rootState,dispatch}) {
      let t = state.currentTween;
      let topIndex = state.topIndex;
      let subIndex = state.subIndex;
      let tweenIndex = state.tweenIndex;
  
      dispatch('setActiveTween', {t, topIndex, subIndex, tweenIndex});
    },
    // 更新缓动
    updateTween({state,rootState,dispatdh},{topIndex, subIndex}) {
      let tweenIndex =  state.tweenIndex;
      let currentLayer;
      let currentTweenObj;
      let obj;
      let scale = 1;
      let UUID;
      if(topIndex >-1 && subIndex > -1) {
        currentLayer = rootState.project.layers[topIndex].children[subIndex];
        UUID = currentLayer.UUID;
        currentTweenObj = currentLayer.tweenObj;
        // obj = window.stage.children[topIndex + 1].children[0].children[subIndex].children[0];

      } else if(topIndex > -1){
        currentLayer = rootState.project.layers[topIndex];
        UUID = currentLayer.UUID;
        currentTweenObj = currentLayer.tweenObj;
        // obj = window.stage.children[topIndex + 1].children[0];
      }
      console.log(UUID);
      obj = utilTimeline.getObjByUUID({parent: window.stage, UUID});
      if(currentLayer.type == 'image') {
        scale = util.getImageScale({
          img: obj.image,
          cw: rootState.project.width,
          ch: rootState.project.height,
          type: 'cover'
        });
      }
      let tween = canvasRender.getTween({obj, item: currentLayer, timeline: window.timeline, scale});
      window.timeline.removeTween(currentTweenObj);
      window.timeline.addTween(tween);
    },
    // 添加缓动
    addTween({state,rootState,dispatch},{topIndex, subIndex, position}) {
      state.topIndex = topIndex;
      state.subIndex = subIndex;
      if(subIndex > -1) {
        rootState.activeLayerIndex = [topIndex, subIndex];
      } else {
        rootState.activeLayerIndex = [topIndex];
      }
      let currentLayer = utilTimeline.getCurrentLayer({rootState: rootState});
      let currentUUID = utilTimeline.getCurrentUUID({rootState: rootState});
      let currentObj = utilTimeline.getObjByUUID({parent: window.stage,UUID: currentUUID});
      console.log(currentUUID);
      if(position > rootState.timeline.duration) {
        
      } else {
        rootState.timeline.gotoAndStop(position);
        let newProps = utilTimeline.getCurrentProps({obj: currentObj});
        currentLayer.tween.push({
          action: 'to',
          props: newProps,
          time: position
        })
        dispatch('updateTween', {topIndex, subIndex});
        // console.log(newProps);
      }
    },
    // 测试
    test({state,rootState,dispatdh}) {
      // console.log(window.timeline._tweens[1].target.x);
    }
		
	}// end actions 
}
export default store;
