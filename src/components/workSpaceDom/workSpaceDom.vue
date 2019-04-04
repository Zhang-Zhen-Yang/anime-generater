<template>
  <div id="work-space-dom" :style="stageStyle">
    <!--{{ stage }}-->
    <!--<div v-for="item, index in stage.children">
      <domImage
        :index="index - 1"
        v-if="item.children && item.children[0] && item.children[0].image" :obj="item.children[0]"></domImage>
    </div>-->
    <div v-for="item, index in layers">
      <!--图片类型-->
      <domImage
        :index="index"
        v-if="item.type=='image'&&item.obj && item.obj.image" :obj="item.obj"></domImage>
      <domText
        :index="index"
        v-if="item.type=='text'&&item.obj" :obj="item.obj"></domText>
      <domText
        :index="index"
        v-if="item.type=='shape'&&item.obj" :obj="item.obj" :isShape="true"></domText>
      <domContainer
        :index="index"
        v-if="item.type=='container'&&item.obj" :obj="item.obj" :item="item"></domContainer>
    </div>

  </div>
</template>

<script>
import canvasRender from '../../script/canvasRender.js';
import domImage from './domImage.vue';
import domText from './domText.vue';
import domContainer from './domContainer.vue';
export default {
  name: 'work-space-dom',
  components: {domImage, domText, domContainer},
  data () {
    return {
      msg: 'work-space-dom'
    }
  },
  computed: {
    c() {
      return window.createjs;
    },
    project(){
      return this.$store.state.project;
    },
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
        width: this.project.width + 'px',//this.size.width + 'px',
        height: this.project.height + 'px', // this.size.height + 'px',
      }
    },
    project() {
      return this.$store.state.project;
    },
    layers() {
      return this.project.layers
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
      console.log(this.c.Bitmap);
    }, 3000)

  }
}
</script>

<style lang="scss">
  #work-space-dom{
    position: absolute;
    left:50%;
    transform: translate(-50%, 0);
    top: 0;
    width: 400px;
    height: 400px;
    // background-color: rgba(0,0,0,0.2);
    // overflow: hidden;

  }
</style>
