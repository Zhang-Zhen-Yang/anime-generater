import { create } from "domain";
import util from './util.js';
import VideoCapture from './videoCapture.js';
let Object = {
    // 通过UUID获取 对象
    getObjByUUID({parent,UUID}) {
        let obj = typeof parent.getChildByName == 'function' ? parent.getChildByName(UUID) : null;
        if(obj) {
            return obj;
        } else {
            if(parent.children) {
                let returnValue = null;
                parent.children.forEach((item, index)=>{
                    let cOjb = Object.getObjByUUID({parent: item, UUID});
                    if(cOjb) {
                        returnValue = cOjb
                    }
                })
                return returnValue;
            }
            return null;
        }
    },
    // 获取当前的图层
    getCurrentLayer({rootState}) {
        let topIndex = rootState.tl.topIndex;
        let subIndex = rootState.tl.subIndex;
        let tweenIndex = rootState.tl.tweenIndex;
        let currentLayer = null;
        if(topIndex > -1 && subIndex > -1) {
            currentLayer = rootState.project.layers[topIndex].children[subIndex];
           
        } else if(topIndex > -1){
            currentLayer = rootState.project.layers[topIndex];
           
        }
        return currentLayer;
    },
    // 获取当前的UUID
    getCurrentUUID({rootState}){
        let currentLayer = this.getCurrentLayer({rootState});
        return currentLayer ? currentLayer.UUID : null;
    },
    // 获取当前对象的值
    getCurrentProps({project, obj}) {
        let props = {};
        let propItems = ['x', 'y', 'alpha', 'scaleX', 'scaleY', 'rotation'];
        let initScale = 1;
        if(obj instanceof createjs.Bitmap) {
            initScale = util.getImageScale({img: obj.image, cw: project.width, ch: project.height,type: 'cover'})
        }
        if(obj) {
            propItems.forEach((item, index)=>{
                
                if(item == 'scaleX' || item == 'scaleY') {
                    props[item] = obj[item] / initScale;

                } else {
                    props[item] = obj[item];
                }
            })
        }
        return props;
    },
    cloneObj(obj){
        var str, newobj = Array.isArray(obj) ? [] : {};
        if(typeof obj !== 'object'){
            return;
        } else {
            for(var i in obj){
                if (i == 'obj' || i == 'tweenObj' || i == 'videoTweenObj' || i == 'sprite' || i == 'list' || i == 'videoObj') {
                    newobj[i] = '';
                    continue;
                }  
                newobj[i] = typeof obj[i] === 'object' ? 
                Object.cloneObj(obj[i]) : obj[i]; 
            }
        }
        return newobj;
    },
    getPicKeyByItem(item) {
        let pic_url = item.pic_url;
        let key = '';
        for(let i in window.localImages){
            if(pic_url == window.localImages[i]) {
                key = i;
            }
        }
        return key || pic_url;
    },
    fillLocalImageByKey(fillItem) {
        fillItem.project.layers.forEach((layer)=>{
            if(layer.type == 'image') {
                layer.pic_url = window.localImages[layer.pic_url] || layer.pic_url;
            } else if(layer.type == 'container') {
                layer.children.forEach((clayer)=>{
                    if(clayer.type == 'image') {
                        clayer.pic_url = window.localImages[clayer.pic_url] || clayer.pic_url;
                    }
                })
            }
        })
    },
    fillVideoList({fillItem, project}) {
       
        // console.log(fillItem);
        // console.log(project);
        fillItem.project.layers.forEach((fItem, index)=>{
            let fType = fItem.type;
            let fUUID = fItem.UUID;
            if(fType == 'video') {
                this.fillVideoListCheck({project, fUUID, fItem});
            } else if(fType == 'container'){
                fItem.children.forEach((fChildItem, index)=>{
                    if(fChildItem.type == "video") {
                        this.fillVideoListCheck({project, fUUID, fItem: fChildItem});
                    }
                })
            }
        })
    },
    fillVideoListCheck({project, fUUID, fItem}) {
        fItem.list = [];
        let fItemTag =`${fItem.start_time}-${fItem.end_time}-${fItem.src}`;



        let prevItem = this.getLayerByVideoTag({layers: project.layers, tag: fItemTag});

        if(prevItem) {
            fItem.videoObj = new VideoCapture({
                src: fItem.start_time,
                start_time: fItem.end_time,
                end_time: fItem.end_time,
                interval: fItem.interval
            });
            fItem.list = fItem.videoObj.canvasList = prevItem.videoObj.canvasList;
            fItem.videoObj.lastAction = 'success';
            
            // console.log('layer',prevItem);
            /*if(prevItem.videoObj) {
                if(prevItem.videoObj.lastAction == 'success') {
                    let prevItemTag = `${prevItem.start_time}-${prevItem.end_time}-${prevItem.src}`;
                    console.log([fItemTag, prevItemTag]);
                    if(fItemTag == prevItemTag) {
                        console.log('fItemTag == prevItemTag');
                        fItem.videoObj = new VideoCapture({
                            src: fItem.start_time,
                            start_time: fItem.end_time,
                            end_time: fItem.end_time,
                            interval: fItem.interval
                        });
                        fItem.list = fItem.videoObj.canvasList = prevItem.videoObj.canvasList;
                        fItem.videoObj.lastAction = 'success';
                    } else {

                    }
                } else {
                    prevItem.videoObj.cancel(); 
                }
            } else {

            }*/
        } else {
            console.log('no find');
        }
    },
    getLayerByVideoTag({layers, tag}) {
        let findItem = '';
        layers.forEach((item)=>{
            if(item.type == 'video') {
                let thisTag = `${item.start_time}-${item.end_time}-${item.src}`;
                if(thisTag == tag) {
                    findItem = item;
                }
            }
            if(item.type == 'container') {
                item.children.forEach((cItem)=>{
                    if(cItem.type == 'video') {
                        let thisTag = `${cItem.start_time}-${cItem.end_time}-${cItem.src}`;
                        if(thisTag == tag) {
                            findItem = item;
                        }
                    }
                })
            }
        })
        return findItem;
    },
    // 通过时间点来判断缓动应该添加到什么位置
    getIndexByPosition({list, position}) {
        let index = 0;
        (list || []).forEach((item, tindex)=>{
            if(position > item.time) {
                index = tindex;
            }
        })
        return index;
    }
}
export default Object;
