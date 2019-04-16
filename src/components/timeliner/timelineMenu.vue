<template>
  <div class="timeline-menu">
    <!---->
    <div style="height:26px">
      <!--dfdfdfd-->
    </div>
    <!--播放控制-->
    <div style="height:50px;" class="timeline-subtitle">
      <block-slice slot="e" dir="horizontal" :staticIndex="0" :staticValue="'260px'">
        <div slot="s" style="position:relative;z-index:1;border-bottom:1px solid rgb(82, 82, 82);">
          <table cellspacing="0" cellpadding="0" style="width: 100%;line-height:30px;">
            <tr>
              <td style="width: 15%;">
                <!--大规模d-->
              </td>
              <td>
                <div :class="['timeline-play-pause-icon', playing? 'pause-icon' : 'play-icon']" @click="togglePlayState">

                </div>
              </td>
              <td class="center">
                {{ position }} / {{ duration }}
              </td>
              <td style="width: 55px;">
                <num-resize v-model="tlDuration" :stepScale="0.2">
                  <div style="display:inline-block;border-bottom:1px dashed rgba(255, 255, 255, 0.6);line-height:1.2em;">
                    {{ tlDuration.toFixed(2) }}
                  </div>
                </num-resize>
              </td>
            </tr>
          </table>
          <table cellspacing="0" cellpadding="0" style="margin-top:-6px;width: 98%;background-color:#2c2e2f;">
            <tr>
              <td>
                <!--5555-->
              </td>
              <td>
                <!--555-->
              </td>
              <td class="right">
                <div
                  title="显示或隐藏所有图层"
                  class="bg-preset timeline-view-eye timeline-view-eye-visible pointer"
                  @click="toggleVisibleAll"></div>
                <div class="bg-preset timeline-view-layer-lock pointer" @click="toggleEditableAll"></div>
              </td>
            </tr>
          </table>
        </div>
        <!--和 控制条-->
        <div slot="e">
          <!--拖动-->
          <div id="timeline-drag-thumbnail-wrap" ref="timeline-drag-thumbnail-wrap">
            <div id="timeline-drag-thumbnail">
              <!--timeline-drag-thumbnail-->
              <div id="timeline-drag-thumbnail-handle" style=""></div>
            </div>
            <!--时间轴刻度-->
            <timeline-scale></timeline-scale>
          </div>
          <div>
            <timeline-pointer></timeline-pointer>
          </div>
        </div>
      </block-slice>
    </div>
  </div>
</template>

<script>
import timelineScale from './timelineScale';
import timelinePointer from './timelinePointer';
export default {
  name: 'timelineMenu',
  components: {timelineScale, timelinePointer},
  data () {
    return {
      msg: 'timelineMenu',
      resizing: false,
    }
  },
  computed: {
    timeline() {
      return this.$store.state.timeline;
    },
    durationNum() {
      return this.timeline? this.timeline.duration : 0;
    },
    duration() {
      return (this.durationNum / 1000).toFixed(3);
    },
    position() {
      return ((this.$store.state.position || 0) / 1000).toFixed(3);
    },
    tl() {
      return this.$store.state.tl;
    },
    tlScale() {
      return this.tl.scale;
    },
    tlDuration:{
      get() {
        return (this.tl.duration / 1000);
      },
      set(val) {
        let toSetValue = val * 1000;
        console.log([toSetValue, this.durationNum]);
        if(toSetValue >= this.durationNum && (toSetValue < this.durationNum * 2 || toSetValue < 9000)) {
          this.tl.duration = toSetValue;
        }
      }
    },
    playing:{
      get() {
        return this.$store.state.playing;
      },
      set(val) {
        window.timeline.setPaused(!val);
        this.$store.state.playing = val;
      }
    }
  },
  methods: {
    // 播放 暂停
    togglePlayState() {
      this.playing = !this.playing;
    },
    // 显示隐藏所有
    toggleVisibleAll() {
      this.$store.dispatch('toggleVisibleAll');
    },
    // 切换可编辑所有
    toggleEditableAll() {

    },
    setDragThumbnailWidth() {
      $('#timeline-drag-thumbnail').css({
        width: this.tlScale * 100 + '%',
      })
    },
  },
  created() {
    
  },
  mounted() {
    $(()=>{
      $('#timeline-drag-thumbnail').draggable({
        axis: 'x',
        containment: '#timeline-drag-thumbnail-wrap',
        start: () => {

        },
        stop: () => {

        },
        drag: (e, ui) => {
          let left = ui.position.left;
          let totalWidth = this.$refs['timeline-drag-thumbnail-wrap'].clientWidth;
          // console.log(totalWidth.clientWidth);
          this.tl.offsetX = left / totalWidth; 
          // console.log(this.tl.offsetX);
        }
      })
      .resizable({
        handles: "w,e",
        minWidth: 100,
        containment: 'parent',
        start: () => {
          this.resizing = true;
        },
        stop: () => {
           this.resizing = false;
           this.setDragThumbnailWidth();
        },
        resize: (e, ui) => {
          let totalWidth = this.$refs['timeline-drag-thumbnail-wrap'].clientWidth;
          let width = ui.size.width;
          let left = ui.position.left;
          this.tl.offsetX = left / totalWidth;
          this.tl.scale = width / totalWidth;
        }
      })
    })
    this.setDragThumbnailWidth();
  },
  watch:{
    tlScale() {
      if(!this.resizing) {
        this.setDragThumbnailWidth();
      }
    },
  }
}
</script>

