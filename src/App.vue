<template>
  <div id="app" @click="appClick" @dragover="dragover" @drop="drop">
    <block-slice :staticIndex="0" :staticValue="'56px'">
      <!--头部-->
      <topBar slot="s"></topBar>

      <block-slice slot="e" dir="horizontal" :staticIndex="1" :staticValue="settingPanelWidth + 'px'">
        <block-slice slot="e" :staticIndex="1" :staticValue="timelineHeight + 'px'">
          <block-slice slot="e" dir="horizontal" :staticIndex="0" :staticValue="'60px'">
            <div id="left-bar" slot="s" style="background-color: #2C2C2C;height: 100%;">
              left-bar
              <undoredo></undoredo>
            </div>
            <!--工作区-->
            <workSpace slot="e"></workSpace>
          </block-slice>
          <!--时间轴-->
          <div slot="s" style="width: 100%;height: 100%;" id="timeline-wrap" ref="timelineWrap">
            <timeliner></timeliner>
            dfdfdfdf
          </div>
        </block-slice>
        <!--右侧配置面板-->
        <div slot="s" style="" id="options-panel-wrap">
          <settingOptions></settingOptions>
        </div>
      </block-slice>
    </block-slice>
    <dialogGenerate v-if="dialogGenerate.show"></dialogGenerate>
    <dialogImage v-if="dialogImage.show"></dialogImage>
    <dialogDownload v-show="dialogDownload.show"></dialogDownload>
    <dialogLoading v-if="uploading"></dialogLoading>
    <dialogVideoClip v-if="dialogVideoClip.show"></dialogVideoClip>
    <contextMenu></contextMenu>
  </div>
</template>

<script>
import topBar from './components/topBar.vue';
import timeliner from './components/timeliner/timeliner.vue';
import settingOptions from './components/settingOptions/settingOptions.vue';
import workSpace from './components//workSpace.vue';
import dialogImage from './components/dialogImage/dialogImage';
import dialogGenerate from './components/dialogGenerate/dialogGenerate';
import dialogDownload from './components/dialogDownload/dialogDownload';
import dialogLoading from './components/dialogLoading/dialogLoading';
import dialogVideoClip from './components/dialogVideoClip/dialogVideoClip';
import contextMenu from './components/contextMenu';
import undoredo from './components/undoredo.vue';
export default {
  name: 'app',
  components: {
    timeliner,
    settingOptions,
    topBar,
    workSpace,
    dialogGenerate,
    dialogLoading,
    dialogImage,
    dialogDownload,
    dialogVideoClip,
    contextMenu,
    undoredo
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      // 时间轴默认高度
      timelineHeight: 300,
      // 配置面板默认宽度
      settingPanelWidth: 350,
    }
  },
  computed:{
    dialogImage() {
      return this.$store.state.dialogImage;
    },
    dialogGenerate() {
      return this.$store.state.dialogGenerate;
    },
    dialogDownload() {
      return this.$store.state.dialogDownload;
    },
    dialogVideoClip() {
      return this.$store.state.dialogVideoClip;
    },
    // 是否在上传
    uploading() {
      return this.$store.state.dialogDownload.uploading;
    }
  },
  methods: {

    // 全局点击
    appClick(e) {
      // console.log(e.target.className);
    },
    dragover(e) {
       e.preventDefault();
    },
    drop(e) {
      e.preventDefault();
      let files = e.dataTransfer.files;
      if(files.length > 0) {
        // console.log(files[0]);
        let fileName = files[0].name;
        if(fileName.indexOf('.temp') + 5 == fileName.length) {
          let fileReader = new FileReader();
          fileReader.onload = () =>{
            // console.log(fileReader.result);
            this.$store.dispatch('loadLocalTemp', {result: fileReader.result});
            // this.$store.state.project = JSON.parse();
            // this.$store.commit('update');
          }
          fileReader.readAsText(files[0]);
          // alert('ddddd');
        }
      }
      // console.log(e.dataTransfer);
      
    }
  },
  mounted() {
    this.tw = this.$refs.timelinerWrap;
    $(()=>{
      // 时间轴可调整大小
      $('#timeline-wrap').resizable({
        handles: "n",
        minHeight: 150,
        resize: (e, ui) =>{
          let height = ui.size.height;
          this.timelineHeight = height;
        }
      })
      $('#options-panel-wrap').resizable({
        handles: "w",
        minWidth: 100,
        maxWidth: 400,
        // grid: [ 100,],
        resize: (e, ui) =>{
          let width = ui.size.width;
          this.settingPanelWidth = width;
        }
      })
    })
    this.interval = setInterval(()=>{
      if(window.timeline) {
        let position = window.timeline.position;
        this.$store.state.position = position;
        // this.$store.commit('positionChange', {position: timeline.position})
        // console.log(position);
      }
    }, 40);
    document.body.addEventListener('keydown', (e)=>{
      this.$store.dispatch('keydown',{e});
    }, false);
    document.body.addEventListener('keyup', (e)=>{
      this.$store.dispatch('keyup',{e});
    }, false);


    this.$store.dispatch('initnew');

    this.$store.dispatch('convertAudioTest');
  },
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  // margin-top: 60px;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: #efefef;
}
#top-half{
  width: 100%;
  height: 100%;
  background-color: #dddddd;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  // margin: 0 10px;
}

a {
  color: #42b983;
}
#timeline-wrap{
  // border-top: 1px solid red;
}
#timeline-wrap .ui-resizable-n{
  width: 200%!important;
  left: 0;
  top: -5px;
  border-radius: 0;
  opacity: 0;
}

#options-panel-wrap{
  background-color:#F0F8FF;
  height:100%;
  border-left: 1px solid #181818;
  background-color: #2c2e2f;
  color: rgba(255, 255, 255, 1);
}
#options-panel-wrap .ui-resizable-w{
  height: 100%;
  top: 0;
  border-radius: 0;
  opacity: 0;
  transform: none;
  left: 2px;
  width: 10px;
}
</style>
