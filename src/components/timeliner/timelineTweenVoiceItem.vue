<template>
  <div class="voice-item-wrap" ref="voiceItemWrap" @dblclick="addTween">
    <div
      v-for="item,index in voicesLocal"
      :class="['voice-item', voiceIndex == index ? 'active-voice-item': '']"
      :data-index="index"
      :data-width="item.width"
      :title="item.tex ? item.tex : '请输入文本并点击生成相应音频'"
      :style="{left: item.left, width: item.width}"
      @click="setVoiceIndex(index)">
      {{ item.tex }} {{ /*item.duration */}}
      <voicePlayBlock :item="item"></voicePlayBlock>
    </div>
    <!-- <voicePlayBlock :item="bgMusicItem"></voicePlayBlock> -->
  </div>
</template>

<script>
import voicePlayBlock from './voicePlayBlock.vue';
import utilTimeline from '../../script/utilTimeline';
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
    voiceIndex() {
      return this.tl.voiceIndex;
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
    },
    // 背景音乐
    bgMusicItem() {
      return {
        data: this.$store.state.bgMusic,
        time: 0,
        duration: 0,
      }
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
      console.log([this.voices, position]);
      let p = utilTimeline.getIndexByPosition({list: this.voices, position});
      // alert(p);
      /* this.voices.splice(p,0,{
        time: position,
        tex: '',
        per: 0, // 人声
        data: '',
        duration: 0,
      })*/
      this.voices.push({
        time: position,
        tex: '',
        per: 0, // 人声
        data: '',
        duration: 0,
      })
      this.voices.sort((first, second)=>{
        return first.time - second.time;
      });
      this.tl.voiceIndex = p + 1; // this.voices.length - 1;
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
        containment: 'parent',
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
          this.$nextTick(()=>{
            this.voices[voiceIndex].time = position;
            $(e.target).css({
              width: $(e.target).attr('data-width'),
            })
          })
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
        this.$nextTick(()=>{
          this.bindView();
        })
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
      // background-color: #6ECEDF;
      background-color: #de698c;
      background-color: #37393A;
      color: white;
      font-size: 12px;
      line-height: 21px;
      cursor: move;
      border-radius: 2px;
      min-width: 22px;
      border: 1px solid rgba(0,0,0,0.3);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 0 0 0 5px;
    }
    .active-voice-item{
      // border: 1px solid rgba(255,0,0,1);
      border: 1px solid #6ECEDF;
      background-color: #6ECEDF;
    }
  }
</style>
