<template>
  
  <div class="divider" style="padding: 10px;">
    <!--文本-->
    <div class="c-layer-title">
      <span class="prop-name">语音合成</span>
    </div>
    <div style="padding-left: 15px;">
      <table cellspacing="0" cellpadding="0" style="width: 100%;">
        <tr>
          <td style="width: 8em;">文本</td>
          <td>
            <textarea v-model="text" @change="textChange" name="" placeholder="请输入文本并点击生成相应音频" id="text-textarea" class="scrollbar-overwrite" cols="30" rows="10" style="width: 100%;">
            </textarea>

          </td>
        </tr>
        <tr>
          <td>配音</td>
          <td>
            <select name="" id="" v-model="per" style="background-color:#57595a;color:white;border-radius:2px;">
              <option value="" v-for="item,index in perList" :value="item.value">{{item.name}}</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>语速</td>
          <td>
            <num-resize
              v-model="spd"
              :min="0"
              :max="15"
              :stepScale="0.1"
              :toFixed="0"
              @start="()=>{}"
            >
              <span >
                {{ spd }}
              </span>
            </num-resize>
          </td>
        </tr>
        <tr>
          <td>音调</td>
          <td>
            <num-resize
              v-model="pit"
              :min="0"
              :max="15"
              :stepScale="0.1"
              :toFixed="0"
              @start="()=>{}"
            >
              <span >
                {{ pit }}
              </span>
            </num-resize>
          </td>
        </tr>
        <tr>
          <td></td>
          <td></td>
        </tr>
      </table>
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
      per: 0,
      spd: 5, // 语速
      pit: 5, // 单调
      perList: [
        {
          name: '普通女声',
          value: 0,
        },
        {
          name: '普通男生',
          value: 1,
        },
        {
          name: '度逍遥',
          value: 3,
        },
        {
          name: '度丫丫',
          value: 4,
        },
      ]
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
        this.per = voice.per;
        this.pit = voice.pit;
      }
    },
    // 获取音频
    fetchVoice() {
      this.$store.dispatch('fetchTTSAudio', {
        tex: this.text,
        oldTex: this.textOrigin,
        spd: this.spd,
        per: this.per,
        pit: this.pit,
        callback: (res)=>{
          this.voices.forEach((item, index)=>{
            if(item.tex == res.oldTex) {
              if(res.success) {
                item.tex = res.tex;
                item.data = res.blob;
                item.duration = res.duration;
                item.per = res.per;
                item.spd = res.spd;
                item.pit = res.pit;
              } else {

              }
            }
          })
          // console.log(res);
        }
      })
    }
    
    
  },
  created() {
    
  },
  mounted() {
    // alert('dddd');
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
