<template>
  <block-slice slot="e" dir="vertical" :staticIndex="0" :staticValue="35 + 'px'">
    <div id="setting-options-title" slot="s">
      设置
    </div>
    <div id="setting-options-content" slot="e">
      <!--{{ cLayer.type }}-->

      <!--图片类型-->
      <template v-if="cLayer.type=='image'">
        <!--图片-->
        <div class="c-layer-title">
          <span class="prop-name">图片</span>
        </div>
        <div style="padding-left: 15px;">
          <mask-replace
            :text="'选择图片'"
            :showImageUpload="true"
            @select="bgImageSelect"
            @change="imageChange(0, $event)"
          >
            <img v-if="cLayer.type=='image'" :src="cLayer.pic_url" alt="" style="max-width: 100%;">
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
                <color-picker title="颜色" v-model="shadowColor" :showTitle="false"></color-picker>
              </td>
            </tr>
          </table>
        </div>

      </template>


      <!--文本类型-->
      <template v-if="cLayer.type=='text'">
        <!--文本-->
        <div class="c-layer-title">
          <span class="prop-name">文本</span>
        </div>
        <div style="padding-left: 15px;">
          <textarea v-model="text" @change="textChange" name="" id="text-textarea" class="scrollbar-overwrite" cols="30" rows="10" style="width: 100%;">
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
          <color-picker title="颜色" v-model="color" :showTitle="false">
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

      </template>

      <template v-if="currentTween&&hasProps&&cLayer.type">
      <!--节点-->
      <div class="c-layer-title">
        <span class="prop-name">节点</span>
      </div>
      <div style="padding-left: 15px;">

        <!--节点的属性值-->
        <table cellspacing="0" cellpadding="0" style="width:100%;">
          <tr>
            <td style="width: 8em;">
              <span class="prop-name-x">缓动</span>
            </td>
            <td>
              <select name="" id="" v-model="ease" style="background-color:#57595a;color:white;border-radius:2px;">
                <option value="" v-for="item,index in eases" :value="item.value">{{ item.name }}</option>
              </select>
            </td>
          </tr>
          <!--x-->
          <tr>
            <td>
              <span class="prop-name-x">x</span>
            </td>
            <td>
              <num-resize
                v-model="x"
                @start="startSetValue"
                @change="change({type:'x',value: x})">
                <span >
                  {{ x }}
                </span>
              </num-resize>
              <input type="number" v-if="false" v-model="x" @change="change({type:'x',value: x})">
            </td>
          </tr>
          <!--y-->
          <tr>
            <td>
              <span class="prop-name-x">y</span>
            </td>
            <td>
              <num-resize
                v-model="y"
                @start="startSetValue"
                @change="change({type:'y',value: y})">
                <span>
                  {{ y }}
                </span>
              </num-resize>
            </td>
          </tr>
          <!--scaleX-->
          <tr>
            <td>
              <span class="prop-name-x">scaleX</span>
            </td>
            <td>
              <num-resize
                v-model="scaleX"
                :stepScale="0.01"
                @start="startSetValue"
                @change="change({type:'scaleX',value: scaleX})">
                <span>
                  {{ scaleX }}
                </span>
              </num-resize>
            </td>
          </tr>
          <!--scaleY-->
          <tr>
            <td>
              <span class="prop-name-x">scaleY</span>
            </td>
            <td>
              <num-resize
                v-model="scaleY"
                :stepScale="0.01"
                @start="startSetValue"
                @change="change({type:'scaleY',value: scaleY})">
                <span>
                  {{ scaleY }}
                </span>
              </num-resize>
            </td>
          </tr>
          <!--rotation-->
          <tr>
            <td>
              <span class="prop-name-x">
                rotation
              </span>
            </td>
            <td>
              <num-resize
                v-model="rotation"
                :stepScale="1"
                @start="startSetValue"
                @change="change({type:'rotation',value: rotation})">
                <span>
                  {{ rotation }}
                </span>
              </num-resize>
            </td>
          </tr>
          <!--alpha-->
          <tr>
            <td>
              <span  class="prop-name-x">
                alpha
              </span>
            </td>
            <td>
              <num-resize
                v-model="alpha"
                :stepScale="0.01"
                :max="1"
                :min="0"
                @start="startSetValue"
                @change="change({type:'alpha',value: alpha})">
                <span>
                  {{ alpha }}
                </span>
              </num-resize>
            </td>
          </tr>
        </table>
      </div>
      </template>
     <!-- 
      <hr>
      {{ tlTopIndex }} {{ tlSubIndex }} {{ tlTweenIndex }}{{ cTween }}
      <hr>
      {{ cLayer.tween.length }}-->
    </div>
  </block-slice>
</template>

