<template>
  <div id="work-space">
    <div class="inline-block" style="width:0px;height: 100%;vertical-align: middle;background-color:red;"></div>
    <canvas id="canvas" class="inline-block" ref="canvas" @click="togglePlayState">
    </canvas>
    <div style="display: inline-block;position: absolute;left: 50%;top: 50%;">
      <div :class="['pause-and-play-tip', playing ? 'pause-tip':'play-tip', 'pointer']" @click="togglePlayState">
      </div>
    </div>
    <button style="position: absolute;left: 10px;top: 10px;" @click="test">
      test
    </button>
    <workSpaceDom></workSpaceDom>
  </div>
</template>

<script>
import canvasRender from '../script/canvasRender.js';
import workSpaceDom from './workSpaceDom/workSpaceDom.vue';
export default {
  name: 'temp',
  components: {workSpaceDom},
  data () {
    return {
      msg: 'temp'
    }
  },
  computed: {
    project() {
      return this.$store.state.project;
    },
    playing:{
      get() {
        return this.$store.state.playing;
      },
      set(val) {
        window.timeline.setPaused(!val);
        this.$store.state.playing = val
      }
    },
    timeline() {
      return this.$store.state.timeline || {duration: 1};
    },
    duration() {
      return this.timeline.duration;
    },
  },
  methods: {
    render() {
      canvasRender.render({
        canvas: this.$refs.canvas,
        project: this.project,
        state: this.$store.state
      })
    },
    togglePlayState() {
      this.playing = !this.playing;
    },
    test() {
      this.$store.dispatch('test');
    }
  },
  created() {
    
  },
  mounted() {
    this.render();
  }
}
</script>

<style lang="scss">
  #work-space{
    width: 100%;
    height: 100%;
    text-align:center;
    #canvas{
      max-width: 95%;
      max-height: 95%;
      background-color: #efefef;
      vertical-align: middle;
    }
    #canvas:hover+div .pause-and-play-tip{
      display: block;
    }
    .pause-and-play-tip:hover{
      display: block;
    }
    .pause-and-play-tip{
      position: absolute;
      display: none;
      width: 80px;
      height: 80px;
      /*max-height: 90%;*/
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      transform: translate(0, -50%);
    }
    .play-tip{
      display: block!important;
      background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3Cstyle/%3E%3C/defs%3E%3Cpath d='M666 498L445.2 290.8c-12.4-6.4-26.8-5.2-38.8 1.6-12 7.2-18.8 19.6-18.8 33.2v401.6c0 13.2 7.2 26 18.8 32.8 6.4 4 13.2 5.6 20.4 5.6 6.4 0 12.4-1.6 17.6-4.4l220.8-194.8c12.4-11.6 22-20 22-34.8.4-13.6-8-21.6-21.2-33.6z' fill='%231296db'/%3E%3Cpath d='M514.4 36C250.8 36 36 250.8 36 514.4s214.8 478.4 478.4 478.4S992.8 778 992.8 514.4 777.6 36 514.4 36zm0 896.8C283.2 932.8 96 744.8 96 514.4 96 283.2 284 96 514.4 96c231.2 0 418.4 188 418.4 418.4 0 230.8-187.6 418.4-418.4 418.4z' fill='%231296db'/%3E%3C/svg%3E");
    }
    .pause-tip{
      background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3Cstyle/%3E%3C/defs%3E%3Cpath d='M515.2 36C251.6 36 36.8 250.8 36.8 514.4s214.8 478.4 478.4 478.4S993.6 778 993.6 514.4 778.8 36 515.2 36zm0 896.8c-231.2 0-418.4-188-418.4-418.4C96.8 283.6 284.8 96 515.2 96c231.2 0 418.4 188 418.4 418.4 0 231.2-187.6 418.4-418.4 418.4z' fill='%231296db'/%3E%3Cpath d='M419.2 290.4c-21.2 0-38.8 17.6-38.8 38.8V700c0 21.2 17.6 38.8 38.8 38.8S458 721.6 458 700V329.2c0-21.2-17.6-38.8-38.8-38.8zM611.2 290.4c-21.2 0-38.8 17.6-38.8 38.8V700c0 21.2 17.6 38.8 38.8 38.8S650 721.6 650 700V329.2c0-21.2-17.6-38.8-38.8-38.8z' fill='%231296db'/%3E%3C/svg%3E");
    }
  }
</style>
