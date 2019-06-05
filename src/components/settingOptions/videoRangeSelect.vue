<template>
  <div style="padding-left: 15px;">
    <div class="video-range-select">
      <mask-replace-video @selectVideo="selectVideo" @clipVideo="clipVideo">
        <div ref="videoWrap">
          <videoRangeDIsplayImage :layer="layer"></videoRangeDIsplayImage>
        </div>
        <div :data-timestamp="timestamp" style="width: 100%;overflow: hidden;">
          <div class="capture-progress" :style="{width: (layer.videoObj.canvasList.length - 1) * layer.interval / videoDuration *100 +'%'}"></div>
        </div>
      </mask-replace-video>
    </div>
    <table cellspacing="0" cellpadding="0" style="width: 100%;">
      <tr>
        <td>
            <checkbox v-model="videoFillBefore">
              &nbsp;播放前显示
            </checkbox>
            
        </td>
        <td>
          <checkbox v-model="videoFillAfter">
            &nbsp;播放后显示
          </checkbox>
        </td>
      </tr>
    </table>
    <table cellspacing="0" cellpadding="0" style="width: 100%;">
      <tr>
        <td>
            <checkbox v-model="fillBefore">
              &nbsp;缓动前显示
            </checkbox>
            
        </td>
        <td>
          <checkbox v-model="fillAfter">
            &nbsp;缓动后显示
          </checkbox>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import videoRangeDIsplayImage from './videoRangeDIsplayImage.vue';
export default {
  name: 'video-range-select',
  components: {videoRangeDIsplayImage},
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
    },
    videoFillBefore: {
      get() {
        return this.layer.videoFillBefore;
      },
      set(val) {
        this.as();
        this.layer.videoFillBefore = val;
        this.update();
        let currentPosition = window.timeline.position;
        // window.timeline.position = 0;
        // window.timeline.position = currentPosition;
      }
    },
    videoFillAfter: {
      get() {
        return this.layer.videoFillAfter;
      },
      set(val) {
        this.as();
        this.layer.videoFillAfter = val;
        this.update();
      }
    },
    fillBefore: {
      get() {
        return this.layer.fillBefore;
      },
      set(val) {
        this.as();
        this.layer.fillBefore = val;
        this.update();
        // let currentPosition = window.timeline.position;
        // window.timeline.position = 0;
        // window.timeline.position = currentPosition;
      }
    },
    fillAfter: {
      get() {
        return this.layer.fillAfter;
      },
      set(val) {
        this.as();
        this.layer.fillAfter = val;
        this.update();
      }
    }
  },
  methods: {
    as() {
      this.$store.dispatch('addStep');
    },
    update() {
      let {topIndex, subIndex} = this.$store.state.tl; 
      this.$store.dispatch('updateTween', {topIndex, subIndex});
    },
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
      /* this.currentVideo = this.layer.videoObj.video;
      this.$refs.videoWrap.innerHTML='';
      this.$refs.videoWrap.appendChild(this.layer.videoObj.video);*/
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
