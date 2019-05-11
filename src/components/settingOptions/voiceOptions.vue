<template>
  
  <div>
    <div class="divider" style="padding: 10px;">
      <!--文本-->
      <div class="c-layer-title">
        <span class="prop-name">语音合成</span>
      </div>
      <div style="padding-left: 15px;">
        <table cellspacing="0" cellpadding="0" style="width: 100%;">
          <tr>
            <td class="width1-4">文本</td>
            <td class="relative">
              <textarea
                v-model="text"
                @change="textChange"
                name=""
                placeholder="请输入文本并点击生成相应音频"
                id="text-textarea"
                class="scrollbar-overwrite"
                cols="30"
                rows="10"
                maxlength="10"
                style="width: 100%;">
              </textarea>
              <div class="absolute" style="right: 10px;bottom: 10px;">{{text.length}}/50</div>
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
    <div class="divider" style="padding: 10px;">
      <div class="c-layer-title">
        <span class="prop-name">字幕</span>
        <div style="float:right">
          <checkbox v-model="setToAll">&nbsp;全局设置</checkbox>
        </div>
      </div>
      <div style="padding-left: 15px;">
        <table cellspacing="0" cellpadding="0" style="width: 100%;">
          <!--show-->
          <tr>
            <td class="width1-4">show</td>
            <td class="relative">
              <checkbox v-model="showSubtitle"></checkbox>
            </td>
          </tr>
          <!--fontSize-->
          <tr>
            <td class="width1-4">fontSize</td>
            <td class="relative">
              <num-resize
                v-model="fontSize"
                :min="0"
                :max="100"
                :stepScale="1"
                :toFixed="0"
                @start="()=>{}"
              >
                <span >
                  {{ fontSize }}
                </span>
              </num-resize>
            </td>
          </tr>
          <!--color-->
          <tr>
            <td class="width1-4">color</td>
            <td class="relative">
              <color-picker title="颜色" v-model="color" :showTitle="false" @start="()=>{}">
              </color-picker>

            </td>
          </tr>
          <!--font-->
          <tr>
            <td class="width1-4">font</td>
            <td class="relative">
              <select name="" id="" v-model="fontFamily" style="background-color:#57595a;color:white;border-radius:2px;">
                <option value="" v-for="item,index in fontsList" :value="item.value">{{item.name}}</option>
              </select>
            </td>
          </tr>
          <!--outline-->
          <tr>
            <td class="width1-4">outline</td>
            <td class="relative">
              <num-resize
                v-model="outline"
                :min="0"
                :max="100"
                :stepScale="1"
                :toFixed="0"
                @start="()=>{}"
              >
                <span >
                  {{ outline }}
                </span>
              </num-resize>
            </td>
          </tr>
          <!--outlineColor-->
          <tr>
            <td class="width1-4">outlineColor</td>
            <td class="relative">
              <color-picker title="颜色" v-model="outlineColor" :showTitle="false" @start="()=>{}">
              </color-picker>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../../script/util';
import utilTimeline from '../../script/utilTimeline';
import fontsList from '../../script/fontsList';

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
      ],
      // 全局设置
      // setToAll: false,
    }
  },
  computed: {
    setToAll:{
      get() {
        return this.$store.state.dialogVoice.subtitleSetToAll;
      },
      set(val) {
        this.$store.state.dialogVoice.subtitleSetToAll = val;
      }
    },
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
    },
    cVoice() {
      return this.voices[this.voiceIndex];
    },
    showSubtitle: {
      get() {
        return this.cVoice.showSubtitle;
      },
      set(val) {
        this.setValue({prop:'showSubtitle', value: val});
        this.$store.dispatch('renderSubtitle');
      }
    },
    // 字幕字体大小
    fontSize:{
      get() {
        return this.cVoice.fontSize;
      },
      set(val){
        this.setValue({prop:'fontSize', value: val});
        /*if(this.setToAll) {
          this.voices.forEach((item, index)=>{
            item.fontSize = val;
          })
        } else {
          this.cVoice.fontSize = val;
        }*/
        this.$store.dispatch('renderSubtitle');
      }
    },
    // 文本颜色
    color:{
      get() {
        return this.cVoice.color;
      },
      set(val) {
        this.setValue({prop:'color', value: val});
        /* if(this.setToAll) {
          this.voices.forEach((item, index)=>{
            item.color = val;
          })
        } else {
          this.cVoice.color = val;
        }*/
        this.$store.dispatch('renderSubtitle');
      }
    },
    // 字体列表
    fontsList() {
      return fontsList;
    },
    // 字体
    fontFamily: {
      get() {
        return this.cVoice.fontFamily;
      },
      set(val) {
        this.setValue({prop:'fontFamily', value: val})
        
        this.$store.dispatch('loadFont', {
          fontFamily: val,
          callback: ()=>{
            this.$store.dispatch('renderSubtitle');
          }
        })
      }
    },
    // 描边
    outline:{
      get() {
        return this.cVoice.outline;
      },
      set(val) {
        this.setValue({prop: 'outline', value: val});
        this.$store.dispatch('renderSubtitle');
      }
    },
    // 描边颜色
    outlineColor:{
      get() {
        return this.cVoice.outlineColor;
      },
      set(val) {
        this.setValue({prop: 'outlineColor', value: val});
        this.$store.dispatch('renderSubtitle');
      }
    },

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
        this.spd = voice.spd;
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
    },
    setValue({prop, value}) {
      if(this.setToAll) {
          this.voices.forEach((item, index)=>{
            item[prop] = value;
          })
        } else {
          this.cVoice[prop] = value;
        }
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
