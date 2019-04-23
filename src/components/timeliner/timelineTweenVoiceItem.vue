<template>
  <div class="voice-item-wrap">
    <div class="voice-item" v-for="item,index in tweenLocal" :style="{left: item.left, width: item.width}" @click="setVoiceIndex(index)">
      {{ item.tex }}
      <voicePlayBlock :item="item"></voicePlayBlock>
    </div>
  </div>
</template>

<script>
import voicePlayBlock from './voicePlayBlock.vue';
export default {
  name: 'voice-item-wrap',
  components: {voicePlayBlock},
  data () {
    return {
      msg: 'voice-item-wrap',
    }
  },
  computed: {
    project() {
      return this.$store.state.project;
    },
    voices() {
      return this.project.voices;
    },
    tl() {
      return this.$store.state.tl;
    },
    showTweensMoveBlock() {
      return this.tl.showTweensMoveBlock;
    },
    tlDuration() {
      return this.tl.duration;
    },
    tlTopIndex() {
      return this.tl.topIndex;
    },
    tlSubIndex() {
      return this.tl.subIndex;
    },
    tlTweenIndex() {
      return this.tl.tweenIndex;
    },
    timeline(){
      return this.$store.state.timeline;
    },
    duration() {
      return this.timeline? this.timeline.duration : 0
    },
    tween() {
      return this.anTween.tween || [];
    },
    tweenLocal() {
      return this.voices.map((item)=>{
        let time = item.time || 0;
        // console.error('************************',time / this.tlDuration);
        let left = (time / this.tlDuration) * 100 + '%';
        let width = (item.duration * 1000 / this.tlDuration) * 100 + '%';
        let bgColor = '#EBCAFE';
        return {
          width,
          bgColor,
          left,
          tex: item.tex,
          data: item.data,
          time: item.time,
          duration: item.duration,
        }
      })
    }
  },
  methods: {
    setVoiceIndex(index) {
      this.tl.voiceIndex = index;
      this.tl.topIndex = -1;
      this.tl.subIndex = -1;
      this.$store.state.activeLayerIndex = [-1, -1]
    }
  },
  created() {
    
  },
}
</script>

<style lang="scss">
  .voice-item-wrap{
    .voice-item{
      position: absolute;
      width: 50px;
      height: 22px;
      top: 1px;
      background-color: #6ECEDF;
      color: white;
      font-size: 12px;
      white-space: nowrap;
      line-height: 23px;
      cursor: move;
      border-radius: 2px;
      min-width: 22px;
    }
  }
</style>
