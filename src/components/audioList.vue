<template>
  <transition name="audio-list-fade">
    <div class="audio-list" v-show="show">
      <block-slice slot="e" dir="vertical" :staticIndex="0" :staticValue="65 + 'px'">
        <div slot="s" class="audio-list-title divider">
          <voicePlayBlock :item="bgMusicItem"></voicePlayBlock>
          <block-slice slot="e" dir="horizonal" :staticIndex="1" :staticValue="60 + 'px'">
            <div slot="e" style="padding:2px 5px;">
              <div style="height: 40px;overflow: hidden;">
                {{ bgMusicName || '无音乐' }}
              </div>
              <div style="font-size: 12px;margin-top:5px;">
                <span class="clear-audio pointer" @click="clearAudio">清除</span>&emsp;
                <label class="load-local-audio pointer">本地音乐<file-input :accept="'.wav,.mp3'" @change="localFileChange"></file-input></label>
              </div>
            </div>
            <div slot="s"></div>
          </block-slice>
        </div>
        <div slot="e" class="audio-list-content scrollbar-overwrite">
          <div v-for="item, index in audioList" class="audio-list-item" >
            <div style="position:relative;">
              <span class="audio-title-index">{{index < 10 ? `0${index}` : index}}.&nbsp;</span>
              <span class="pointer" @click="fetchBgMusic(item)">
                {{ item.name }}
              </span>
            </div>
          </div>
        </div>
      </block-slice>
    </div>
  </transition>
</template>

<script>
import voicePlayBlock from './timeliner/voicePlayBlock.vue';
export default {
  name: 'audio-list',
  components: {voicePlayBlock},
  data () {
    return {
      msg: 'audio-list'
    }
  },
  computed: {
    // 背景音乐
    bgMusicItem() {
      return {
        data: this.$store.state.bgMusic,
        time: 0,
        duration: 0,
      }
    },
    bgMusicName() {
      return this.$store.state.bgMusicName;
    },
    dialogAudio() {
      return this.$store.state.dialogAudio;
    },
    audioList() {
      return this.dialogAudio.audioList;
    },
    show() {
      return this.dialogAudio.show;
    }
  },
  methods: {
    fetchBgMusic(item){
      this.$store.dispatch('fetchBgMusic',{item});
    },
    clearAudio() {
      this.$store.state.bgMusicName = '';
      this.$store.state.bgMusic = '';
    },
    localFileChange(e) {
      console.log(e);
      let file = e.file
      let name = file.name;
      console.log(name);
      this.$store.state.bgMusicName = name;
      this.$store.state.bgMusic = file;
    }
  },
  created() {
    
  },
}
</script>

<style lang="scss">
  .audio-list{
    position: absolute;
    width: 300px;
    max-width: 100%;
    height: 100%;
    right: 0;
    top: 0;
    // background-color: rgba(0,0,0,0.2);
    background-color: #2c2e2f;
    .clear-audio{

    }
    .load-local-audio{
      input{
        display: none;
      }
    }
  }
  .audio-list-title{
    height: 100%;
    color: white;
    font-size: 14px;
    text-align: left;
  }
  .audio-list-content{
    width: 100%;
    height: 100%;
    text-align: left;
    font-size: 14px;
    color:white;
    overflow: auto;
  }
  .audio-list-item{
    padding: 2px 5px;
    padding-left: 28px;
    position: relative;
    height: 40px;
    overflow: hidden;
  }
  .audio-title-index{
    position: absolute;
    right : 100%;
  }
    
  .audio-list-fade-enter-active,.audio-list-fade-leave-active{
    transition: opacity .1s ease-in;
  }
  .audio-list-fade-enter, .audio-list-fade-leave-active {
    opacity: 0;
  }
</style>
