import util from './util';
// import { join } from 'path';
// import { promises } from 'fs';
import {convertStreams2, accessWorker2, convertImageToVideo2, combineAudio2, convertTo264, getVideoFrames2, runCommand2} from '../script/convert.2.js';
class VideoCapture {
    constructor({src, start_time, end_time, interval, isNet, localData,hasVideoImage=true}) {
        this.video = document.createElement('video');
        this.canvas = document.createElement('canvas');
        this.canvas.style="width: 300px;position:absolute;left:0;top:300px;background-color: rgba(255,255,255,0.2)";
        this.ctx = this.canvas.getContext('2d');
        this.video.crossOrigin="anonymous";
        this.video.src = src;
        this.start_time = start_time;
        this.current_time = start_time;
        this.end_time = end_time;
        this.isNet = isNet;
        this.localData = localData;
        this.interval = interval;
        this.canceled = false
        // this.video.style="position:absolute;left:70px;top:100px;background-color: white;width: 200px;opacity: 0.5";
        // document.body.appendChild(this.video);
        this.canvasList= [];
        this.promise = null;
        this.lastAction = 'initing'; // [initing, process, success, error]
        this.timeStamp = Date.now();
        this.hasVideoImage = hasVideoImage;
        this.src = src;
        this.localVideoCapturePregress = 0;
       
    }
    // 开始生成
    start() {
       
        // 视频来自网络 在网页能播放
        if(this.isNet) {
            return this.promise1();
        } else {
            // alert(this.hasVideoImage);
            // 有画面的本地视频。
            if(this.hasVideoImage) {
                // console.log(this.localData);

                return this.promise2();
                // 也可以
                this.video.src = URL.createObjectURL(new Blob([this.localData]), {type: 'video/mp4'});
                return this.promise1();
            } else {
                return this.promise2();
            }
        }

        
    }
    // 将video元素绘制在canvas上 以获取图片帧
    promise1() {
        let promise = new Promise((resolve, reject)=>{
            // setTimeout(() => {
                if(this.canceled) { alert(canceled); return; }
                let canvasList = [];
                // this.video.pause();
                this.video.onloadedmetadata = ()=>{
                    setTimeout(()=>{
                        // 检测当时对象是否在列表中
                        if(!this.checkInList()) {
                            return;
                        };

                        console.log(this.video.duration);
                        console.log(this.video.videoWidth);
                        console.log(this.video.videoHeight);

                        let videoWidth = this.video.videoWidth;
                        let videoHeight = this.video.videoHeight;
                        /*let scale = util.getImageScale({img: {
                            width: videoWidth,
                            height: videoHeight,
                        }, cw: 800, ch: 800, type: 'contain'});*/

                        let scale = util.getImageScale({img: {
                            width: videoWidth,
                            height: videoHeight,
                        }, cw: 800, ch: 800, type: 'contain'});
                        // console.log(scale);
                        if(scale > 1) {
                            scale = 1;
                        }

                        let distWidth = videoWidth * scale;
                        let distHeight = videoHeight * scale;
                        this.canvas.width = distWidth;
                        this.canvas.height = distHeight;
                        console.log([distWidth, distHeight]);
                        this.video.oncanplay = ()=>{
                            // console.log('current:'+this.video.currentTime);
                            let canvas = document.createElement('canvas');
                            canvas.width = distWidth; // videoWidth;
                            canvas.height = distHeight; // videoHeight;
                            let ctx = canvas.getContext('2d');
                            ctx.drawImage(this.video, 0, 0, distWidth, distHeight);

                            canvas.toBlob((res)=>{
                                let url = URL.createObjectURL(res);
                                let img = new Image();
                                img.onload = ()=>{
                                    // console.log(this.canvasList.length, img.width);
                                    this.canvasList.push(img);
                                    URL.revokeObjectURL(url);
                                    // this.canvasList.push(canvas);
                                    try{
                                        window.p.$store.dispatch('updateVideoCaptureTimestap', {src: this.src});
                                    } catch(e) {
                
                                    }
                                    this.timeStamp = Date.now();
                                    if(this.canceled) {
                                        resolve({
                                            success: false,
                                            cancel: true,
                                            list: this.canvasList,
                                            width: distWidth, //videoWidth,
                                            height: distHeight, // videoHeight,
                                        })
                                    }
                                    // 当前时间大于等于结束时间
                                    if(this.current_time >= this.end_time) {
                                        this.lastAction = 'success';
                                        // alert('end');
                                        resolve({
                                            success: true,
                                            cancel: false,
                                            list: this.canvasList,
                                            width: distWidth, //this.video.videoWidth,
                                            height: distHeight, // this.video.videoHeight,
                                        })
                                    } else {
                                        setTimeout(()=>{
                                            let nextTime = this.video.currentTime + this.interval;

                                            if(nextTime >= this.end_time) {
                                                resolve({
                                                    success: true,
                                                    cancel: false,
                                                    list: this.canvasList,
                                                    width: distWidth, //this.video.videoWidth,
                                                    height: distHeight, // this.video.videoHeight,
                                                })
                                                this.lastAction = 'success';
                                            } else {
                                                if(nextTime >= this.video.duration) {
                                                    resolve({
                                                        success: true,
                                                        cancel: false,
                                                        list: this.canvasList,
                                                        width: distWidth, //this.video.videoWidth,
                                                        height: distHeight, // this.video.videoHeight,
                                                    })
                                                    this.lastAction = 'success';
                                                } else {
                                                    this.video.currentTime = nextTime;
                                                    this.current_time = nextTime;
                                                }
                                            }
                                        },0);
                
                                    }
                                }
                                img.src = url;
                            });
                            // console.log(blob);
                        }
                        this.video.currentTime = this.start_time;
                        this.lastAction = 'procress';
                    }, 200)// end setTimeout
                }// end onloadedmetadata
                this.video.onerror= (e)=>{
                    this.lastAction = 'error';
                    console.log(e);
                    reject({
                        success: false,
                        list: [],
                    })
                }
            // }, 200);
        })
        this.promise = promise;
        return promise;
    }
    // 通过ffmpeg 获取视频图片帧
    promise2() {
        // alert('promise2');
        let promise = new Promise((resolve, reject)=>{
            setTimeout(()=>{
                if(this.canceled) { return; }
                if(!this.checkInList()) {
                    return;
                }
                let fps = 20;
                let start_time = this.start_time;
                let end_time = this.end_time;
                let ss = util.getMessageByTime(start_time);
                let t = util.getMessageByTime(end_time - start_time);
                console.log([ss, t]);
                // alert([ss, t]);

                let command = `-ss ${ss} -t ${t} -i input.mp4 -q:v 2 -f image2 -vf fps=fps=${fps},showinfo -an out%d.jpeg`;
                let files = [
                    {
                        name: 'input.mp4',
                        data: new Uint8Array(this.localData)
                    }
                ]
                runCommand2({files, command}, (res)=>{
                    console.log(res);
                    if(res.type == 'stdout') {
                        if(this.canceled) {
                            return;
                        }
                        if(res.data.indexOf('Duration') > -1){
                            // alert(res.data);
                        }
                        // time=00:00:01.00 b
                        let str = res.data;
                        let regx = /time=([^&]+)bitrate/mig;
                        let result = regx.exec(str);
                        if (result && result[1]) {
                            console.warn(result[1]);
                            // localStorage.setItem('sessionKey', result[1]);
                            let timeList = result[1].split(':');
                            let duration = parseFloat(timeList[0]) * 3600 + parseFloat(timeList[1]) * 60 + parseFloat(timeList[2]);
                            this.localVideoCapturePregress = duration;
                        }
                        // 通知获取的进度
                        window.p.$store.dispatch('updateVideoCaptureTimestap', {src: this.src, });
                    } else if (res.type == 'done') {
                        if(this.canceled) {
                            return;
                        }
                        this.canvasList = res.data.map((item)=>{
                            // console.log(item);
                            let url = URL.createObjectURL(new Blob([item.data], {type: 'image/jpeg'}));
                            let image = new Image();
                            image.src = url;
                            image.onload = ()=>{
                                URL.revokeObjectURL(url);
                                console.log(image.width);
                                console.log([image.width, image.height]);
                            }
                            return image;
                        })
                        setTimeout(()=>{
                            let videoWidth = this.canvasList[1] ?  this.canvasList[1].width : 100;
                            let videoHeight = this.canvasList[1] ?  this.canvasList[1].height : 100;
                            let scale = util.getImageScale({img: {
                                width: videoWidth,
                                height: videoHeight,
                            }, cw: 800, ch: 800, type: 'contain'});
                            if(scale > 1) {
                                scale = 1;
                            }
                            let distWidth = videoWidth * scale;
                            let distHeight = videoHeight * scale;
                            
                            console.log(['888888', videoWidth, videoHeight, scale, distWidth, distHeight]);
                            // alert([this.canvasList[0].width, this.canvasList[0].height]);
                            resolve({
                                success: true,
                                cancel: false,
                                list: this.canvasList,
                                width:  videoWidth, //videoWidth,
                                height: videoHeight, // videoHeight,
                            })
                            window.p.$store.dispatch('updateVideoCaptureTimestap', {src: this.src});
                            this.lastAction = 'success';
                        }, 1000)
                    } else if (res.type == 'error') {
                        console.log(res);
                        this.lastAction = 'error';
                    }

                });
            }, 200);// end setTimeout
        })
        this.promise = promise;
        return promise;
        
    }
    // 取消获取图片帧
    cancel() {
        this.canceled = true;
        this.video.onloadedmetadata = ()=>{}
    }
    // 检测
    checkInList() {
        let has = false;
        window.p.$store.state.project.layers.forEach((layer)=>{
            if(layer.type == 'video') {
                if(layer.videoObj == this){
                    has = true;
                };
                console.log('checkInList-----------------------------------------------');
            } else if(layer.type == 'container') {
                layer.children.forEach((cLayer)=>{
                    if(cLayer.type == 'video') {
                        if(cLayer.videoObj == this){
                            has = true;
                        };
                    }
                })
            }
        });
        return has;
    }
}
export default VideoCapture; 


