// 根据stage 中的元素来同步显示dom元素
<template>
  <div id="work-space-dom" :style="stageStyle">
    <!--{{ stage }}-->
    <!--<div v-for="item, index in stage.children">
      <domImage
        :index="index - 1"
        v-if="item.children && item.children[0] && item.children[0].image" :obj="item.children[0]"></domImage>
    </div>-->
    <div v-for="item, index in layers" v-show="type == 'canvas' || item.editable">
      <!--图片类型-->
      <domImage
        :index="index"
        v-if="item.type=='image'&&item.obj && item.obj.image" :obj="item.obj" :type="type"></domImage>
      <domText
        :index="index"
        v-if="item.type=='text'&&item.obj" :obj="item.obj" :canvastype="'text'" :type="type" :item="item"></domText>
      <domText
        :index="index"
        v-if="item.type=='shape'&&item.obj" :obj="item.obj" :canvastype="'shape'" :item="item" :isShape="true" :type="type"></domText>
      <domContainer
        :index="index"
        v-if="item.type=='container'&&item.obj" :obj="item.obj" :item="item" :type="type"></domContainer>
      <domText
        :index="index"
        v-if="item.type=='video'&&item.obj" :obj="item.obj" :canvastype="'video'" :item="item" :isShape="true" :type="type"></domText>
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
  props: {
    type: {
      type: String,
      default: 'event',
    }
  },
  data () {
    return {
      msg: 'work-space-dom',
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
    zoom() {
      return this.project.zoom;
    },
    stageStyle() {
      let style = {
        width: this.project.width *  this.zoom+ 'px',//this.size.width + 'px',
        height: this.project.height * this.zoom + 'px', // this.size.height + 'px',
      }
      if(this.type == 'canvas') {
        style.zIndex = -1;
      }
      return style; 
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
      //console.log(this.$store.state.stage);
      // console.log(this.c.Bitmap);
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