<style lang="scss">
  .timeline-menu {
    border-top: 1px solid #181818;
    position: absolute;
    top: 0px;
    left: 0;
    right: 0;
    height: 25px;
    // padding: 0 20px;
    background: #2c2e2f;
    td{
      vertical-align: middle;
    }
    input{
      width: 50px;
      padding-right: 0;
    }
  }
  .timeline-menu:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: #484a4b;
  }
  .timeline-subtitle{
    border-top: 1px solid #181818;
    position: absolute;
    width: 100%;
  }
  .timeline-subtitle:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: #484a4b;
  }

  #timeline-drag-thumbnail-wrap{
    padding-top: 5px;
    position: relative;
  }
  // 拖动条
  #timeline-drag-thumbnail{
    width: 10%;
    height: 20px;
    background-color: #37393A;
    opacity: 1;
    cursor: move;
    .ui-resizable-w, .ui-resizable-e{
      top:0;
      height: 100%;
      border-radius: 0;
      opacity: 0;
      transform: translate(0,0);
    }
    #timeline-drag-thumbnail-handle{
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 90;
    }
  }

  

  // 播放 暂停按钮
  .timeline-play-pause-icon{
    display: inline-block;
    width: 25px;
    height: 25px;
    background-size: contain;
    background-position: center;
    background-repeat:no-repeat;
    vertical-align: middle;
    cursor: pointer;
    opacity: 0.8;
    &:hover{
      opacity: 1;
    }
  }
  .play-icon{
    background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3Cstyle/%3E%3C/defs%3E%3Cpath d='M298.667 256v512l426.666-256z' fill='%231296db'/%3E%3C/svg%3E");
  }
  .pause-icon{
    background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3Cstyle/%3E%3C/defs%3E%3Cpath d='M341.333 298.667h128v426.666h-128zm213.334 0h128v426.666h-128z' fill='%231296db'/%3E%3C/svg%3E"); 
  }
  .timeline-view-eye, .timeline-view-layer-lock{
    display:inline-block;
    width: 20px;
    height: 20px;
    opacity: 0.8;
  }
  .timeline-view-eye-visible{
    background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3Cstyle/%3E%3C/defs%3E%3Cpath d='M945.724 511.931c0 83.503-178.842 261.637-433.701 261.637-248.372 0-433.701-175.202-433.701-261.637 0-86.422 186.128-261.356 433.701-261.356 256.862.001 433.762 174.935 433.701 261.357zM512.405 298.299c-115.427 0-208.998 95.714-208.998 213.774 0 118.061 93.57 213.774 208.998 213.774 115.462 0 209.036-95.714 209.036-213.774-.001-118.06-93.574-213.774-209.036-213.774zm-.382 77.295c-73.507 0-133.097 60.94-133.097 136.122 0 75.173 59.59 136.125 133.097 136.125s133.073-60.952 133.073-136.125c0-75.182-59.566-136.122-133.073-136.122z' fill='%23ffffff'/%3E%3C/svg%3E");
    margin-right: 2px;
  }
  .timeline-view-layer-lock{
    background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3Cstyle/%3E%3C/defs%3E%3Cpath d='M644.01 342.016V256q0-54.016-38.997-93.013T512 123.989t-93.013 38.998T379.989 256v86.016h264.022zm-132.01 384q34.005 0 59.99-25.984t25.983-59.99-25.984-59.989T512 554.07t-59.99 25.984-25.983 59.99 25.984 59.989T512 726.016zm256-384q34.005 0 59.99 25.003t25.983 59.008v427.989q0 34.005-25.984 59.008T768 938.027H256q-34.005 0-59.99-25.003t-25.983-59.008v-427.99q0-34.005 25.984-59.007T256 342.016h41.984V256q0-88.021 63.019-150.997T512 41.984t150.997 63.019T726.016 256v86.016H768z' fill='%23ffffff'/%3E%3C/svg%3E");
    background-size: 80%;
    margin-right: 2px;
  }
</style>
