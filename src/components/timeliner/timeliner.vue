<template>
  <div class="timeline" @contextmenu="contextmenu">
    <block-slice :staticIndex="0" :staticValue="'76px'">
      <!--顶部-->
      <timelineMenu slot="s"></timelineMenu>
      <block-slice slot="e" :staticValue="'25px'" :staticIndex="1">

        <div slot="e" id="timeline-scroll-wrap" style="">
          <block-slice dir="horizontal" :staticValue="'260px'" >
            <div slot="s" :style="timelineLeftTitleWrapStyle" @dragover="dragover" @drop="drop">
              <!---->
              <timeline-left-title :layers="layers" ref="timelineLeftTitle"></timeline-left-title>
            </div>
            <div slot="e" :style="timelineTweenWrapStyle">
              <div style="position:relative;with: 100%;height: 100%;">
                <timeline-tween ></timeline-tween>
              </div>
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
import timelineTween from './timelineTween.vue';
export default {
  name: 'timelinear',
  components: {timelineMenu, timelineBottom, timelineLeftTitle, timelineTween},
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
    },
    layersTotalCount() {
      let count = 0;
      this.layers.forEach((item, index)=>{
        if(item.type == 'container') {
          count += (item.children.length + 1);
        } else {
          count += 1;
        }
      })
      return count;
    },
    timelineLeftTitleWrapStyle() {
      return {
        width: '100%',
        minHeight: '100%',
        height: `${25 * (this.layersTotalCount + 1)}px`,
        backgroundColor: '#2c2e2f',
        borderRight: '1px solid rgba(255, 255, 255,0.3)',
      }
    },
    timelineTweenWrapStyle() {
      return {
        width: '100%',
        minHeight: '100%',
        height: `${25 * (this.layersTotalCount + 1)}px`,
        padding: '0 0 0 5px',
        overflow: 'hidden',
      }
    }
  },
  methods: {
    dragover(e) {
      e.preventDefault();
    },
    drop(e) {
      this.$refs.timelineLeftTitle.dropInOuter(e);
      console.log('dddddd');
    },
    contextmenu(e) {
      e.preventDefault();
    }
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
    overflow: hidden;
    -webkit-user-select: none;
    user-select: none;
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
