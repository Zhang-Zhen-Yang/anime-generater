<template>
  <div class="voice-play-block">
    <audio :src="src" ref="audio" @ended="ended"></audio>
    {{ position }}
  </div>
</template>

<script>
export default {
  name: 'voice-play-block',
  props: {
    item: {
      type: Object,
      default() {
        return {
          data: '',
          duration: '',
        }
      }
    }
  },
  data () {
    return {
      msg: 'voice-play-block',

    }
  },
  computed: {
    playing() {
      return this.$store.state.playing;
    },
    position() {
      return this.$store.state.position;
    },
    src() {
      let audioData = this.item.data;
      if(audioData) {
        let blob = new Blob([audioData], {
            type: 'audio/wav'
        });
        return window.URL.createObjectURL(blob);

      } else {
        return '';
      }
    }
  },
  methods: {
    setAudio() {

    },
    ended() {
      this.audio.currentTime = 0;
    }
  },
  created() {
    
  },
  mounted() {
    this.setAudio();
    this.audio = this.$refs.audio;
  },
  watch: {
    item: {
      deep: true,
      handler(nval) {
        this.setAudio();
      }
    },
    position(nval, oval) {
      // 如果正在播放
      if(this.playing) {
        if( (nval >=  this.item.time)  && (nval <= (this.item.time + this.item.duration*1000)) ) {
          if(this.audio ) {
            if(this.audio.paused){
              this.audio.play();
            } else {
              // this.audio.pause();
            }
          } 
        } else {
          if(this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
          } 
        }
      } else {

      }
    }

  }
}
</script>

<style lang="scss">
  #temp{
    
  }
</style>
