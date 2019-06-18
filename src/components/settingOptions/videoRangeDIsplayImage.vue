<template>
  <div>
    <div class="video-range-display-image" ref="videoWrap" v-videodisplay>
      <!--<div v-show="videoLocalImage">
        <img  alt="" style="max-width: 100%;vertical-align:middle;">
      </div>
      <video v-show="!videoLocalImage" :src="layer.src" style="max-width: 100%;vertical-align:middle;"></video>-->
    </div>
    <!--{{ clipIndex }}-->
    <canvas ref="canvas" style="max-width: 100%;"></canvas>
    <div :data-timestamp="timestamp" style="width: 100%;overflow: hidden;">
      <!--{{ timestamp }} | {{ layer.start_time }} |{{ layer.videoObj.canvasList.length }} | {{ videoDuration }} | {{ layer.videoObj.localVideoCapturePregress}}-->
      <div class="capture-progress" :style="{
        width: (layer.videoObj.canvasList.length > 0 ? ((layer.videoObj.canvasList.length - 1) * layer.interval / videoDuration) : ( (layer.videoObj.localVideoCapturePregress * 1000) / videoDuration) ) *100 +'%'
      }"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'videoRangeDIsplayImage',
  props: {
    layer: {
      type: Object,
      default(){
        return {};
      }
    }
  },
  directives: {
    videodisplay: {
      inserted: function (el) {
        
        // alert('ddddddddddddddddddd');
      },
      update: function(){
        // alert('update');
      }
    }
  },
  data () {
    return {
      msg: 'videoRangeDIsplayImage',
      image: new Image(),
    }
  },
  computed: {
    videoDuration() {
      let videoDuration = (this.layer.end_time - this.layer.start_time);
      return videoDuration;
    },
    timestamp() {
      return this.layer.timestamp;
    },
    videoObj() {
      return this.layer.videoObj;
    },
    videoLocalImage() {
      if(this.layer && this.layer.videoObj.canvasList[0]) {
        return this.layer.videoObj.canvasList[0].src;
      }
      return;
    },
    progressWidth(){
      return (this.layer.videoObj.canvasList.length - 1) * this.layer.interval / this.videoDuration *100 +'%';
    },
    localVideoCapturePregress() {
      return this.videoObj.localVideoCapturePregress;
    },
    clipIndex() {
      let index = this.layer.clipIndex;
      
      return index;
    }

  },
  methods: {
    appendVideo() {

      /* let image = new Image();
      image.src = 'https://imgs.aixifan.com/o_1dclg53pmrp91sq1jlv1f3oao76a.png';
      image.onload = ()=>{
        this.$refs.videoWrap.innerHTML='';
        // console.log('this.videoLocalImage', this.layer.videoObj.canvasList[0]);
        this.$refs.videoWrap.appendChild(image);
      }
      return;*/
      /*
      if(this.videoLocalImage) {
        if(this.layer.videoObj.canvasList[0]) {
          this.image = this.layer.videoObj.canvasList[0]
          this.$refs.videoWrap.innerHTML='';
          // console.log('this.videoLocalImage', this.layer.videoObj.canvasList[0]);
          this.$refs.videoWrap.appendChild(this.image);
        }
      } else {
        this.currentVideo = this.layer.videoObj.video;
        this.$refs.videoWrap.innerHTML='';
        this.$refs.videoWrap.appendChild(this.layer.videoObj.video);
      }
      */
    },
    drawImage(index) {
      let img = this.layer.list[index];
      if(this.ctx && img) {
        let width = img.width;
        let height = img.height;
        this.$refs.canvas.width = width;
        this.$refs.canvas.height = height;
        // console.log([width, height]);
        this.ctx.drawImage(this.layer.list[index], 0, 0);
      }
    }

  },
  mounted() {
    console.log('dom mounted');
    this.appendVideo();
    this.interval = setInterval(()=>{
      // console.log(this.image);
      // console.log(this.$refs.videoWrap.innerHTML);
      if(this.$refs.videoWrap.innerHTML=='') {
        this.appendVideo();
      }
    }, 500)
    this.ctx = this.$refs.canvas.getContext('2d');
    this.drawImage(0);
  },
  destroyed() {
    if(this.interval) {
      clearInterval(this.interval);
    }
  },
  created() {
    console.log('dom created');
  },
  updated() {
    console.log('dom updatated');
  },
  watch: {
    timestamp(n, o) {
      // alert('dfdd');
      if(this.currentVideo != this.layer.videoObj.video) {
        this.appendVideo();
      }
      // console.log(this.currentVideo == this.layer.videoObj.video);
    },
    videoObj:{
      handler() {
        console.log('videoObj');
        this.appendVideo();
      },
      deep: true
    },
    videoLocalImage() {
      this.appendVideo();
    },
    clipIndex(n,o) {
      console.log(n);
      this.drawImage(n);
    }
  }
}
</script>

<style lang="scss">
  .video-range-display-image{
    video{
      max-width: 100%;
    }  
    img{
      max-width: 100%;
    } 
  }
</style>
