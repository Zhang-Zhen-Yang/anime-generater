<template>
  <div class="timeline-tween-video-length" :style="style">
  </div>
</template>

<script>
export default {
  name: 'timeline-tween-video-length',
  props: {
    item: {
      type: Object,
      defatult() {
        return {};
      }
    },
    tween: {
      type: Array,
      default() {
        return [
          {
            left:0,
          }
        ]
      }
    }
  },
  data () {
    return {
      msg: 'timeline-tween-video-length'
    }
  },
  computed: {
    tweenNumList() {
      return this.tween.map((item)=>{
        return parseFloat(item.left);
      });
    },
    tl() {
      return this.$store.state.tl;
    },
    tlDuration() {
      return this.tl.duration;
    },
    style() {
      let min = Math.min.apply(null, this.tweenNumList);
      let max = Math.max.apply(null, this.tweenNumList);
      let videoDuration = (this.item.end_time - this.item.start_time);
      console.log('videoDuration', videoDuration);
      console.log('this.tlDuration', this.tlDuration);
      return {
        left: `${min}%`,
        width: `${videoDuration / this.tlDuration * 100}%`,
        minWidth: '0',
      }
    }
  },
  methods: {

  },
  created() {
    
  },
}
</script>

<style lang="scss">
  .timeline-tween-video-length{
    position: absolute;
    height: 10px;
    // background-color: red;
    background-size: auto 10px;
    top: 8px;
    opacity: 0.7;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M512 256c141.408 0 256 114.592 256 256S653.408 768 512 768 256 653.408 256 512s114.592-256 256-256z' fill='%23d81e06'/%3E%3C/svg%3E");

  }
</style>
