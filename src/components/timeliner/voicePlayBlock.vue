<template>
  <div class="voice-play-block">
    <audio :src="src" ref="audio" @ended="ended" @loadedmetadata="loadedmetadata"></audio>
    {{ /*position*/ }}
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
          time: 0,
        }
      }
    }
  },
  data () {
    return {
      msg: 'voice-play-block',
      duration: 0,
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
    loadedmetadata() {
      this.duration = this.audio.duration
      // console.log(this.audio.duration);
    },
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
      if(!this.src) {
        return 
      }
      // 如果正在播放
      if(this.playing) {
        if( (nval >=  this.item.time)  && (nval <= (this.item.time + this.duration*1000)) ) {
          if(this.audio ) {
            if(this.audio.paused){
              this.audio.play();
            } else {
              // this.audio.pause();
            }
          }
          if(Math.abs(this.audio.currentTime * 1000 + this.item.time - nval) > 100) {
            this.audio.currentTime = (nval - this.item.time) / 1000;
          }
        } else {
          if(this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
          } 
        }
        
      } else {

      }
    },
    playing(nval, oval) {
      console.log(nval);
      if(!nval) {
        this.audio.pause();
      }
    }

  }
}
</script>

<style lang="scss">
  #temp{
    
  }
</style>
