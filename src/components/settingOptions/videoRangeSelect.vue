<template>
  <div style="padding-left: 15px;">
    <div class="video-range-select">
      <mask-replace-video @selectVideo="selectVideo" @clipVideo="clipVideo">
        <div ref="videoWrap">
          <video :src="layer.src" style="max-width: 100%;vertical-align:middle;"></video>
        </div>
        <div :data-timestamp="timestamp" style="width: 100%;overflow: hidden;">
          <div class="capture-progress" :style="{width: (layer.videoObj.canvasList.length - 1) * layer.interval / videoDuration *100 +'%'}"></div>
        </div>
      </mask-replace-video>
    </div>
  </div>
</template>

<script>
export default {
  name: 'video-range-select',
  props: {
    layer: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data () {
    return {
      msg: 'video-range-select',
      currentVideo: null,
    }
  },
  computed: {
    dialogVideoClip() {
      return this.$store.state.dialogVideoClip;
    },
    videoDuration() {
      let videoDuration = (this.layer.end_time - this.layer.start_time);
      return videoDuration;
    },
    timestamp() {
      return this.layer.timestamp;
    },
    videoObj(){
      return this.layer.videoObj;
    }
  },
  methods: {
    selectVideo() {
      alert('selectVideo');
    },
    clipVideo() {
      this.dialogVideoClip.item = this.layer;

      this.dialogVideoClip.src = this.layer.src;
      this.dialogVideoClip.start_time = this.layer.start_time;
      this.dialogVideoClip.end_time = this.layer.end_time;
      this.dialogVideoClip.show = true;
      
      // alert('clipVideo');
    },
    appendVideo() {
      this.currentVideo = this.layer.videoObj.video;
      this.$refs.videoWrap.innerHTML='';
      this.$refs.videoWrap.appendChild(this.layer.videoObj.video);
    }
  },
  created() {
    
  },
  mounted() {
    this.appendVideo();
  },
  watch: {
    timestamp(n, o) {
      // alert('dfdd');
      if(this.currentVideo != this.layer.videoObj.video) {
        this.appendVideo();
      }
      console.log(this.currentVideo == this.layer.videoObj.video);
    }
  }
}
</script>

<style lang="scss">
  .video-range-select{
    position: relative;
    video{
      max-width: 100%;vertical-align:middle;
    }
    .capture-progress{
      width: 100%;
      height: 5px;
      background-color: orange;
    }
  }
</style>
