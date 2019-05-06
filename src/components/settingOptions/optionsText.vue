<template>
  <div>
    <!--文本-->
    <div class="c-layer-title">
      <span class="prop-name">文本</span>
    </div>
    <div style="padding-left: 15px;">
      <textarea v-model="text" @change="textChange" name="" id="text-textarea" class="scrollbar-overwrite" cols="30" rows="7" style="width: 100%;">
      </textarea>
    </div>
    <!--文本颜色-->
    <!--<div class="c-layer-title">
      <span>颜色</span>
    </div>-->
    <div class="c-layer-title">
      <span class="prop-name">颜色</span>
    </div>
    <div style="padding-left: 15px;">
      <color-picker title="颜色" v-model="color" :showTitle="false" @start="startSetValue">
      </color-picker>
    </div>
    <!--字体-->
    <div class="c-layer-title">
      <span class="prop-name">字体</span>
    </div>
    <div style="padding-left: 15px;">
      <select name="" id="" v-model="fontFamily" style="background-color:#57595a;color:white;border-radius:2px;">
        <option value="" v-for="item,index in fontsList" :value="item.value">{{item.name}}</option>
      </select>
    </div>
    <!--描边---------------------------------------------------------------->
    <div class="c-layer-title">
      <span class="prop-name">描边</span>
    </div>
    <div style="padding-left: 15px;">
      <!--形状属性 多边形-->
      <table cellspacing="0" cellpadding="0" style="width:100%;">
        <!--边宽-->
        <tr>
          <td style="width: 8em;">
            <span class="prop-name-x">边宽</span>
          </td>
          <td>
            <num-resize
              v-model="outline"
              :min="0"
              :max="100"
              @start="()=>{as();}"
            >
              <span >
                {{ outline }}
              </span>
            </num-resize>
          </td>
        </tr>
        <!--描边颜色-->
        <tr>
          <td style="width: 8em;">
            <span class="prop-name-x">描边颜色</span>
          </td>
          <td>
            <color-picker title="颜色" v-model="outlineColor" :showTitle="false" @start="startSetValue">
            </color-picker>
          </td>
        </tr>
      </table>
      
    </div>
    <!--投影------------------------------------------------------------------------->
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
import fontsList from '../../script/fontsList';
export default {
  name: 'optionsText',
  props: {
    cLayer: {
      type: Object,
      default() {
        return {};
      }
    },
    target: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data () {
    return {
      msg: 'optionsText'
    }
  },
  computed: {
    fontsList() {
      return fontsList;
    },
    // 文本类型层，的文本
    text:{
      get() {
        return this.cLayer.text;
      },
      set(val) {
        this.as();
        this.cLayer.text = val;
        // console.log(this.target);
        this.target.children.forEach((item)=>{
          /* this.target.text = val;
          */
          item.text = val;
        })
        let fontFamily = this.cLayer.fontFamily;
        this.$store.dispatch('loadFont', {fontFamily, text: val });
      }
    },
    // 文本颜色
    color: {
      get() {
        return this.cLayer.color;
      },
      set(val) {
        this.cLayer.color = val;
        this.target.children[1].color = val;
        // this.target.color = val;
      }
    },
    // 字体
    fontFamily: {
      get() {
        return this.cLayer.fontFamily;
      },
      set(val) {
        console.log(this.target);
        this.target.children.forEach((item)=>{
          item.font =`normal 100px ${val}`;
        })
        this.cLayer.fontFamily = val;
        this.$store.dispatch('loadFont', {fontFamily: val, text: this.target.children[0].text});
      }
    },
    outline: {
      get() {
        return this.cLayer.outline || 0;
      },
      set(val) {
        this.target.children[0].outline = val;
        if(val <= 0) {
          this.target.children[0].set({
            visible: false
          })
        } else {
          this.target.children[0].set({
            visible: true
          })
        }
        this.cLayer.outline = val;
      }
    },
    outlineColor: {
      get() {
        return this.cLayer.outlineColor;
      },
      set(val) {
        this.target.children[0].color = val;
        this.cLayer.outlineColor = val;
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
  },
  methods: {
    // 添加历史记录
    as() {
      this.$store.dispatch('addStep');
    },
    textChange(e){
      console.log(e);
    },
    // 属性开始调整，设置时间轴指针的位置
    startSetValue() {
      // alert('dd');
      this.as();
      this.$store.dispatch('startSetValue');
    },
    update() {
      let {topIndex, subIndex} = this.$store.state.tl; 
      this.$store.dispatch('updateTween', {topIndex, subIndex});
    },
    initChange({type, value}){

    },
  },
  created() {
    
  },
}
</script>

<style lang="scss">
  #temp{
    
  }
</style>
