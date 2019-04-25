import util from './util';
class VideoCapture {
    constructor({src, start_time, end_time, interval}) {
        this.video = document.createElement('video');
        this.video.src = src;
        this.start_time = start_time;
        this.current_time = start_time;
        this.end_time = end_time;
        this.interval = interval;
        this.cancel = false
        this.video.style="position:absolute;left:70px;top:100px;background-color: white;width: 200px;opacity: 0.5";
        document.body.appendChild(this.video);
    }
    start() {
        return new Promise((resolve, reject)=>{
            let canvasList = [];
            // this.video.pause();
            this.video.onloadedmetadata = ()=>{
                console.log(this.video.duration);
                console.log(this.video.videoWidth);
                console.log(this.video.videoHeight);
                let videoWidth = this.video.videoWidth;
                let videoHeight = this.video.videoHeight;
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
                console.log([distWidth, distHeight]);
                this.video.oncanplay = ()=>{
                    console.log('current:'+this.video.currentTime);
                    let canvas = document.createElement('canvas');
                    canvas.width = distWidth; // videoWidth;
                    canvas.height = distWidth; // videoHeight;
                    let ctx = canvas.getContext('2d');
                    ctx.drawImage(this.video, 0, 0, distWidth, distHeight);
                    canvasList.push(canvas);
                    if(this.cancel) {
                        resolve({
                            success: false,
                            cancel: true,
                            list: canvasList,
                            width: distWidth, //videoWidth,
                            height: distHeight, // videoHeight,
                        })
                    }
                    // 当前时间大于等于结束时间
                    if(this.current_time >= this.end_time) {
                        console.log('end');
                        resolve({
                            success: true,
                            cancel: false,
                            list: canvasList,
                            width: distWidth, //this.video.videoWidth,
                            height: distHeight, // this.video.videoHeight,
                        })
                    } else {
                        setTimeout(()=>{
                            let nextTime = this.video.currentTime + this.interval;
                            if(nextTime >= this.video.duration) {
                                resolve({
                                    success: true,
                                    cancel: false,
                                    list: canvasList,
                                    width: distWidth, //this.video.videoWidth,
                                    height: distHeight, // this.video.videoHeight,
                                })
                            } else {
                                this.video.currentTime = nextTime;
                                this.current_time = nextTime;
                            }
                        }, 0);

                    }
                }
                this.video.currentTime = this.start_time;
                
            }
            this.video.onerror= (e)=>{
                console.log(e);
                reject({
                    success: false,
                    list: [],
                })
            }
        })
    }
    cancel() {
        this.cancel = true;
    }
}
export default VideoCapture; 