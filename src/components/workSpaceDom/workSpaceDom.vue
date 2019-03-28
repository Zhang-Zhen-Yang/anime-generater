<template>
  <div id="work-space-dom" :style="stageStyle">
    {{ stage }}
    <div v-for="item, index in stage.children">
      <domImage
        :index="index - 1"
        v-if="item.children && item.children[0] && item.children[0].image" :obj="item.children[0]"></domImage>
    </div>
  </div>
</template>

<script>
import canvasRender from '../../script/canvasRender.js';
import domImage from './domImage.vue';
export default {
  name: 'work-space-dom',
  components: {domImage},
  data () {
    return {
      msg: 'work-space-dom'
    }
  },
  computed: {
    stage() {
      return this.$store.state.stage || {children: []};
    },
    size() {
     if(this.stage.canvas){
       let {width, height} = this.stage.canvas;
       return {width, height};
     }
     return {width: 0, height: 0};

    },
    stageStyle() {
      return {
        width: this.size.width + 'px',
        height: this.size.height + 'px',
      }
    },
    project() {
      return this.$store.state.project;
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
      
    },
    togglePlayState() {
      // this.playing = !this.playing;
    },
    test() {
      // this.$store.dispatch('test');
    }
  },
  created() {
    
  },
  mounted() {
    this.render();
    setTimeout(()=>{
      console.log(this.$store.state.stage);
    }, 3000)
  }
}
</script>

<style lang="scss">
  #work-space-dom{
    position: absolute;
    left:70px;
    top: 10px;
    width: 400px;
    height: 400px;
    background-color: rgba(0,0,0,0.2);
    overflow: hidden;
  }
</style>
