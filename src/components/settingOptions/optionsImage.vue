<template>
  <div>
    <!--图片-->
    <div class="c-layer-title">
      <span class="prop-name">图片</span>
    </div>
    <div style="padding-left: 15px;">
      <mask-replace
        :text="'选择图片'"
        :showImageUpload="true"
        @select="imageSelect"
        @change="imageChange(0, $event)"
      >
        <img v-if="cLayer && cLayer.type=='image'" :src="cLayer.pic_url" alt="" style="max-width: 100%;">
      </mask-replace>
    </div>
    <!--色彩调节-->
    <div class="c-layer-title">
      <span class="prop-name">色彩调节</span>
    </div>
    <div style="padding-left: 15px;">
      <table cellspacing="0" cellpadding="0" style="width: 100%;">
        <tr>
          <td class="width1-4">亮度</td>
          <td class="width1-4">
            <num-resize
              v-model="brightness"
              :min="-255"
              :max="255"
              @start="startSetValue"
              @change="initChange({type:'brightness',value: brightness, updateColorMatrix: true})">
              <span >
                {{ brightness }}
              </span>
            </num-resize>
          </td>
          <td class="width1-4">
            对比度
          </td>
          <td>
            <num-resize
              v-model="contrast"
              :min="-100"
              :max="100"
              @start="startSetValue"
              @change="initChange({type:'contrast',value: contrast, updateColorMatrix: true})">
              <span >
                {{ contrast }}
              </span>
            </num-resize>
          </td>
        </tr>
        <tr>
          <td class="width1-4">色相</td>
          <td>
            <num-resize
              v-model="hue"
              :min="-180"
              :max="180"
              @start="startSetValue"
              @change="initChange({type:'hue',value: hue, updateColorMatrix: true})">
              <span >
                {{ hue }}
              </span>
            </num-resize>
          </td>
          <td>
            饱合度
          </td>
          <td>
            <num-resize
              v-model="saturation"
              :min="-100"
              :max="100"
              @start="startSetValue"
              @change="initChange({type:'saturation',value: saturation, updateColorMatrix: true})">
              <span >
                {{ saturation }}
              </span>
            </num-resize>
          </td>
        </tr>
      </table>
    </div>

    <!--模糊-->
    <div class="c-layer-title">
      <span class="prop-name">模糊</span>
    </div>
    <div style="padding-left: 15px;">
      <table cellspacing="0" cellpadding="0" style="width: 100%;">
        <tr>
          <td class="width1-4">blur</td>
          <td>
            <num-resize
              v-model="blur"
              :min="0"
              :max="100"
              @start="startSetValue"
              @change="initChange({type:'blur',value: blur, updateColorMatrix: true})">
              <span >
                {{ blur }}
              </span>
            </num-resize>
          </td>
          <td></td>
          <td></td>
        </tr>
      </table>
    </div>
    <!--投影-->
    <div class="c-layer-title">
      <span class="prop-name">投影</span>
    </div>
    <div style="padding-left: 15px;">
      <table cellspacing="0" cellpadding="0" style="width: 100%;">
        <tr>
          <td class="width1-4">offsetX</td>
          <td class="width1-4">
            <num-resize
              v-model="shadowOffsetX"
              @start="startSetValue"
              @change="initChange({type:'shadowOffsetX',value: shadowOffsetX})">
              <span >
                {{ shadowOffsetX }}
              </span>
            </num-resize>
          </td>
          <td class="width1-4">
            offsetY
          </td>
          <td>
            <num-resize
              v-model="shadowOffsetY"
              @start="startSetValue"
              @change="initChange({type:'shadowOffsetY',value: shadowOffsetY})">
              <span >
                {{ shadowOffsetY }}
              </span>
            </num-resize>
          </td>
        </tr>
        <tr>
          <td>blur</td>
          <td colspan="3">
            <num-resize
              v-model="shadowBlur"
              @start="startSetValue"
              :min="0"
              @change="initChange({type:'shadowBlur',value: shadowBlur})">
              <span >
                {{ shadowBlur }}
              </span>
            </num-resize>
          </td>
        </tr>
        <tr>
          <td>color</td>
          <td v-if="false">
            <div class="color-dot" :style="{backgroundColor: shadowColor}"></div>&nbsp;
          </td>
          <td colspan="3">
            <color-picker title="颜色" v-model="shadowColor" :showTitle="false" @start="startSetValue"></color-picker>
          </td>
        </tr>
      </table>
      <table cellspacing="0" cellpadding="0" style="width: 100%;">
        <tr>
          <td>
              <checkbox v-model="fillBefore">
                &nbsp;缓动前显示
              </checkbox>
              
          </td>
          <td>
            <checkbox v-model="fillAfter">
              &nbsp;缓动后显示
            </checkbox>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'optionsImage',
  props: {
    cLayer: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data () {
    return {
      msg: 'optionsImage'
    }
  },
  computed: {
    // 投影 x轴偏移
    shadowOffsetX: {
      get(){
        return this.cLayer.shadowOffsetX;
      },
      set(val) {
        this.cLayer.shadowOffsetX = val;
        this.cLayer.obj.shadow.offsetX = val;
      }
    },
    // 投影 y轴偏移
    shadowOffsetY: {
      get(){
        return this.cLayer.shadowOffsetY;
      },
      set(val) {
        this.cLayer.shadowOffsetY = val;
        this.cLayer.obj.shadow.offsetY = val;
      }
    },
    // 投影 模糊半径
    shadowBlur: {
      get(){
        return this.cLayer.shadowBlur;
      },
      set(val) {
        this.cLayer.shadowBlur = val;
        this.cLayer.obj.shadow.blur = val;
      }
    },
    // 投影 颜色
    shadowColor: {
      get(){
        return this.cLayer.shadowColor;
      },
      set(val) {
        this.cLayer.shadowColor = val;
        this.cLayer.obj.shadow.color = val;
      }
    },
    // 缓动前显示
    fillBefore: {
      get() {
        return this.cLayer.fillBefore;
      },
      set(val) {
        this.as();
        this.cLayer.fillBefore = val;
        this.update();
        // let currentPosition = window.timeline.position;
        // window.timeline.position = 0;
        // window.timeline.position = currentPosition;
      }
    },
    // 缓动后显示
    fillAfter: {
      get() {
        return this.cLayer.fillAfter;
      },
      set(val) {
        this.as();
        this.cLayer.fillAfter = val;
        this.update();
      }
    },
    // 亮度
    brightness: {
      get() {
        return this.cLayer.brightness;
      },
      set(val) {
        // this.as();
        this.cLayer.brightness = val;
        this.update(true, 'color');
      }
    },
    // 对比度
    contrast: {
      get() {
        return this.cLayer.contrast;
      },
      set(val) {
        // this.as();
        this.cLayer.contrast = val;
        this.update(true, 'color');
      }
    },
    // 饱和度
    saturation: {
      get() {
        return this.cLayer.saturation;
      },
      set(val) {
        // this.as();
        this.cLayer.saturation = val;
        this.update(true, 'color');
      }
    },
    // 色调
    hue: {
      get() {
        return this.cLayer.hue;
      },
      set(val) {
        // this.as();
        this.cLayer.hue = val;
        this.update(true, 'color');
      }
    },
    // 模糊
    blur: {
      get() {
        return this.cLayer.blur;
      },
      set(val) {
        // this.as();
        this.cLayer.blur = val;
        this.update(true, 'blur');
      }
    },
  },
  methods: {
        // 添加历史记录
    as() {
      this.$store.dispatch('addStep');
    },
    // 选择图片
    imageSelect() {
      this.$store.state.dialogImage.selectedPic = this.cLayer.pic_url.indexOf('data:image/') < 0 ? this.cLayer.pic_url : '';
      this.$store.state.dialogImage.itemData = this.cLayer;
      this.$store.state.dialogImage.show = true;
      this.$store.state.dialogImage.key = 'pic_url';
      this.$store.state.dialogImage.callback = (pic_url)=>{
        // alert(pic_url);
        this.$store.dispatch('imageChange', {img: pic_url});
      }
      // this.$store.dispatch('imageChange', {img});
    },
    // 选择图片，本地
    imageChange(type, e) {
      let file = new FileReader();
      file.readAsDataURL(e.file);
      file.onload = () => {
        // alert('ddd');
        let img = file.result;
        /* this.project.bgImage = file.result;
        this.$store.commit('update');*/
        // console.log(file.result);
        this.$store.dispatch('imageChange', {img});
      }
    },
    initChange({type, value, updateColorMatrix = false}){
      if(updateColorMatrix) {
        this.updateColorMatrix();
      }
    },
    updateColorMatrix() {
      let colorMatrix = new createjs.ColorMatrix(
        this.brightness || 0,
        this.contrast || 0,
        this.saturation || 0,
        this.hue || 0,
      );
      let colorMatrixFilter = new createjs.ColorMatrixFilter(colorMatrix);

      this.cLayer.obj.filters[0] = colorMatrixFilter;
      this.cLayer.obj.updateCache();
    },
    updateBlur() {
      let blurFilter = new createjs.BlurFilter(this.blur, this.blur, 2);
      this.cLayer.obj.filters[1] = blurFilter;
      this.cLayer.obj.updateCache();
    },
    update(throttle, type) {
      let {topIndex, subIndex} = this.$store.state.tl; 
      this.$store.dispatch('updateTween', {topIndex, subIndex});
      if(throttle) {
        let curTime = Date.now();
        if(curTime - this.lastTime > 200) {
          this.lastTime = curTime;
          if(type == 'color') {
            this.updateColorMatrix();
          } else if(type == 'blur'){
            this.updateBlur();
          }
        }
      }

    },
    startSetValue() {
      this.lastTime = Date.now();
      // alert('dd');
      this.as();
      this.$store.dispatch('startSetValue');
    },
  },
  created() {
    
  },
}
</script>

<style lang="scss">

</style>
