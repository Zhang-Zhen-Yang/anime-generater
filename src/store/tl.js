/*
 * @Author: zhangzhenyang 
 * @Date: 2019-03-22 11:25:38 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-04-27 17:18:22
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
    autoPlay: false,
    showTweensMoveBlock: false,// 是否显示对所有缓动节点的整体移动
		scale: 0.5,
		offsetX: 0,
		// 显示时间轴的
    duration: 20000,

    // 当前选中的补间
    currentTween: null,
    topIndex: -1,
    subIndex: -1,
    tweenIndex: -1,
    voiceIndex: -1,
    // 菜单
    contextMenu: {
      show: true,
      x: 0,
      y: 0,
      xOffset: 0,
      yOffset: -88,
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
    },
    // 撤销历史列表
    undoList: [],
    // 重做历史列表
    redoList: [],
	},
	// ---------------------------------------------------------------------------------------------------------
	getters: {
		
	},
	// -----------------------------------------------------------------------------------------------------------
	mutations: {
    // 当下载到本地的项目文件重新投放到窗口内时
		setLocalImagesKeyFromBase64({state}, {image}) {
      // console.log(image);
      if(image.indexOf('data:image/') < 0) {
        return;
      }
      let has = false;
      for(let i in window.localImages) {
        if(window.localImages[i] == image) {
          has = true;
        }
      }
      if(!has) {
        let UUID = new util.getUUID().id;
        window.localImages[UUID] = image;
      }
    }
	},
	// ------------------------------------------------------------------------------------------------------------
	actions: {
    // 更新图层的位置
		swipeChild({rootState, state, commit, dispatch}, {fromIndex, fromSubIndex=-1, toIndex, toSubIndex=-1,position, dropInNoneContainer = false}) {
      console.log({
        fromIndex,
        fromSubIndex,
        toIndex,
        toSubIndex,
        position,
      })
      if(fromIndex == toIndex && fromSubIndex == toSubIndex) {
        return;
      }
      dispatch('addStep');
      /*if(fromSubIndex < 0 && toSubIndex > -1) {
        return;
      }*/
      // 拖动的是否是container 下的元素
      let fromIsSub = fromSubIndex >-1;
      // 投放的是否是container 下
      let toIsSub = toSubIndex >-1;

      if(!fromIsSub && toIsSub) {
        // 容器不能再放容器
        if(rootState.project.layers[fromIndex].type=='container') {
          return;
        }
      }

      let originToItem = toIsSub ? rootState.project.layers[toIndex].children[toSubIndex] :  rootState.project.layers[toIndex];
      console.log('originToItem', originToItem);

      rootState.activeLayerIndex=[0];
      

      state.topIndex = -1;
      state.subIndex = -1;
      console.log([fromIndex, fromSubIndex,toIndex, toSubIndex, position]);



      let toDistIndex= toIndex;
      let toDistSubIndex = toSubIndex;
      let shouldToIndex, shouldToSubIndex;

      // alert(toIsSub);
      if(toIsSub) {
        shouldToIndex = toIndex;
        if(position == 0) {
          shouldToSubIndex = toSubIndex;
        } else {
          shouldToSubIndex = toSubIndex + 1;
        }
      } else {
        if(position == 0) {
          shouldToIndex = toIndex;
        } else {
          shouldToIndex = toIndex + 1;
        }
      }
      // alert(shouldToIndex);

      // return;
      let pickItem;
      // alert(fromSubIndex > -1);
      // 上
      if(!fromIsSub) {
        pickItem = rootState.project.layers.splice(fromIndex, 1);
        // 上上
        if(!toIsSub) {
          if(fromIndex < shouldToIndex) {
            toDistIndex = shouldToIndex - 1;
          } else {
            toDistIndex = shouldToIndex;
          }
          // alert(toDistIndex);
        // 上下
        } else {
          toDistSubIndex = shouldToSubIndex;
          if(fromIndex < shouldToIndex) {
            toDistIndex = shouldToIndex - 1;
          } else {
            toDistIndex = shouldToIndex;
          }
        }
      
      // 下
      } else {
        console.log([fromIndex, '-------------------',fromSubIndex]);
        // console.log();
        pickItem = rootState.project.layers[fromIndex].children.splice(fromSubIndex,1);
         // 下上
         if(!toIsSub) {
        
          // 下下
          } else {
            if(fromSubIndex < shouldToIndex) {
              toDistSubIndex = shouldToIndex;
            } else {
              toDistSubIndex = shouldToIndex - 1
            }
            // alert(toDistSubIndex);
          }
      }
      
      // return;
      /*console.log([toIndex,toDistIndex, toDistSubIndex]);
      return;*/

      let fromObj = pickItem[0].obj;
      let fromObjWithContainer = fromObj.parent;
      // console.log(fromObj);
      fromObj.parent.parent.removeChild(fromObj.parent);


      let toItem;
      // 如果移动到的是第一层
      if(!toIsSub) {
        toItem = rootState.project.layers[0];
      } else {       
        toItem = rootState.project.layers[toDistIndex].children[0];
      }
      let toObj = originToItem ? originToItem.obj : null;// toItem.obj;
      let toObjWithContainer = originToItem && originToItem.obj ? originToItem.obj.parent : null; //toItem.obj.parent;
     

      // 如果是移动到上层
      if(!toIsSub) {
        /* if(position == 0) {
          rootState.project.layers.splice(toIndex,0,pickItem[0]);
          toObjWithContainer.parent.addChildAt(fromObjWithContainer, toIndex + 1);
        } else {
          rootState.project.layers.splice(toIndex + 1,0,pickItem[0]);
          toObjWithContainer.parent.addChildAt(fromObjWithContainer, toIndex + 2);
        }*/
        console.log(toDistIndex);
        rootState.project.layers.splice(toDistIndex,0,pickItem[0]);
        toObjWithContainer.parent.addChildAt(fromObjWithContainer, toDistIndex + 1);

      } else {
        /* if(position == 0) {
          rootState.project.layers[toIndex].children.splice(toSubIndex,0,pickItem[0]);
          toObjWithContainer.parent.addChildAt(fromObjWithContainer, toSubIndex);
        } else {
          rootState.project.layers[toIndex].childrrn.splice(toSubIndex + 1,0,pickItem[0]);
          toObjWithContainer.parent.addChildAt(fromObjWithContainer, toSubIndex + 1);
        }*/
        rootState.project.layers[toDistIndex].children.splice(toDistSubIndex,0,pickItem[0]);
        if(dropInNoneContainer) {
          rootState.project.layers[toIndex].obj.addChildAt(fromObjWithContainer, toDistSubIndex)
        } else {
          toObjWithContainer.parent.addChildAt(fromObjWithContainer, toDistSubIndex);
        }
      }







			/* let pickItem = rootState.project.layers.splice(fromIndex,1);
			console.log([fromIndex, toIndex]);
      rootState.project.layers.splice(toIndex, 0, pickItem[0]);
      let prevChild = window.stage.children[fromIndex - 0 +1];
      let nextChild = window.stage.children[toIndex - 0 + 1];
      console.log([fromIndex, toIndex]);
     console.log([prevChild, nextChild]);
      // window.stage.swipe();
      window.stage.swapChildren(nextChild, prevChild);*/
      dispatch('checkAsMask', {layers: rootState.project.layers});
		},
    // 添加图层，文件夹， 删除图层
		layerAction({state, rootState,commit,dispatch}, {type, layerType}) {
			switch(type) {
        // 图层
        case 0:
          dispatch('addStep');
          dispatch('addLayer', {layerType});
          break;
        // 文件夹
        case 1:
          dispatch('addStep');
          dispatch('addLayer', {layerType: 'container'});
         break;
        // 删除
        case 2:
          dispatch('addStep');
          dispatch('removeLayer', {});
				  break;
				default: break;
			}
    },
    // 添加图层
    addLayer({state, rootState,commit,dispatch}, {layerType}) {

      let newLayer = JSON.parse(JSON.stringify(templateFragment[layerType]));
      rootState.project.layers.push(newLayer);
      let layerLength = rootState.project.layers.length;
      let item = rootState.project.layers[layerLength - 1];
      canvasRender.addLayer({
        parentType: 'root',
        parent: window.stage,
        item,project: rootState.project,
        timeline: rootState.timeline
      });
    },
    // 删除图层
    removeLayer({state, rootState,commit,dispatch}, {}) {
      // alert('ddd');
      let activeLayerIndex = rootState.activeLayerIndex;
      let topIndex = typeof activeLayerIndex[0] == 'number' ? activeLayerIndex[0] : -1;
      let subIndex = typeof activeLayerIndex[1] == 'number' ? activeLayerIndex[1] : -1;
      if(topIndex >-1 && subIndex > -1) {
        let currentLayer = rootState.project.layers[topIndex].children[subIndex] || {};
        let removeItem = rootState.project.layers[topIndex].children.splice(subIndex, 1);
        let removeItemObj = removeItem[0].obj;
        removeItemObj.parent.parent.removeChild(removeItemObj.parent);

        /* let currentContainer = window.stage.children[topIndex + 1].children[0].children[subIndex];
        
        let currentUUID = currentLayer.UUID;
        let currentTweenObj = currentLayer.tweenObj;
        let currentObj = currentContainer.getChildByName(currentUUID);
        currentContainer.removeChild(currentObj);
        window.timeline.removeTween(currentTweenObj);*/
        let currentTweenObj = currentLayer.tweenObj;
        window.timeline.removeTween(currentTweenObj);
        
      } else if(topIndex > -1){
        let currentLayer = rootState.project.layers[topIndex] || {};
        let removeItem = rootState.project.layers.splice(topIndex, 1);
        console.log(removeItem);
        if(!removeItem[0]) {
          return;
        }
        let removeItemObj = removeItem[0].obj;
        removeItemObj.parent.parent.removeChild(removeItemObj.parent);
        

        /*let currentContainer = window.stage.children[topIndex + 1];

        window.stage.removeChild(currentContainer);

        let currentUUID = currentLayer.UUID;
        let currentTweenObj = currentLayer.tweenObj;
        window.timeline.removeTween(currentTweenObj);
        // 如果是 container 类型，要把子元素也去掉
        if(currentLayer.type == 'container') {
          // alert('dd');
          currentLayer.children.forEach((item, index)=>{
            let childTweenObj = item.tweenObj;
            window.timeline.removeTween(childTweenObj);
          })
        }*/
        let currentTweenObj = currentLayer.tweenObj;
        window.timeline.removeTween(currentTweenObj);
        let currentVideoTweenObj = currentLayer.videoTweenObj;
        window.timeline.removeTween(currentVideoTweenObj);

        if(currentLayer.type == 'container') {
          // alert('dd');
          currentLayer.children.forEach((item, index)=>{
            let childTweenObj = item.tweenObj;
            let childVideoTweenObj = item.videoTweenObj;
            window.timeline.removeTween(childTweenObj);
            window.timeline.removeTween(childVideoTweenObj);
          })
        }
      }
      dispatch('checkAsMask', {layers: rootState.project.layers});
    },
    // 设置当前选中的补间
    setActiveTween({state,rootState,dispatch}, {t, topIndex, subIndex, tweenIndex}) {
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
    // 设置当前的缓动节点
    setActiveTweenVer2({state,rootState,dispatch}, {t, topIndex, subIndex, tweenIndex}) {
      rootState.playing = false;
      rootState.timeline.setPaused(true);
      state.currentTween = t;
      state.topIndex = topIndex;
      state.subIndex = subIndex;
      state.tweenIndex = tweenIndex;
      state.voiceIndex = -1;
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
  
      // dispatch('setActiveTween', {t, topIndex, subIndex, tweenIndex});
    },
    // 更新缓动
    updateTween({state,rootState,dispatch},{topIndex, subIndex}) {
      let tweenIndex =  state.tweenIndex;
      let currentLayer;
      let currentTweenObj;
      let currentVideoTweenObj;
      let obj;
      let scale = 1;
      let UUID;
      // 子
      if(topIndex >-1 && subIndex > -1) {
        currentLayer = rootState.project.layers[topIndex].children[subIndex];
        UUID = currentLayer.UUID;
        currentTweenObj = currentLayer.tweenObj;
        currentVideoTweenObj = currentLayer.videoTweenObj;
        // obj = window.stage.children[topIndex + 1].children[0].children[subIndex].children[0];

        // 顶部
      } else if(topIndex > -1){
        currentLayer = rootState.project.layers[topIndex];
        UUID = currentLayer.UUID;
        currentTweenObj = currentLayer.tweenObj;
        currentVideoTweenObj = currentLayer.videoTweenObj;
        // obj = window.stage.children[topIndex + 1].children[0];
      }
      obj = utilTimeline.getObjByUUID({parent: window.stage, UUID});
      // alert(obj);
      if(currentLayer.type == 'image') {
        scale = util.getImageScale({
          img: obj.image,
          cw: rootState.project.width,
          ch: rootState.project.height,
          type: 'cover'
        });
      }

      let tween = canvasRender.getTween({obj, item: currentLayer, timeline: window.timeline, scale});
      // alert(window.timeline._tweens.length);
      window.timeline.removeTween(currentTweenObj);
      window.timeline.removeTween(currentVideoTweenObj);
      // alert(window.timeline._tweens.length);
      tween.forEach((t)=>{
        window.timeline.addTween(t);
      })
      // alert(window.timeline._tweens.length);
    },
    // 检测是否应该添加缓节点
    checkAddTweenIf({state,rootState,dispatch}) {
      // console.log('================================================check');
      let currentPosition = window.timeline.position;
      let currentLayer = utilTimeline.getCurrentLayer({rootState: rootState});
      let currentTween = currentLayer.tween[state.tweenIndex] || null;
      if(currentTween) {
        let time = currentTween.time;
        if(Math.abs(time - currentPosition) >= 0.02) {
          console.log([time, currentPosition, '=========================================']);
          // alert('ddd');
          dispatch('addTween', {
            topIndex: state.topIndex,
            subIndex: state.subIndex,
            position: currentPosition
          });
        }
      }
    },
    // 添加缓动
    addTween({state,rootState,dispatch},{topIndex, subIndex, position}) {
      dispatch('addStep');
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
      // 如果添加的位置在总时长后面
      if(position > rootState.timeline.duration) {
        // 最后一个缓动
        let lastTween = currentLayer.tween[currentLayer.tween.length - 1];
        if(lastTween) {
          currentLayer.tween.push({
            action: 'to',
            props: JSON.parse(JSON.stringify(lastTween.props)),
            time: position,
            ease: 'linear'
          })
        } else {
          currentLayer.tween.push({
            action: 'to',
            props: {
              x: 0,
              y: 0,
              scaleX: 1,
              scaleY: 1,
              rotation: 0,
              alpha: 1,
            },
            time: position,
            ease: 'linear'
          })
        }
        dispatch('updateTween', {topIndex, subIndex});
      } else {
        rootState.timeline.gotoAndStop(position);
        let newProps = utilTimeline.getCurrentProps({project: rootState.project, obj: currentObj});
        let positionIndex = utilTimeline.getIndexByPosition({list: currentLayer.tween, position});
        // alert(positionIndex);
        currentLayer.tween.splice(positionIndex + 1, 0, {
          action: 'to',
          props: newProps,
          time: position,
          ease: 'linear'
        })
        dispatch('updateTween', {topIndex, subIndex});
        state.tweenIndex = positionIndex +1;
        // console.log(newProps);
      }
      
    },
    // 删除当前缓动
    removeTween({state,rootState,dispatch}) {
      
      // alert('removeTween');
      let voiceIndex = state.voiceIndex;
      // 删除配音
      if(voiceIndex > -1) {
        let voices = rootState.project.voices;
        if(voices[voiceIndex]) {
          dispatch('addStep');
          voices.splice(voiceIndex,1);
          if(!voices[voiceIndex]) {
            state.voiceIndex = voiceIndex - 1;
          }
        }
      } else {
        let topIndex = state.topIndex;
        let subIndex = state.subIndex;
        let currentLayer = utilTimeline.getCurrentLayer({rootState: rootState});
        let tweenIndex = state.tweenIndex;
        if(currentLayer && currentLayer.tween && currentLayer.tween[tweenIndex]) {
          if(currentLayer.tween.length > 1) {
            dispatch('addStep');
            currentLayer.tween.splice(tweenIndex,1);
            dispatch('updateTween', {topIndex, subIndex});
          }
        }
      }
    },
    // 鼠标按下事件
    keydown({state,rootState,dispatch}, {e}) {
      let ignoreNodeNames = ['TEXTAREA', 'INPUT']
      if(ignoreNodeNames.indexOf(e.target.nodeName) > -1) {
        return;
      }
      let playing = rootState.playing;
      let kc = e.keyCode;
      console.log(kc);
      let currentLayer = utilTimeline.getCurrentLayer({rootState});
      switch(kc) {
        case 8:
          e.preventDefault();
          break;
        // delete
        case 46:
          dispatch('removeTween');
          break;
        // enter
        case 13:
          window.timeline.setPaused(playing);
          rootState.playing = !playing;
          break;
        // space
        case 32:
          e.preventDefault();
          state.showTweensMoveBlock = true;
          break;
        // left
        case 37:
        // up
        case 38:
        // right
        case 39:
        // down
        case 40:
          if(currentLayer) {
            // console.log('up');
            dispatch('checkAddTweenIf');
            let obj =currentLayer.obj;
            if(kc == 37) {
              obj.x -= 1;
              // currentLayer.tween[state.tweenIndex].x -= 1;//currentLayer.obj.x;
              // currentLayer.tween[state.tweenIndex].y = 0;//currentLayer.obj.y;
            } else if(kc == 38){
              obj.y -= 1; 
              // currentLayer.tween[state.tweenIndex].y -= 1;//currentLayer.obj.x;
            } else if (kc == 39){
              obj.x += 1; 
              // currentLayer.tween[state.tweenIndex].x += 1;//currentLayer.obj.x;
            } else if (kc == 40){
              obj.y += 1;
              // currentLayer.tween[state.tweenIndex].y += 1;//currentLayer.obj.x;
            }
          }
          e.preventDefault();
          break;
        
        default: break;
      }
      // console.log(e);
    },
    // 按键松开事件
    keyup({state,rootState,dispatch}, {e}) {
      let ignoreNodeNames = ['TEXTAREA', 'INPUT']
      if(ignoreNodeNames.indexOf(e.target.nodeName) > -1) {
        return;
      }
      let kc = e.keyCode;
      console.log(kc);
      let currentLayer = utilTimeline.getCurrentLayer({rootState});
      switch(kc) {
        // delete
        case 46:
          break;
        // enter
        case 13:
          break;
        // space
        case 32:
          e.preventDefault();
          state.showTweensMoveBlock = false;
          break;
        // left
        case 37:
        // up
        case 38:
        // right
        case 39:
        // down
        case 40:
          if(currentLayer) {
            currentLayer.tween[state.tweenIndex].props.x = currentLayer.obj.x;
            currentLayer.tween[state.tweenIndex].props.y = currentLayer.obj.y;
            dispatch('propsChange', {target: currentLayer.obj});
          }
          break;
        default: break;
      }

    },
    //显示或隐藏所有图层
    toggleVisibleAll({state,rootState,dispatch}) {
      // 所有可见层的数量
      let allVisibleCount = 0;
      let allInVisibleCount = 0;
      rootState.project.layers.forEach((layer)=>{
        if(layer.visible) {
          allVisibleCount += 1;
        } else {
          allInVisibleCount += 1;
        }
        if(layer.type == 'container') {
          layer.children.forEach((clayer)=>{
            if(clayer.visible) {
              allVisibleCount += 1;
            } else {
              allInVisibleCount += 1;
            }
          })
        }
      })
      let toSetValue = true;
      // 只要有一个可见层就全部设为不可见
      if(allVisibleCount > 0) {
        toSetValue = false;
      }
      rootState.project.layers.forEach((layer)=>{
        layer.visible = toSetValue;
        layer.obj.set({visible: toSetValue});
        if(layer.type == 'container') {
          layer.children.forEach((clayer)=>{
            clayer.visible = toSetValue;
            clayer.obj.set({visible: toSetValue});
          })
        }
      })
      // alert([allVisibleCount, allInVisibleCount]);
    },
    // 设置所有图层是否可以编辑
    toggleEditableAll({state,rootState,dispatch}) {
      // 所有可见层的数量
      let allVisibleCount = 0;
      let allInVisibleCount = 0;
      rootState.project.layers.forEach((layer)=>{
        if(layer.editable) {
          allVisibleCount += 1;
        } else {
          allInVisibleCount += 1;
        }
        if(layer.type == 'container') {
          layer.children.forEach((clayer)=>{
            if(clayer.editable) {
              allVisibleCount += 1;
            } else {
              allInVisibleCount += 1;
            }
          })
        }
      })
      let toSetValue = true;
      // 只要有一个可见层就全部设为不可见
      if(allVisibleCount > 0) {
        toSetValue = false;
      }
      rootState.project.layers.forEach((layer)=>{
        layer.editable = toSetValue;
      })
    },
    // 添加历史记录
    addStep({rootState, state}, {type = 'undo', clearRedo = true}={type: 'undo', clearRedo: true}) {
      // alert('ddd');
      // 克隆当前项目信息
      let obj = utilTimeline.cloneObj(rootState.project);
      obj.layers.forEach((layer)=>{
        if(layer.type == 'image') {
          layer.pic_url = utilTimeline.getPicKeyByItem(layer);
        } else if(layer.type == 'video') {
          if(layer.videoObj) {
            layer.videoObj.cancel();
          }
        } else if(layer.type == 'container') {
          layer.children.forEach((clayer)=>{
            if(clayer.type == 'image') {
              clayer.pic_url = utilTimeline.getPicKeyByItem(clayer);
            } else if(layer.type == 'video') {
              if(clayer.videoObj) {
                clayer.videoObj.cancel();
              }
            }
          })
        }
      })
      // 撤销
      if(type == 'undo') {
        let distObj = {
          project: obj,
          playing: rootState.playing,
          position:rootState.position,
          topIndex: state.topIndex,
          subIndex: state.subIndex,
          tweenIndex: state.tweenIndex,
        };
        // console.log(JSON.stringify(distObj));
        // console.log(state.undoList[state.undoList.length - 1]);
        if(state.undoList.length > 0 && (JSON.stringify(distObj) == JSON.stringify(state.undoList[state.undoList.length - 1]))) {
          return 
        }
        state.undoList.push(distObj);
        // 是否清除重做历史列表
        if(clearRedo) {
          state.redoList = [];
        }
      } else {
        // 重做
        state.redoList.unshift({
          project: obj,
          playing: rootState.playing,
          position:rootState.position,
          topIndex: state.topIndex,
          subIndex: state.subIndex,
          tweenIndex: state.tweenIndex,
        })
      }
    },
    // 撤销重做
    undoredo({state,rootState,dispatch}, {type}) {
      // alert(type);
      // 撤销
      if(type == 0) {
        if(state.undoList.length > 0) {
          dispatch('addStep', {type: 'redo'});
          let fillItem = state.undoList.splice(state.undoList.length - 1, 1)[0];
          //
          utilTimeline.fillLocalImageByKey(fillItem);
          utilTimeline.fillVideoList({fillItem, project: rootState.project});
          dispatch('fillVoices', {project: fillItem.project});
          
          rootState.project = fillItem.project;
          rootState.playing = fillItem.playing;
          
          canvasRender.render({
            canvas: document.getElementById('canvas'),
            project: rootState.project,
            state: rootState
          })
          /* console.warn([fillItem.playing, fillItem.position])
          return; */
          Vue.nextTick(()=>{
            setTimeout(()=>{
              rootState.timeline.setPaused(!rootState.playing);
              rootState.timeline.setPosition(fillItem.position);
            }, 0)
          })
        }
      // 重做
      } else if(type == 1) {
        if(state.redoList.length > 0) {
          dispatch('addStep', {type: 'undo', clearRedo: false});
          let fillItem = state.redoList.splice(0, 1)[0];
          
          utilTimeline.fillLocalImageByKey(fillItem);
          utilTimeline.fillVideoList({fillItem, project: rootState.project});
          dispatch('fillVoices', {project: fillItem.project});
          
          
          rootState.project = fillItem.project;
          rootState.playing = fillItem.playing;
          canvasRender.render({
            canvas: document.getElementById('canvas'),
            project: rootState.project,
            state: rootState
          })
          Vue.nextTick(()=>{
            setTimeout(()=>{
              rootState.timeline.setPaused(!rootState.playing);
              rootState.timeline.setPosition(fillItem.position);
            }, 0)
          })
        }
      }
    },
    loadLocalTemp({rootState, state, dispatch, commit}, {result}) {
      /* for(let i in window.localImages) {
        if(window.localImages[i] == img) {
          has = true;
        }
      }
      if(!has) {
        let UUID = new util.getUUID().id;
        window.localImages[UUID] = img;
      }*/
      // console.warn(result);
      rootState.project = JSON.parse(result);
      // 全部重新渲染动画
      canvasRender.render({
        canvas: document.getElementById('canvas'),
        project: rootState.project,
        state: rootState
      })

      rootState.project.layers.forEach((layer)=>{
        if(layer.type == 'image') {
          commit('setLocalImagesKeyFromBase64', {image: layer.pic_url});
        } else if(layer.type == 'container'){
          layer.children.forEach((clayer)=>{
            if(clayer.type == 'image') {
              commit('setLocalImagesKeyFromBase64', {image: clayer.pic_url});
            }
          })
        }
      })
    },
    // 重新设置遮罩
    checkAsMask({rootState, state, dispatch, commit}, {layers}) {
      // let layers = rootState.project.layers;
      layers.forEach((layer, index)=>{
        // 如果是图形
        if(layer.type=='shape') {
          // 如果是作为遮置
          if(layer.asMask) {
            // 不显示在动画中
            layer.obj.set({
              visible: false
            })
            // 如果不是第一个图层，找到第一个图层的对象并设置其mask
            if(index > 0) {
              layers[index - 1].obj.mask = layer.obj;
            }
          } else {
              layer.obj.set({
                visible: layer.visible
              });
          }
        } else {
          layer.obj.mask = null;
          // console.log('mask', layer.obj.mask);
        }
        if(layer.type == 'container') {
          dispatch('checkAsMask', {layers: layer.children});
        }
      })
    },
    updateVideoCaptureTimestap({state,rootState,dispatch}, {src}) {
      rootState.project.layers.forEach((item, index)=>{
        if(item.type == 'video') {
          if(item.videoObj && src == item.videoObj.src && item.videoObj.lastAction != 'success') {
            item.timestamp = Date.now();
          }
        } else if(item.type == 'container') {
          item.children.forEach((cItem)=>{
            if(cItem.type == 'video'){
              if(cItem.videoObj && src == cItem.videoObj.src && cItem.videoObj.lastAction != 'success') {
                cItem.timestamp = Date.now();
              }
            }
          })
        }
      })
    },
    // 测试
    test({state,rootState,dispatch}) {
      // console.log(window.timeline._tweens[1].target.x);
    }
		
	}// end actions 
}
export default store;
