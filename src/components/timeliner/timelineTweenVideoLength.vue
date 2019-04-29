<template>
  <div class="timeline-tween-video-length" :style="style">
    <div :data-timestamp="item.timestamp" v-if="item.videoObj" class="video-length-inner" :style="{width: (item.videoObj.canvasList.length - 1) * item.interval / videoDuration *100 + '%'}">
      <!--{{ item.timestamp }} || {{ item.videoObj.canvasList.length }}-->
    </div>
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
    videoDuration() {
      let videoDuration = (this.item.end_time - this.item.start_time);
      return videoDuration;
    },
    style() {
      let min = Math.min.apply(null, this.tweenNumList);
      let max = Math.max.apply(null, this.tweenNumList);
      
      // console.log('videoDuration', this.videoDuration);
      // console.log('this.tlDuration', this.tlDuration);
      return {
        left: `${min}%`,
        width: `${this.videoDuration / this.tlDuration * 100}%`,
        minWidth: '0',
      }
    },
    progressStyle() {
      console.log((this.item.videoObj.canvasList.length - 1) * this.item.interval / this.videoDuration * 100 + '%');
      return {
        width: `${(this.item.videoObj.canvasList.length - 1) * this.item.interval / this.videoDuration * 100 }%`,
        height: '10px',
        backgroundColor: 'yellow',
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
  .video-length-inner{
    height: 10px;
    background-color: orange;
    margin-top: -1px;
  }
  .timeline-tween-video-progress-arrow{
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M699.712 512l-256 256L384 708.288 580.288 512 384 315.712 443.712 256z' fill='%23d81e06'/%3E%3C/svg%3E");
  }
</style>
