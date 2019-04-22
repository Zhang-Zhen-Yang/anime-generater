<template>
  <div style="padding-left: 15px;">
    <div class="video-range-select">
      <mask-replace-video @selectVideo="selectVideo" @clipVideo="clipVideo">
        <video :src="layer.src" style="max-width: 100%;vertical-align:middle;"></video>
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
      msg: 'video-range-select'
    }
  },
  computed: {
    dialogVideoClip() {
      return this.$store.state.dialogVideoClip;
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
    }
  },
  created() {
    
  },
}
</script>

<style lang="scss">
  .video-range-select{
    position: relative;
  }
</style>
