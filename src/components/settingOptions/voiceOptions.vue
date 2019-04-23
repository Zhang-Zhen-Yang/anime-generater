<template>
  
      <div class="divider" style="padding: 10px;">
        <!--文本-->
        <div class="c-layer-title">
          <span class="prop-name">文本</span>
        </div>
        <div style="padding-left: 15px;">
          <textarea v-model="text" @change="textChange" name="" id="text-textarea" class="scrollbar-overwrite" cols="30" rows="10" style="width: 100%;">
          </textarea>
          <table style="width: 100%;" cellspacing="0" cellpadding="0">
            <tr>
              <td style="text-align:right;">
                <button class="btn primary" @click="fetchVoice">生成</button>
              </td>
            </tr>
          </table>
        </div>

      </div>
   
</template>

<script>
import util from '../../script/util';
import utilTimeline from '../../script/utilTimeline';


export default {
  name: 'voice-options',
  components: {},
  data () {
    return {
      msg: 'setting-options',
      target: null,
      textOrigin: '',
      text: 'dddddd',
    }
  },
  computed: {
    project() {
      return this.$store.state.project;
    },
    tl() {
      return this.$store.state.tl;
    },
    voices() {
      return this.project.voices;
    },
    voiceIndex() {
      return this.tl.voiceIndex;
    }
   
  },
  methods: {
   
    textChange(e){
      console.log(e);
    },
    setLocalValue() {
      if(this.voices[this.voiceIndex]) {
        let voice = this.voices[this.voiceIndex];
        this.text = voice.tex;
        this.textOrigin = voice.tex;
      }
    },
    // 获取音频
    fetchVoice() {
      this.$store.dispatch('fetchTTSAudio', {
        tex: this.text,
        oldTex: this.textOrigin,
        callback: (res)=>{
          this.voices.forEach((item, index)=>{
            if(item.tex == res.oldTex) {
              if(res.success) {
                item.tex = res.tex;
                item.data = res.blob;
                item.duration = res.duration;
              } else {

              }
            }
          })
          console.log(res);
        }
      })
    }
    
    
  },
  created() {
    
  },
  mounted() {
    alert('dddd');
    this.setLocalValue();
  },
  watch: {
    voiceIndex(nval, oval){
      this.setLocalValue();
    },
    voices: {
      deep: true,
      handler() {
        this.setLocalValue();
      }
    }
  }
}
</script>

<style lang="scss">
  
  
</style>
