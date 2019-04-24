<template>
  <div class="voice-item-wrap" ref="voiceItemWrap" @dblclick="addTween">
    <div
      class="voice-item"
      v-for="item,index in voicesLocal"
      :data-index="index"
      :style="{left: item.left, width: item.width}"
      @click="setVoiceIndex(index)">
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
    voicesLocal() {
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
    as() {
      this.$store.dispatch('addStep');
    },
    // 添加缓动
    addTween(e) {
      let offsetX = e.offsetX;
      let totalWidth = (this.voiceItemWrap.clientWidth);
      let position = offsetX / totalWidth * this.tlDuration;
      console.log(position);
      this.voices.push({
      time: position,
      tex: '偶像大师',
      per: 0, // 人声
      data: '',
      duration: 3,
    },)
      // this.$store.dispatch('addTween', {topIndex: this.topIndex, subIndex: this.subIndex, position});

      // console.log(position);
    },
    setVoiceIndex(index) {
      this.tl.voiceIndex = index;
      this.tl.topIndex = -1;
      this.tl.subIndex = -1;
      this.$store.state.activeLayerIndex = [-1, -1]
    },
    bindView() {
      this.$voiceItemWrap.find('.voice-item').draggable({
        axis: 'x',
        container: 'parent',
        start: (e, ui)=>{

        },
        stop: (e, ui)=>{
          this.as();
          let left = ui.position.left;
          let totalWidth = (this.voiceItemWrap.clientWidth);
          let position = left / totalWidth * this.tlDuration;
          // console.log(position);
          let voiceIndex = $(e.target).data('index');
          console.log(voiceIndex);
          this.voices[voiceIndex].time = position;
          // console.log();
          /* this.dragging = false;
          let topIndex = this.topIndex;
          let subIndex = this.subIndex;
          this.$store.dispatch('updateTween', {topIndex, subIndex});
          */
          // this.$store.dispatch('setActiveTweenVer2', {t: this.tween[tweenIndex], topIndex, subIndex, tweenIndex});
        },
        drag: (e, ui)=>{

        }
      })
    }
  },
  created() {
    
  },
  mounted() {
    this.voiceItemWrap = this.$refs.voiceItemWrap;
    this.$voiceItemWrap = $(this.$refs.voiceItemWrap);
    this.bindView();
  },
  watch: {
    voicesLocal: {
      deep: true,
      handler() {
        this.bindView();
      }
    }
  }
}
</script>

<style lang="scss">
  .voice-item-wrap{
      width:100%;
      // background-color: yellowgreen;
      height: 22px;
    .voice-item{
      position: absolute;
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
