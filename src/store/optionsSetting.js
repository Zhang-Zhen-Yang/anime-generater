/*
 * @Author: zhangzhenyang 
 * @Date: 2019-03-22 11:25:38 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-04-18 15:46:26
 */
 // 时间轴组件
import http from '../script/http';
import api from '../script/api';

import util from '../script/util';
import utilTimeline from '../script/utilTimeline';
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
    loadedFonts: {},
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
    propsChange({state, rootState,commit,dispatch}, {target}){
      
      let currentLayer = utilTimeline.getCurrentLayer({rootState: rootState});
      let currentTweenObj = currentLayer.tweenObj;
      if(!currentTweenObj) return;

      let scale = 1;
      if(currentLayer.type == 'image' && target.image) {
        scale = util.getImageScale({
          img: target.image,
          cw: rootState.project.width,
          ch: rootState.project.height,
          type: 'cover'
        });
      }

      // alert(window.timeline._tweens.length);
      window.timeline.removeTween(currentTweenObj);
      // alert(window.timeline._tweens.length);

      // console.warn(currentTweenObj.target);
      let tween = canvasRender.getTween({
        obj:currentTweenObj.target,
        item: currentLayer,
        timeline: window.timeline,
        scale,
        f: 'propsChange'
      });
      // console.warn('tween', tween);
      
      // tween = cra
      window.timeline.addTween(tween);
      // alert(window.timeline._tweens.length);
      // currentLayer.tweenObj = tween;
      // window.timeline.updateDuration();
      // currentTweenObj.target.rotation = 45;
    },
    // 更改图片
		imageChange({state, rootState,commit,dispatch}, {img}) {
      dispatch('addStep');
      let has = false;
      if(img.indexOf('data:image/')) {
        for(let i in window.localImages) {
          if(window.localImages[i] == img) {
            has = true;
          }
        }
        if(!has) {
          let UUID = new util.getUUID().id;
          window.localImages[UUID] = img;
        }
      }

      console.log('window.localImages', Object.keys(window.localImages).length);

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
    // 加载字体
    loadFont({state, rootState,commit,dispatch}, {fontFamily, text}) {
      if(state.loadedFonts[fontFamily]) {
        dispatch('upadateWordLayerByText', {text});
        return;
      }
      WebFont.load({
        custom: {
          families: [fontFamily]
        },
        timeout: 40000,
        active: ()=>{},
        ininactive: ()=>{},
        loading: ()=>{},
        fontactive: ()=>{
          state.loadedFonts[fontFamily] = true;
          dispatch('upadateWordLayerByText', {text});
        },
        fontinactive: ()=>{},
      });
    },
    // 通过text更新该层
    upadateWordLayerByText({state, rootState,commit,dispatch}, {text}) {
      let items = [];
      rootState.project.layers.forEach((layer, lindex)=>{
        if(layer.type == 'text' && layer.text == text) {
          items.push({l: layer.tweenObj});
        } else if (layer.type == 'container') {
          layer.children.forEach((clayer, clindex)=>{
            if(clayer.type == 'text' && clayer.text == text) {
              items.push({l: clayer});
            } 
          })
        }
      })

      items.forEach((item)=>{
        window.timeline.removeTween(item.l.tweenObj);
        let tween = canvasRender.getTween({
          obj: item.l.obj,
          item: item.l,
          timeline: window.timeline,
          scale: 1,
          f: 'propsChange'
        });
        window.timeline.addTween(tween);
      })
    },
    // 设置对齐
    setAlign({state, rootState,commit,dispatch}, {type}) {
      dispatch('checkAddTweenIf');
      let currentLayer = utilTimeline.getCurrentLayer({rootState});
      let layerType = currentLayer.type;
      let {width, height} = rootState.project;
      let tweenIndex = rootState.tl.tweenIndex;
      let bounds = currentLayer.obj.getBounds();
      let isChildren = false;
      let parentObj = rootState.project.layers[rootState.tl.topIndex].obj;
      if(rootState.tl.topIndex > -1 && rootState.tl.subIndex > -1) {
        isChildren = true;
      }
      // alert(isChildren);
     
      // alert(type);
      switch(type) {
        case 'left':
          currentLayer.tween[tweenIndex].props.x = currentLayer.obj.getBounds().width *  currentLayer.obj.scaleX / 2;
          break;
        case 'center':
          if(isChildren) {
            currentLayer.tween[tweenIndex].props.x = parentObj.getBounds().width / 2;
          } else {
            currentLayer.tween[tweenIndex].props.x = width / 2;
          }
          break;
        case 'right':
          if(isChildren) {
            currentLayer.tween[tweenIndex].props.x = parentObj.getBounds().width - currentLayer.obj.getBounds().width *  currentLayer.obj.scaleX / 2;
          } else {
            currentLayer.tween[tweenIndex].props.x = width - currentLayer.obj.getBounds().width *  currentLayer.obj.scaleX / 2;
          }
          break;
        case 'top':
          currentLayer.tween[tweenIndex].props.y = currentLayer.obj.getBounds().height *  currentLayer.obj.scaleY / 2;
          break;
        case 'middle':
          if(isChildren) {
            currentLayer.tween[tweenIndex].props.y = parentObj.getBounds().height / 2;
          } else {
            currentLayer.tween[tweenIndex].props.y = height / 2;
          }
          break;
        case 'bottom':
          if(isChildren) {
            currentLayer.tween[tweenIndex].props.y = parentObj.getBounds().height - currentLayer.obj.getBounds().height *  currentLayer.obj.scaleY / 2;
          } else {
            currentLayer.tween[tweenIndex].props.y = height - currentLayer.obj.getBounds().height *  currentLayer.obj.scaleY / 2;
          }
          break;
        default: break;
      }
      // currentLayer.tween[state.tweenIndex].props.y = currentLayer.obj.y;
      dispatch('propsChange', {target: currentLayer.obj});
    }
	}// end actions 
}
export default store;