<script>
import util from '../../script/util';
import fontsList from '../../script/fontsList';
import eases from '../../script/eases';
export default {
  name: 'setting-options',
  data () {
    return {
      msg: 'setting-options',
      target: null,
    }
  },
  computed: {
    project() {
      return this.$store.state.project;
    },
    tl() {
      return this.$store.state.tl;
    },
    topIndex() {

    },
    layers() {
      return this.$store.state.project.layers;
    },
    currentTween() {
      return this.tl.currentTween;
    },
    hasProps() {
      return this.currentTween ? this.currentTween.props : null;
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
    // 文本类型层，的文本
    text:{
      get() {
        return this.cLayer.text;
      },
      set(val) {
        this.cLayer.text = val;
        // console.log(this.target);
        this.target.text = val;
      }
    },
    // 文本颜色
    color: {
      get() {
        return this.cLayer.color;
      },
      set(val) {
        this.cLayer.color = val;
        this.target.color = val;
      }
    },
    // 字体
    fontFamily: {
      get() {
        return this.cLayer.fontFamily;
      },
      set(val) {
        console.log(this.target);
        this.target.font =`normal 100px ${val}`;
        this.cLayer.fontFamily = val;
      }
    },
    fontsList() {
      return fontsList;
    },
    // 当前属性==================================================================
    props() {
      return this.currentTween ? this.currentTween.props : {};
    },
    eases() {
      return eases;
    },
    // 当前缓动
    ease:{
      get() {
        return this.currentTween ? this.currentTween.ease : 'linear'
      },
      set(val) {
        if(this.currentTween) {
          this.currentTween.ease = val;
          this.$store.dispatch('propsChange', {target: this.target, currentLayer: this.cLayer});
        }
        // console.log(val);
      },
    },
    // x
    x:{
      get() {
        return this.props.x;
      },
      set(val) {
        this.props.x = val;
        this.target.x = val;
      }
    },
    // y
    y:{
      get() {
        return this.props.y;
      },
      set(val) {
        this.props.y = val;
        this.target.y = val;
      }
    },
    // scaleX
    scaleX:{
      get() {
        return this.props.scaleX;
      },
      set(val) {
        this.props.scaleX = val;
        let targetValue = val;
        if(this.cLayer.type == 'image') {
          targetValue = val * util.getImageScale({img: this.target.image, cw: this.project.width, ch: this.project.height,type: 'cover'})
          
        }
        this.target.scaleX = targetValue;
      }
    },
    // scaleY
    scaleY:{
      get() {
        return this.props.scaleY;
      },
      set(val) {
        this.props.scaleY = val;
        let targetValue = val;
        if(this.cLayer.type == 'image') {
          targetValue = val * util.getImageScale({img: this.target.image, cw: this.project.width, ch: this.project.height,type: 'cover'})
        }
        this.target.scaleY = targetValue;
      }
    },
    // rotation
    rotation:{
      get() {
        return this.props.rotation;
      },
      set(val) {
        this.props.rotation = val;
        this.target.rotation = val;
      }
    },
    // alpha
    alpha:{
      get() {
        return this.props.alpha;
      },
      set(val) {
        this.props.alpha = val;
        this.target.alpha = val;
      }
    },
    //===========================================================================================
    
    tlTopIndex() {
      return this.tl.topIndex;
    },
    tlSubIndex() {
      return this.tl.subIndex;
    },
    // 第几个缓动
    tlTweenIndex() {
      return this.tl.tweenIndex;
    },
    // 当前图层
    cLayer() {
      let cLayer = {};
      let currentContainer = null;
      if(this.tlTopIndex > -1) {
        cLayer = this.layers[this.tlTopIndex];
        currentContainer = window.stage.children[this.tlTopIndex + 1];
      }
      if(cLayer && cLayer.children && cLayer.children[this.tlSubIndex]) {
        cLayer = cLayer.children[this.tlSubIndex];
        currentContainer = window.stage.children[this.tlTopIndex + 1].children[0].children[this.tlSubIndex];
      }
      let UUID = (cLayer || {}).UUID;
      if(UUID && currentContainer) {
        // alert('dddddd');
        this.target = currentContainer.getChildByName(UUID) || {};
        /*setTimeout(()=>{
          console.log(this.target.x);
        }, 3000)*/
      } else {
        this.target = {};
      }

      return cLayer;
    },
    cTween() {
      return this.cLayer.tween ? this.cLayer.tween[this.tlTweenIndex] : {};
    }
  },
  methods: {
    bgImageSelect() {

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
    // 属性变化
    change({type, value}) {
      // alert([type, value]);
      if (!this.target) return;
      this.$store.dispatch('propsChange', {target: this.target, currentLayer: this.cLayer});
    },
    textChange(e){
      console.log(e);
    },
    // 属性开始调整，设置时间轴指针的位置
    startSetValue() {
      // alert('dd');
      this.$store.dispatch('startSetValue');
    }
  },
  created() {
    
  },
}
</script>

<style lang="scss">
  #setting-options{
    
  }
  #setting-options-title{
    width: 100%;
    height: 100%;
    border-bottom: 1px solid #181818;
    padding: 0 10px;
    line-height: 34px;
  }
  #setting-options-title:after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: #484a4b;
  }
  #setting-options-content{
    padding: 10px;
    height: 100%;
    overflow: auto;
    -webkit-user-select: none;
    user-select: none;
    table td{
      // padding: 5px 0;
      font-size: 13px;
      height: 2.5em;
      vertical-align: middle;
    }
  }
  /*scrollbar*/
  #setting-options-content::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    overflow: hidden;
  }
  #setting-options-content::-webkit-scrollbar-thumb{
    background-color: #aaaaaa;
    transition: all 0.5s linear;
  }

  #setting-options-content::-webkit-scrollbar-thumb:hover{
    background-color:#c1c1c1;
  }


  .c-layer-title{
    font-size: 14px;
    padding: 5px 0;
  }
  // 
  #text-textarea{
    background: #57595a;
    border: 1px solid #2f3132;
    color: #fff;
    padding: 2px 5px;
    resize: none;
    border-radius: 2px;
    &:focus{
      outline: none;
    }
  }
  .prop-name:before{
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    padding: 0;
    margin-right: 7px;
    background: #666;
    border-radius: 50%;
  }
  .color-dot{
    display:inline-block;
    width: 15px;
    height: 15px;
    border-radius:50%;
  }
  
</style>
