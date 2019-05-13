import util from './util';
import { join } from 'path';
class VideoCapture {
    constructor({src, start_time, end_time, interval}) {
        this.video = document.createElement('video');
        this.canvas = document.createElement('canvas');
        this.canvas.style="width: 300px;position:absolute;left:0;top:300px;background-color: rgba(255,255,255,0.2)";
        this.ctx = this.canvas.getContext('2d');
        this.video.crossOrigin="anonymous";
        this.video.src = src;
        this.start_time = start_time;
        this.current_time = start_time;
        this.end_time = end_time;
        this.interval = interval;
        this.canceled = false
        // this.video.style="position:absolute;left:70px;top:100px;background-color: white;width: 200px;opacity: 0.5";
        // document.body.appendChild(this.video);
        this.canvasList= [];
        this.promise = null;
        this.lastAction = 'initing'; // [initing, process, success, error]
        this.timeStamp = Date.now();
        this.src = src;
       

    }
    start() {
        let promise = new Promise((resolve, reject)=>{
            let canvasList = [];
            // this.video.pause();
            this.video.onloadedmetadata = ()=>{
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
                console.log(scale);
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

                            this.canvasList.push(img);
                            URL.revokeObjectURL(url);
                            // this.canvasList.push(canvas);
                            try{
                                window.p.$store.dispatch('updateVideoCaptureTimestap', {src: this.src});
                            }catch(e){
        
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
                                    } else {
                                        if(nextTime >= this.video.duration) {
                                            resolve({
                                                success: true,
                                                cancel: false,
                                                list: this.canvasList,
                                                width: distWidth, //this.video.videoWidth,
                                                height: distHeight, // this.video.videoHeight,
                                            })
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
                
            }
            this.video.onerror= (e)=>{
                this.lastAction = 'error';
                console.log(e);
                reject({
                    success: false,
                    list: [],
                })
            }
        })
        this.promise = promise;
        return promise;
    }
    cancel() {
        this.canceled = true;
        this.video.onloadedmetadata = ()=>{}
    }
}
export default VideoCapture; 