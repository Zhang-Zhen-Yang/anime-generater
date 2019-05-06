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
    <!--投影-->
    <div class="c-layer-title">
      <span class="prop-name">投影</span>
    </div>
    <div style="padding-left: 15px;">
      <table cellspacing="0" cellpadding="0" style="width: 100%;">
        <tr>
          <td style="width: 8em;">offsetX</td>
          <td colspan="2">
            <num-resize
              v-model="shadowOffsetX"
              @start="startSetValue"
              @change="initChange({type:'shadowOffsetX',value: shadowOffsetX})">
              <span >
                {{ shadowOffsetX }}
              </span>
            </num-resize>
            <input type="number" v-if="false" v-model="shadowOffsetX" @change="initChange({type:'shadowOffsetX',value: shadowOffsetX})">
          </td>
        </tr>
        <tr>
          <td>offsetY</td>
          <td colspan="2">
            <num-resize
              v-model="shadowOffsetY"
              @start="startSetValue"
              @change="initChange({type:'shadowOffsetY',value: shadowOffsetY})">
              <span >
                {{ shadowOffsetY }}
              </span>
            </num-resize>
            <input type="number" v-if="false" v-model="shadowOffsetY" @change="initChange({type:'shadowOffsetY',value: shadowOffsetY})">
          </td>
        </tr>
        <tr>
          <td>blur</td>
          <td colspan="2">
            <num-resize
              v-model="shadowBlur"
              @start="startSetValue"
              :min="0"
              @change="initChange({type:'shadowBlur',value: shadowBlur})">
              <span >
                {{ shadowBlur }}
              </span>
            </num-resize>
            <input type="number" v-if="false" v-model="shadowBlur" @change="initChange({type:'shadowBlur',value: shadowBlur})">
          </td>
        </tr>
        <tr>
          <td>color</td>
          <td v-if="false">
            <div class="color-dot" :style="{backgroundColor: shadowColor}"></div>&nbsp;
          </td>
          <td colspan="2">
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
    initChange({type, value}){

    },
    update() {
      let {topIndex, subIndex} = this.$store.state.tl; 
      this.$store.dispatch('updateTween', {topIndex, subIndex});
    },
    startSetValue() {
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
