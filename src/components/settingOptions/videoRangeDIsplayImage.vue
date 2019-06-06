<template>
  <div>
    <div class="video-range-display-image" ref="videoWrap">
      <div v-show="videoLocalImage">
        <img  alt="" style="max-width: 100%;vertical-align:middle;">
      </div>
      <video v-show="!videoLocalImage" :src="layer.src" style="max-width: 100%;vertical-align:middle;"></video>
    </div>
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
  data () {
    return {
      msg: 'videoRangeDIsplayImage'
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
    }
  },
  methods: {
    appendVideo() {
      if(this.videoLocalImage) {
        if(this.layer.videoObj.canvasList[0]) {
          this.$refs.videoWrap.innerHTML='';
          // console.log('this.videoLocalImage', this.layer.videoObj.canvasList[0]);
          this.$refs.videoWrap.appendChild(this.layer.videoObj.canvasList[0]);
        }
      } else {
        this.currentVideo = this.layer.videoObj.video;
        this.$refs.videoWrap.innerHTML='';
        this.$refs.videoWrap.appendChild(this.layer.videoObj.video);
      }
    }
  },
  mounted() {
    this.appendVideo();
  },
  created() {
    
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
        this.appendVideo();
      },
      deep: true
    },
    videoLocalImage() {
      this.appendVideo();
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
