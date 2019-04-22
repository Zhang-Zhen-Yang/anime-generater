class VideoCapture {
    constructor({src, start_time, end_time, interval}) {
        this.video = document.createElement('video');
        this.video.src = src;
        this.start_time = start_time;
        this.current_time = start_time;
        this.end_time = end_time;
        this.interval = interval;
        this.cancel = false
        this.video.style="position:absolute;left:0;top:100px;background-color: white;width: 300px;";
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
                this.video.oncanplay = ()=>{
                    console.log('current:'+this.video.currentTime);
                    let canvas = document.createElement('canvas');
                    canvas.width = this.video.videoWidth;
                    canvas.height = this.video.videoHeight;
                    let ctx = canvas.getContext('2d');
                    ctx.drawImage(this.video, 0, 0);
                    canvasList.push(canvas);
                    if(this.cancel) {
                        resolve({
                            success: false,
                            cancel: true,
                            list: canvasList,
                            width: this.video.videoWidth,
                            height: this.video.videoHeight,
                        })
                    }
                    // 当前时间大于等于结束时间
                    if(this.current_time >= this.end_time) {
                        console.log('end');
                        resolve({
                            success: true,
                            cancel: false,
                            list: canvasList,
                            width: this.video.videoWidth,
                            height: this.video.videoHeight,
                        })
                    } else {
                        setTimeout(()=>{
                            this.video.currentTime += this.interval;
                            this.current_time = this.video.currentTime;
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