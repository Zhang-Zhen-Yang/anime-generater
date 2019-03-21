<template>
  <div class="timeline">
    <block-slice :staticIndex="0" :staticValue="'76px'">
      <!--顶部-->
      <timelineMenu slot="s"></timelineMenu>
      <block-slice slot="e" :staticValue="'25px'" :staticIndex="1">

        <div slot="e" id="timeline-scroll-wrap" style="">
          <block-slice dir="horizontal" :staticValue="'260px'" >
            <div slot="s" style="width: 100%;height: 100%;">
              <!---->
              <timeline-left-title :layers="layers"></timeline-left-title>
              

            </div>
            <div slot="e" style="width: 100%;height: 100%;">
              e
            </div>
          </block-slice>

        </div>

        <!--底部-->
        <timeline-bottom slot="s">
          
        </timeline-bottom>

      </block-slice>
    </block-slice>
    <!--{{ target.name1}}-->
  </div>
</template>

<script>
import timelineMenu from './timelineMenu.vue';
import timelineBottom from './timelineBottom.vue';
import timelineLeftTitle from './timelineLeftTitle.vue';
export default {
  name: 'timelinear',
  components: {timelineMenu, timelineBottom, timelineLeftTitle},
  data () {
    return {
      msg: 'timelinear',
      target: {
        name1: {
          x: 1,
          y: 1
        },
        name2: 2,
        name3: 3
      }
    }
  },
  computed: {
    project() {
      return this.$store.state.project;
    },
    layers() {
      return this.project.layers;
    }
  },
  methods: {

  },
  created() {
    
  },
  mounted() {
   
  }
}
</script>

<style lang="scss">
  .timeline {
    // border-top: 1px solid #181818;
    
    width: 100%;
    height: 100%;
    color: #9f9f9f;
    font-size: 14px;
   
  }
  .timeline, .timeline__main {
    bottom: 0;
    left: 0;
    background: #2c2e2f;
    right: 0;
  }
  .timeline:before {
    position: absolute;
    top: 0;
    right: 0;
    background: #484a4b;
  }
  .properties-editor__title:before, .timeline:before {
    content: "";
    left: 0;
    height: 1px;
  }
  
  #timeline-scroll-wrap{
    width:100%;
    height: 100%;
    overflow:auto;
  }
  /*scrollbar*/
  #timeline-scroll-wrap::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    overflow: hidden;
  }
  #timeline-scroll-wrap::-webkit-scrollbar-thumb{
    background-color: #aaaaaa;
    transition: all 0.5s linear;
  }

  #timeline-scroll-wrap::-webkit-scrollbar-thumb:hover{
    background-color:#c1c1c1;
  }
  
</style>
