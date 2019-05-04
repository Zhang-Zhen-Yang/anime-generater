/*
 * @Author: zhangzhenyang 
 * @Date: 2019-03-22 11:25:38 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-05-04 16:22:43
 */
 // 时间轴组件
import http from '../script/http';
import api from '../script/api';

import util from '../script/util';
import utilTimeline from '../script/utilTimeline';
import canvasRender from '../script/canvasRender';
import VideoCaptureClass from '../script/videoCapture';
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
      let currentVideoTweenObj = currentLayer.videoTweenObj;

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
      window.timeline.removeTween(currentVideoTweenObj);
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
      tween.forEach((t)=>{
        window.timeline.addTween(t);
      })
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
            tween.forEach((t)=>{
              window.timeline.addTween(t);
            })
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
    // 更改视频片段
    videoChange({state, rootState,commit,dispatch},{start_time, end_time, src, item, callback}) {
      item.start_time = start_time;
      item.end_time = end_time;
      item.src = src;
      let videoCapture = new VideoCaptureClass({
        src: item.src,
        start_time: item.start_time / 1000,
        end_time: item.end_time / 1000,
        interval: item.interval / 1000,
      })
      let videoContainer = item.obj;
      if(item.videoObj) {
        console.log(item.videoObj);
        item.videoObj.cancel();
      }
      item.videoObj = videoCapture;
      let promise = videoCapture.start();
      promise.then((res)=>{
        if(res.success) {
          videoContainer.setBounds(0, 0, res.width, res.height);
          videoContainer.set({
            regX: res.width / 2,
            regY: res.height / 2,
          })
          item.list = res.list;

          let tweenObj = item.tweenObj;
          let videoTweenObj = item.videoTweenObj;
          timeline.removeTween(tweenObj);
          timeline.removeTween(videoTweenObj);
          let tween = canvasRender.getTween({obj: item.obj, item, timeline: window.timeline, scale:1});
          tween.forEach((i)=>{
            timeline.addTween(i);
          })
          item.lastAction = 'success';
        } else {
          item.lastAction = 'error';
        }
      }, () => {
        item.lastAction = 'error';
      });

    },
    // 加载字体
    loadFont({state, rootState,commit,dispatch}, {fontFamily, text, callback}) {
      if(state.loadedFonts[fontFamily]) {
        if(callback) {
          callback();
        } else {
          dispatch('upadateWordLayerByText', {text});
        }
        
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
        // 成功
        fontactive: ()=>{
          state.loadedFonts[fontFamily] = true;
          if(callback) {
            callback();
          } else {
            dispatch('upadateWordLayerByText', {text});
          }
          /* dispatch('updateTween', {
            topIndex: rootState.tl.topIndex,
            subIndex: rootState.tl.subIndex
          })*/
        },
        // 失败
        fontinactive: ()=>{},
      });
    },
    // 通过text更新该层
    upadateWordLayerByText({state, rootState,commit,dispatch}, {text}) {
      let items = [];
      rootState.project.layers.forEach((layer, lindex)=>{
        // alert([text, layer.text]);
        if(layer.type == 'text' && layer.text == text) {
          // let obj = layer.obj;
          items.push({l: layer.tweenObj,topIndex: lindex, subIndex: -1});
        } else if (layer.type == 'container') {
          layer.children.forEach((clayer, clindex)=>{
            if(clayer.type == 'text' && clayer.text == text) {
              items.push({l: clayer, topIndex: lindex, subIndex: clindex});
            } 
          })
        }
      })
      // alert(items.length);
      items.forEach((item)=>{
        dispatch('updateTween', {
          topIndex: item.topIndex,
          subIndex: item.subIndex
        })

        /*window.timeline.removeTween(item.l.tweenObj);
        let tween = canvasRender.getTween({
          obj: item.l.obj,
          item: item.l,
          timeline: window.timeline,
          scale: 1,
          f: 'propsChange'
        });
        tween.forEach((item,index)=>{
          window.timeline.addTween(item);
        })*/
      })
    },
    // 设置对齐
    setAlign({state, rootState,commit,dispatch}, {type}) {
      dispatch('addStep');
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
          if(isChildren) {
            currentLayer.tween[tweenIndex].props.x = -(parentObj.getBounds().width - currentLayer.obj.getBounds().width *  currentLayer.obj.scaleX) / 2;
          } else {
            currentLayer.tween[tweenIndex].props.x = currentLayer.obj.getBounds().width *  currentLayer.obj.scaleX / 2;
          }
          break;
        case 'center':
          if(isChildren) {
            currentLayer.tween[tweenIndex].props.x = 0; // parentObj.getBounds().width / 2;
          } else {
            currentLayer.tween[tweenIndex].props.x = width / 2;
          }
          break;
        case 'right':
          if(isChildren) {
            currentLayer.tween[tweenIndex].props.x = (parentObj.getBounds().width - currentLayer.obj.getBounds().width *  currentLayer.obj.scaleX) / 2;
            // parentObj.getBounds().width - currentLayer.obj.getBounds().width *  currentLayer.obj.scaleX / 2;
          } else {
            currentLayer.tween[tweenIndex].props.x = width - currentLayer.obj.getBounds().width *  currentLayer.obj.scaleX / 2;
          }
          break;
        case 'top':
        if(isChildren) {
          currentLayer.tween[tweenIndex].props.y = -(parentObj.getBounds().height - currentLayer.obj.getBounds().height *  currentLayer.obj.scaleY) / 2;
        } else {
          currentLayer.tween[tweenIndex].props.y = currentLayer.obj.getBounds().height *  currentLayer.obj.scaleY / 2;

        }
          break;
        case 'middle':
          if(isChildren) {
            currentLayer.tween[tweenIndex].props.y = 0; // parentObj.getBounds().height / 2;
          } else {
            currentLayer.tween[tweenIndex].props.y = height / 2;
          }
          break;
        case 'bottom':
          if(isChildren) {
            currentLayer.tween[tweenIndex].props.y = (parentObj.getBounds().height - currentLayer.obj.getBounds().height *  currentLayer.obj.scaleY) / 2;
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
