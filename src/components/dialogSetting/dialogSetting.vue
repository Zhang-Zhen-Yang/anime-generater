/*
 * @Author: zhangzhenyang 
 * @Date: 2019-02-10 16:43:16 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-06-05 09:14:40
 */

<template>
  <modal-dialog
    @dismiss="dismiss"
    @confirm="dismiss"
    :sty="`width: 500px;height:${ convertVer ==2 ? 380 : 340 }px`"
    :showFooter="false"
    title="设置">
    <div class="dialog-setting-content-wrap" slot="content" >
      <div class="dialog-setting-content scrollbar-overwrite">
        <div style="">
          <div>
            视频质量
          </div>
          <div class="relative" style="padding-top: 32px;">
            <vue-slider
              v-model="quality"
              :min="1"
              :max="100"
              :interval="1"
              :piecewise="false"
              :processStyle="{backgroundColor: '#1284e7'}"
              :sliderStyle="{backgroundColor: '#1284e7'}"
              :speed="0"></vue-slider>
          </div>
          <p></p>
          <div>
            帧数
          </div>
          <div style="padding-top: 32px;">
            <vue-slider
                v-model="frames"
                :min="1"
                :max="25"
                :interval="1"
                :piecewise="false"
                :processStyle="{backgroundColor: '#1284e7'}"
                :sliderStyle="{backgroundColor: '#1284e7'}"
                :speed="0"></vue-slider>
          </div>
          <template v-if="convertVer == 2">
            <div>
              mp4编码
            </div>
            <p></p>
            <div>
              <label class="radioWrap">
                <input type="radio" name="encoder" value="mpeg4" v-model="encoder">
                <div class="radio sm"></div>
                <span>MPEG4</span>
              </label>
              &emsp;
              <label class="radioWrap">
                <input type="radio" name="encoder" value="H.264" v-model="encoder">
                <div class="radio sm"></div>
                <span>H.264(慢)</span>
              </label>
            </div>
            <p></p>
          </template>
          <p></p>
          <div>
            <span>图片帧质量:</span> <input class="setting-input" ref="imageQuality" v-model="imageQuality" type="number" min="1" max="100" value="90">
            &emsp;
            <span>内存分配:</span> <input class="setting-input" ref="totalMemory" v-model="totalMemory" type="number" min="10" max="512" value="128">
          </div>
        </div>

      </div>
    </div>


    <!--footer-->
    <table slot="footer">
      <tr>
        <td class="left">
        </td>
        <td>
        </td>
        <td class="right">
          <button class="btn white" @click="dismiss(false)">取消</button>
          <button v-if="false" class="btn primary" @click="confirm(true)">确定</button>
        </td>
      </tr>
    </table>
  </modal-dialog>
</template>

<script>
import VueSlideBar from 'vue-slide-bar';
import vueSlider from 'vue-slider-component';
export default {
  name: 'dialog-setting',
  components: { VueSlideBar, vueSlider },
  data () {
    return {
    
    }
  },
  computed: {
    convertVer() {
      return this.$store.state.convertVer;
    },
    modal(){
      return this.$store.state.dialogSetting;
    },
    quality : {
      get() {
        return this.modal.quality;   
      },
      set(val) {
        this.modal.quality = val;
        localStorage.setItem('setting-quality', val);
      },
      
    },
    encoder: {
      get() {
        return this.modal.encoder;   
      },
      set(val) {
        this.modal.encoder = val;
        localStorage.setItem('setting-encoder', val);
      },
    },
    frames: {
      get() {
        return this.modal.frames;  
      },
      set(val) {
        this.modal.frames = val;
        localStorage.setItem('setting-frames', val);
      }
    },
    // 图片获取质量
    imageQuality: {
      get() {
        return this.modal.imageQuality;  
      },
      set(val) {
        this.modal.imageQuality = val;
        localStorage.setItem('setting-imageQuality', val);
      }
    },
    // 内存分配
    totalMemory: {
      get() {
        return this.modal.totalMemory;  
      },
      set(val) {
        if(val < 10) {
          this.$nextTick(()=>{
            this.modal.totalMemory = 10;
            localStorage.setItem('setting-totalMemory', 10);
          })
        } else if(val > 512) {
          this.modal.totalMemory = 512;
          localStorage.setItem('setting-totalMemory', 512);
        } else {
          this.modal.totalMemory = val;
          localStorage.setItem('setting-totalMemory', val);
        }
      }
    },

  },
  methods: {
    dismiss(){
      this.modal.show = false;
    },
    confirm() {
      alert('yes');
    },



  },
  created() {
    
  }
}
</script>

<style lang="scss">
  .dialog-setting-content-wrap{
    padding: 50px 0 50px 0;
    height: 100%;
    font-size: 14px;
  }
  .dialog-setting-content{
    height: 100%;
    overflow: auto;
    text-align: left;
    padding: 20px;
    padding-bottom: 0;
  }
  
  .modal-setting-footer{
    background-color: white;
  }
 
</style>
