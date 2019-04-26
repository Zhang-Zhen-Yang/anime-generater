<template>
  <block-slice slot="e" dir="vertical" :staticIndex="0" :staticValue="35 + 'px'">
    <div id="setting-options-title" slot="s">
      设置<!--{{ tlTopIndex }} {{ tlSubIndex }} {{ tlTweenIndex }}-->
    </div>
    <div v-if="voiceIndex > -1" id="setting-options-content" slot="e">
      <voiceOptions></voiceOptions>
    </div>
    <div v-else id="setting-options-content" slot="e">
      <div class="divider" style="padding: 10px;">
        <!--全局设置======================================================================================-->
        <template v-if="tlTopIndex == -1">
          <!--画布尺寸-->
          <div class="c-layer-title">
            <span class="prop-name">画布尺寸</span>
          </div>
          <div style="padding-left: 15px;">
              <table cellspacing="0" cellpadding="0" style="width: 100%;">
                <tr>
                  <td style="width: 8em;">宽</td>
                  <td colspan="2">
                    <num-resize
                      v-model="projectWidth"
                      @start="startSetValue"
                      :min="100"
                      :max="1280">
                      <span >
                        {{ projectWidth }}
                      </span>
                    </num-resize>
                  </td>
                </tr>
                <tr>
                  <td style="width: 8em;">高</td>
                  <td colspan="2">
                    <num-resize
                      v-model="projectHeight"
                      @start="startSetValue"
                      :min="100"
                      :max="1280">
                      <span >
                        {{ projectHeight }}
                      </span>
                    </num-resize>
                  </td>
                </tr>
              </table>
          </div>

          <div class="c-layer-title">
            <span class="prop-name">背景颜色</span>
          </div>
          <div style="padding-left: 15px;">
            <color-picker title="颜色" v-model="bgColor" :showTitle="false" @start="startSetValue">
            </color-picker>
          </div>

        </template>
        <!--{{ cLayer.type }}-->
        <!--容器类型==================================================================================-->
        <template v-if="cLayer && cLayer.type=='container'">
          <!--图片-->
          <div class="c-layer-title">
            <span class="prop-name">容器尺寸</span>
          </div>
          <div style="padding-left: 15px;">
            <table cellspacing="0" cellpadding="0" style="width:100%;">
              <tr>
                <td style="width: 8em;">
                  <span class="prop-name-x">宽</span>
                </td>
                <td>
                  <num-resize
                    v-model="containerWidth"
                    :min="0"
                    :max="1000"
                    @start="()=>{as();}"
                  >
                    <span >
                      {{ containerWidth }}
                    </span>
                  </num-resize>
                </td>
              </tr>
              <tr>
                <td style="width: 8em;">
                  <span class="prop-name-x">高</span>
                </td>
                <td>
                  <num-resize
                    v-model="containerHeight"
                    :min="0"
                    :max="1000"
                    @start="()=>{as();}"
                  >
                    <span >
                      {{ containerHeight }}
                    </span>
                  </num-resize>
                </td>
              </tr>
            </table>
          </div>
        </template>
        <!--图片类型==================================================================================-->
        <template v-if="cLayer && cLayer.type=='image'">
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
          </div>

        </template>


        <!--文本类型=====================================================================================-->
        <template v-if="cLayer && cLayer.type=='text'">
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
        </template>
        <!--视频类型========================================================================================-->
        <template v-if="cLayer && cLayer.type=='video'" mute>
          <!--视频-->
          <div class="c-layer-title">
            <span class="prop-name">视频</span>
          </div>
          
            <videoRangeSelect :layer="cLayer"></videoRangeSelect>
          
        </template>
        <!--形状类型========================================================================================-->
        <template v-if="cLayer && cLayer.type=='shape'">
          
          <div class="c-layer-title">
            <span class="prop-name">形状类型</span>
          </div>
          <div style="padding-left: 15px;">
            <select name="" id="" v-model="shapeType" style="background-color:#57595a;color:white;border-radius:2px;">
              <option value="polyStar">polyStar</option>
              <option value="circle">circle</option>
              <option value="rect">rect</option>
            </select>
          </div>
          <div class="c-layer-title">
            <span class="prop-name">形状属性</span>
          </div>
          <div style="padding-left: 15px;">
            <!--形状属性 多边形-->
            <table cellspacing="0" cellpadding="0" style="width:100%;" v-if="shapeType == 'polyStar'">
              <tr>
                <td style="width: 8em;">
                  <span class="prop-name-x">边数</span>
                </td>
                <td>
                  <num-resize
                    v-model="sides"
                    :min="3"
                    :max="100"
                    @start="()=>{as();}"
                  >
                    <span >
                      {{ sides }}
                    </span>
                  </num-resize>
                </td>
              </tr>
              <!--内陷-->
              <tr>
                <td style="width: 8em;">
                  <span class="prop-name-x">内陷</span>
                </td>
                <td>
                  <num-resize
                    v-model="pointSize"
                    :stepScale="0.01"
                    :min="0"
                    :max="1"
                    @start="()=>{as();}"
                  >
                    <span >
                      {{ pointSize }}
                    </span>
                  </num-resize>
                </td>
              </tr>
              <!--半径-->
              <tr>
                <td style="width: 8em;">
                  <span class="prop-name-x">半径</span>
                </td>
                <td>
                  <num-resize
                    v-model="radius"
                    :min="0"
                    :max="10000"
                    @start="()=>{as();}"
                  >
                    <span >
                      {{ radius }}
                    </span>
                  </num-resize>
                </td>
              </tr>
              <!--颜色-->
              <tr>
                <td style="width: 8em;">
                  <span class="prop-name-x">fill</span>
                </td>
                <td>
                  <color-picker title="颜色" v-model="shapeColor" :showTitle="false" @start="()=>{as();}">
                  </color-picker>
                </td>
              </tr>

            </table>
            <!--形状属性 多边形-->
            <table cellspacing="0" cellpadding="0" style="width:100%;" v-if="shapeType == 'circle'">
              
              <!--半径-->
              <tr>
                <td style="width: 8em;">
                  <span class="prop-name-x">半径</span>
                </td>
                <td>
                  <num-resize
                    v-model="radius"
                    :min="0"
                    :max="10000"
                    @start="()=>{as();}"
                  >
                    <span >
                      {{ radius }}
                    </span>
                  </num-resize>
                </td>
              </tr>
              <!--颜色-->
              <tr>
                <td style="width: 8em;">
                  <span class="prop-name-x">fill</span>
                </td>
                <td>
                  <color-picker title="颜色" v-model="shapeColor" :showTitle="false" @start="()=>{as();}">
                  </color-picker>
                </td>
              </tr>
            </table>

            <!--形状属性 四边形-->
            <table cellspacing="0" cellpadding="0" style="width:100%;" v-if="shapeType == 'rect'">
              
              <!--半径-->
              <tr>
                <td style="width: 8em;">
                  <span class="prop-name-x">圆角半径</span>
                </td>
                <td>
                  <num-resize
                    v-model="rRadius"
                    :min="0"
                    :max="10000"
                    @start="()=>{as();}"
                  >
                    <span >
                      {{ rRadius }}
                    </span>
                  </num-resize>
                </td>
              </tr>
              <!--宽-->
              <tr>
                <td style="width: 8em;">
                  <span class="prop-name-x">width</span>
                </td>
                <td>
                  <num-resize
                    v-model="rWidth"
                    :min="0"
                    :max="10000"
                    @start="()=>{as();}"
                  >
                    <span >
                      {{ rWidth }}
                    </span>
                  </num-resize>
                </td>
              </tr>
              <!--半径-->
              <tr>
                <td style="width: 8em;">
                  <span class="prop-name-x">height</span>
                </td>
                <td>
                  <num-resize
                    v-model="rHeight"
                    :min="0"
                    :max="10000"
                    @start="()=>{as();}"
                  >
                    <span >
                      {{ rHeight }}
                    </span>
                  </num-resize>
                </td>
              </tr>
              <!--颜色-->
              <tr>
                <td style="width: 8em;">
                  <span class="prop-name-x">fill</span>
                </td>
                <td>
                  <color-picker title="颜色" v-model="shapeColor" :showTitle="false" @start="()=>{as();}">
                  </color-picker>
                </td>
              </tr>
            </table>
            

          </div>
        </template>
      </div>

      <div class="divider" style="padding: 10px;" v-if="currentTween&&hasProps&&cLayer.type">
        <!--属性节点=================================================================================-->
        <template >
          <!--节点-->
          <div class="c-layer-title">
            <span class="prop-name">节点</span>
          </div>
          <div style="padding-left: 15px;">

            <!--节点的属性值-->
            <table cellspacing="0" cellpadding="0" style="width:100%;">
              <tr>
                <td style="width: 8em;">
                  <span class="prop-name-x">对齐</span>
                </td>
                <td>
                  <table　cellpadding="0" cellspacing="0" style="width: 100%;">
                    <tr>
                      <td>
                        <div class="align-icon align-left" @click="setAlign('left')" title="左对齐">
                        </div>
                      </td>
                      <td>
                        <div class="align-icon align-center" @click="setAlign('center')" title="水平居中">
                        </div>
                      </td>
                      <td>
                        <div class="align-icon align-right" @click="setAlign('right')" title="右对齐">
                        </div>
                      </td>
                      <td>
                        <div class="align-icon align-top" @click="setAlign('top')" title="顶对齐">
                        </div>
                      </td>
                      <td>
                        <div class="align-icon align-middle" @click="setAlign('middle')" title="垂直居中">
                        </div>
                      </td>
                      <td>
                        <div class="align-icon align-bottom" @click="setAlign('bottom')" title="底对齐">
                        </div>
                      </td>
                    </tr>
                  </table>
                  
                </td>
              </tr>
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
                    @start="propStartSetValue"
                    @change="change({type:'x',value: x})">
                    <span >
                      {{ x.toFixed(2) }}
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
                    @start="propStartSetValue"
                    @change="change({type:'y',value: y})">
                    <span>
                      {{ y.toFixed(2) }}
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
                    @start="propStartSetValue"
                    @change="change({type:'scaleX',value: scaleX})">
                    <span>
                      {{ scaleX.toFixed(4) }}
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
                    @start="propStartSetValue"
                    @change="change({type:'scaleY',value: scaleY})">
                    <span>
                      {{ scaleY.toFixed(4) }}
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
                    @start="propStartSetValue"
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
                    @start="propStartSetValue"
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
      </div>
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
import utilTimeline from '../../script/utilTimeline';
import fontsList from '../../script/fontsList';
import eases from '../../script/eases';
import videoRangeSelect from './videoRangeSelect.vue';
import voiceOptions from './voiceOptions.vue';
export default {
  name: 'setting-options',
  components: {videoRangeSelect, voiceOptions},
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
    voiceIndex() {
      return this.tl.voiceIndex;
    },
    topIndex() {

    },
    tweenIndex() {
      return this.tl.tweenIndex;
    },
    layers() {
      return this.$store.state.project.layers;
    },
    currentLayer() {
      let currentLayer = utilTimeline.getCurrentLayer({rootState: this.$store.state});
      return currentLayer;
    },
    currentTween() {
      // alert(this.currentLayer);
      return this.currentLayer ? this.currentLayer.tween[this.tl.tweenIndex] : null;
    },
    hasProps() {
      return this.currentTween ? this.currentTween.props : null;
    },
    // 画布宽
    projectWidth: {
      get() {
        return this.project.width;
      },
      set(val) {
        this.project.width = val;
      }
    },
    // 画布高
    projectHeight: {
      get() {
        return this.project.height;
      },
      set(val) {
        this.project.height = val;
      }
    },
    bgColor: {
      get() {
        return this.project.bgColor;
      },
      set(val) {
        this.project.bgColor = val;
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
    // 文本类型层，的文本
    text:{
      get() {
        return this.cLayer.text;
      },
      set(val) {
        this.as();
        this.cLayer.text = val;
        // console.log(this.target);
        this.target.text = val;
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
        this.$store.dispatch('loadFont', {fontFamily: val, text: this.target.text});
      }
    },
    fontsList() {
      return fontsList;
    },
    // ==============================================
    shapeType: {
      get() {
        return this.cLayer.graphics && this.cLayer.graphics.type;
      },
      set(val) {
        this.as();
        this.cLayer.graphics.type = val;
        this.updateShape();
      }
    },
    shapeColor: {
      get() {
        return this.cLayer.graphics.fill;
      },
      set(val) {
        this.cLayer.graphics.fill = val;
        this.updateShape();
      }
    },
    // 半径
    radius: {
      get() {
        return this.cLayer.graphics && this.cLayer.graphics.radius;
      },
      set(val) {
        // this.as();
        this.cLayer.graphics.radius = val;
        this.updateShape();
      }
    },
    // 圆角半径
    rRadius: {
      get() {
        return this.cLayer.graphics && this.cLayer.graphics.rRadius;
      },
      set(val) {
        // this.as();
        this.cLayer.graphics.rRadius = val;
        this.updateShape();
      }
    },
    // rect width
    rWidth: {
      get() {
        return this.cLayer.graphics && this.cLayer.graphics.w;
      },
      set(val) {
        // this.as();
        this.cLayer.graphics.w = val;
        this.updateShape();
      }
    },
    // rect height
    rHeight: {
      get() {
        return this.cLayer.graphics && this.cLayer.graphics.h;
      },
      set(val) {
        // this.as();
        this.cLayer.graphics.h = val;
        this.updateShape();
      }
    },

    // 边数
    sides: {
      get() {
        return this.cLayer.graphics && this.cLayer.graphics.sides;
      },
      set(val) {
        // this.as();
        this.cLayer.graphics.sides = parseInt(val);
        this.updateShape();
      }
    },
    // 内陷
    pointSize: {
      get() {
        return this.cLayer.graphics && this.cLayer.graphics.pointSize;
      },
      set(val) {
        //  this.as();
        this.cLayer.graphics.pointSize = val;
        this.updateShape();
      }
    },
    // 容器宽
    containerWidth: {
      get(val){
        return this.cLayer.width;
      },
      set(val) {
        this.cLayer.width = val;
        this.cLayer.obj.setBounds(0,0,val,this.cLayer.height);
        this.cLayer.obj.set({
          regX: this.cLayer.width / 2,
          regY: this.cLayer.height / 2,
        });
      }
    },
    // 容器高
    containerHeight: {
      get(val){
        return this.cLayer.height;
      },
      set(val) {
        this.cLayer.height = val;
        this.cLayer.obj.setBounds(0,0,this.cLayer.width,val);
        this.cLayer.obj.set({
          regX: this.cLayer.width / 2,
          regY: this.cLayer.height / 2,
        });
      }
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
          this.as();
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
      this.as();
      this.$store.dispatch('startSetValue');
    },
    propStartSetValue() {
      this.as();
      this.$store.dispatch('checkAddTweenIf');
      this.$store.dispatch('startSetValue');
    },
    // 添加历史记录
    as() {
      this.$store.dispatch('addStep');
    },
    updateShape() {
      let {radius, type, fill} = this.cLayer.graphics;
      // 圆形
      if(type == 'circle') {
        this.target.graphics.clear().f(fill).drawCircle(0, 0, radius);
        this.target.setBounds(
          0,
          0,
          radius * 2,
          radius * 2
        );
      // 多边形
      } else if(type =='polyStar'){
        let {sides, pointSize, angle} = this.cLayer.graphics;
        this.target.graphics.clear().f(fill).drawPolyStar(0, 0, radius, sides, pointSize, angle);
        this.target.setBounds(
          0,
          0,
          radius * 2,
          radius * 2
        );
        // 四边形
      } else if(type == 'rect') {
        let {w, h, rRadius} = this.cLayer.graphics;
        this.target.graphics.clear().f(fill).drawRoundRect(-w / 2, -h / 2, w, h, rRadius);
        this.target.setBounds(
          0,
          0,
          w,
          h
        );
      }
    },
    // 设置对齐
    setAlign(type) {
      this.$store.dispatch('setAlign', {type});
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
    // padding: 10px;
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



  .align-icon{
    width: 16px;
    height: 16px;
    cursor: pointer;

  }
  .align-icon.align-left{
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='%23626A76'%3E%3Cpath clip-rule='evenodd' d='M11 2H3v5h8V2zM0 16h1V0H0v16zm3-7v5h12V9H3zm11 4H4v-3h10v3z'/%3E%3C/svg%3E");
  }
  .align-icon.align-center{
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='%23626A76'%3E%3Cpath clip-rule='evenodd' d='M9 9V7h3V2H9V0H8v2H5v5h3v2H2v5h6v2h1v-2h6V9H9zm5 4H3v-3h11v3z'/%3E%3C/svg%3E");
  }
  .align-icon.align-right{
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='%23626A76'%3E%3Cpath d='M1 14h12V9H1v5zm1-4h10v3H2v-3zm3-8h8v5H5zm10-2h1v16h-1z'/%3E%3C/svg%3E");
  }
  .align-icon.align-top{
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='%23626A76'%3E%3Cpath clip-rule='evenodd' d='M9 11h5V3H9v8zm-7 4h5V3H2v12zM3 4h3v10H3V4zM0 0v1h16V0H0z'/%3E%3C/svg%3E");
  }
  .align-icon.align-middle{
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='%23626A76'%3E%3Cpath clip-rule='evenodd' d='M14 7V3H9v4H7V1H2v6H0v1h2v6h5V8h2v4h5V8h2V7h-2zm-8 6H3V2h3v11z'/%3E%3C/svg%3E");
  }
  .align-icon.align-bottom{
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16' fill='%23626A76'%3E%3Cpath d='M9 5h5v8H9zM7 1H2v12h5V1zM6 12H3V2h3v10zm-6 3h16v1H0z'/%3E%3C/svg%3E");
  }
  
</style>
