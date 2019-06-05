<template>
  <div class="video-range-display-image" ref="videoWrap">
    <div v-show="videoLocalImage">
      <img  alt="" style="max-width: 100%;vertical-align:middle;">
    </div>
    <video v-show="!videoLocalImage" :src="layer.src" style="max-width: 100%;vertical-align:middle;"></video>
    {{ !!videoLocalImage }}

    j;lllllllllllllllllllllllllllllllllllllllllllllllllllllllll
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
  },
  methods: {
    appendVideo() {
      if(this.videoLocalImage) {
        this.$refs.videoWrap.innerHTML='';
        this.$refs.videoWrap.appendChild(this.layer.videoObj.canvasList[0]);
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
      console.log(this.currentVideo == this.layer.videoObj.video);
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
