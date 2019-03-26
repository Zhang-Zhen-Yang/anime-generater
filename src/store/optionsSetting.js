/*
 * @Author: zhangzhenyang 
 * @Date: 2019-03-22 11:25:38 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-03-26 11:59:59
 */

 // 时间轴组件

import http from '../script/http';
import api from '../script/api';

import util from '../script/util';
import canvasRender from '../script/canvasRender';
import Vue from 'vue';
const store = {
	state: {
		/* name: 'timeline',
		scale: 0.5,
		offsetX: 0,
		// 显示时间轴的
    duration: 20000,

    // 当前选中的补间
    currentTween: null,
    topIndex: -1,
    subIndex: -1,
    tweenIndex: -1,*/
	},
	// ---------------------------------------------------------------------------------------------------------
	getters: {
		
	},
	// -----------------------------------------------------------------------------------------------------------
	mutations: {
		
	},
	// ------------------------------------------------------------------------------------------------------------
	actions: {
    // 属性变化，更新tween
    propsChange({state, rootState,commit,dispatdh}, {target, currentLayer}){
      let currentTweenObj = currentLayer.tweenObj;
      if(!currentTweenObj) return;
      let scale = 1;
      if(currentLayer.type == 'image') {
        scale = util.getImageScale({
          img: target.image,
          cw: rootState.project.width,
          ch: rootState.project.height,
          type: 'cover'
        });
      }

      window.timeline.removeTween(currentTweenObj);

      console.warn(currentTweenObj.target);
      let tween = canvasRender.getTween({
        obj:currentTweenObj.target,
        item: currentLayer,
        timeline: window.timeline,
        scale,
        f: 'propsChange'
      });
      console.warn('tween', tween);
      
      // tween = cra
      window.timeline.addTween(tween);
      // window.timeline.updateDuration();
      // currentTweenObj.target.rotation = 45;
    },
    // 更改图片
		imageChange({state, rootState,commit,dispatdh}, {img}) {
      let topIndex = rootState.tl.topIndex;
      let subIndex = rootState.tl.subIndex;
      let tweenIndex = rootState.tl.tweenIndex;

      
      if(topIndex > -1 && subIndex > -1) {

        let currentLayer = rootState.project.layers[topIndex].children[subIndex];
        let UUID = currentLayer.UUID;

        let currentContainer = window.stage.children[topIndex + 1].children[0].children[subIndex];
        let currentUUID = currentLayer.UUID;
        let currentTweenObj = currentLayer.tweenObj;

        console.log(currentUUID);
        console.log(currentTweenObj);
        console.log(currentContainer);
        currentLayer.pic_url = img;

        canvasRender.getBitmap({
          item: currentLayer,
          project: rootState.project,
          callback: ({obj, scale}) => {
            console.log(obj);
            console.log(scale);
            let UUID = new util.getUUID().id;

            let prevChild = currentContainer.getChildByName(currentUUID);
            var mask = prevChild.mask;
            if (mask) {
              obj.mask = mask;
            }
            console.log(prevChild.mask);
            currentContainer.addChild(obj);
            currentContainer.swapChildren(prevChild, obj);
            currentContainer.removeChild(prevChild);
            obj.name = UUID;
            currentLayer.UUID = UUID;
            
            let tween = canvasRender.getTween({obj, item: currentLayer, timeline: window.timeline, scale});
            window.timeline.removeTween(currentTweenObj);
            window.timeline.addTween(tween);
          }
        });
        
      } else if(topIndex > -1){
        let currentLayer = rootState.project.layers[topIndex];
        let currentContainer = window.stage.children[topIndex + 1];
        let currentUUID = currentLayer.UUID;
        let currentTweenObj = currentLayer.tweenObj;
        currentLayer.pic_url = img;
        canvasRender.getBitmap({
          item: currentLayer,
          project: rootState.project,
          callback: ({obj, scale}) => {
            console.log(obj);
            console.log(scale);
            let UUID = new util.getUUID().id;
            // alert(currentUUID);
            let prevChild; // = currentContainer.getChildByName(currentUUID);;
            window.stage.children.forEach((item, index)=>{
              // console.log(item);
              let child = item.getChildByName ? item.getChildByName(currentUUID) : null;
              if (child) {
                prevChild = child;
              }
            })
            
            var mask = prevChild ? prevChild.mask : null;
            if (mask) {
              obj.mask = mask;
            }
            // console.log(prevChild.mask);
            /*currentContainer.addChild(obj);
            currentContainer.swapChildren(prevChild, obj);
            currentContainer.removeChild(prevChild);*/
            currentContainer.removeAllChildren();
            currentContainer.addChild(obj);
            obj.name = UUID;
            rootState.project.layers[topIndex].UUID = UUID;
            
            let tween = canvasRender.getTween({obj, item: currentLayer, timeline: window.timeline, scale});
            window.timeline.removeTween(currentTweenObj);
            window.timeline.addTween(tween);
          }
        });
      }
    },
    
		
	}// end actions 
}
export default store;
