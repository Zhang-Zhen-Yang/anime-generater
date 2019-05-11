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
        <optionsGlobal v-if="tlTopIndex == -1"></optionsGlobal>
        
        <!--{{ cLayer.type }}-->
        <!--容器类型==================================================================================-->
        <optionsContainer :cLayer="cLayer" :target="target" v-if="cLayer && cLayer.type=='container'"></optionsContainer>
        <!--图片类型==================================================================================-->
        <optionsImage :cLayer="cLayer" v-if="cLayer && cLayer.type=='image'"></optionsImage>


        <!--文本类型=====================================================================================-->
        <optionsText :cLayer="cLayer" :target="target" v-if="cLayer && cLayer.type=='text'" ></optionsText>
        <!--视频类型========================================================================================-->
        <template v-if="cLayer && cLayer.type=='video'">
          <!--视频-->
          <div class="c-layer-title">
            <span class="prop-name">视频</span>
          </div>
            <videoRangeSelect :layer="cLayer"></videoRangeSelect>
        </template>
        <!--形状类型========================================================================================-->
        <optionsShape :cLayer="cLayer" :target="target" v-if="cLayer && cLayer.type=='shape'"></optionsShape>
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
            <table cellspacing="0" cellpadding="0" style="width:100%;table-layout:fixed;">
              <tr>
                <td class="width1-4">
                  <span class="prop-name-x">对齐</span>
                </td>
                <td colspan="3">
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
                <td>
                  <span class="prop-name-x">缓动</span>
                </td>
                <td colspan="3">
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
                <td colspan="3">
                  <num-resize
                    v-model="x"
                    @start="propStartSetValue"
                    @change="change({type:'x',value: x})">
                    <span >
                      {{ parseFloat(x.toFixed(2)) }}
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
                <td colspan="3">
                  <num-resize
                    v-model="y"
                    @start="propStartSetValue"
                    @change="change({type:'y',value: y})">
                    <span>
                      {{ parseFloat(y.toFixed(2)) }}
                    </span>
                  </num-resize>
                </td>
              </tr>
              <!--scaleX-->
              <tr>
                <td>
                  <span class="prop-name-x">scaleX</span>
                </td>
                <td colspan="1" style="width: 45%">
                  <num-resize
                    v-model="scaleX"
                    :stepScale="0.01"
                    :toFixed="3"
                    @start="propStartSetValue"
                    @change="change({type:'scaleX',value: scaleX})">
                    <span>
                      {{ parseFloat(scaleX.toFixed(3)) }}
                    </span>
                  </num-resize>
                  <!--
                  <input v-model="scaleX" max="1000000" min="-10000000000" type="number" step="0.1" style="max-width: 100%;">
                  -->
                </td>
                <td>
                  <!--宽-->
                  <span class="prop-name-x">width</span>
                </td>
                <td style="width: 25%">
                  <num-resize
                    v-model="widthByScaleX"
                    :stepScale="1"
                    :toFixed="3"
                    @start="propStartSetValue"
                    @change="change({type:'scaleX',value: scaleX})">
                    <span>
                      {{ widthByScaleX.toFixed(3) }}
                    </span>
                  </num-resize>
                </td>
              </tr>
              <!--scaleY-->
              <tr>
                <td>
                  <span class="prop-name-x">scaleY</span>
                </td>
                <td colspan="1">
                  <num-resize
                    v-model="scaleY"
                    :stepScale="0.01"
                    :toFixed="3"
                    @start="propStartSetValue"
                    @change="change({})">
                    <span>
                      {{ parseFloat(scaleY.toFixed(3)) }}
                    </span>
                  </num-resize>
                </td>
                <td>
                  <!--高-->
                  <span class="prop-name-x">height</span>
                </td>
                <td>
                  <num-resize
                    v-model="heightByScaleY"
                    :stepScale="1"
                    :toFixed="3"
                    @start="propStartSetValue"
                    @change="change({})">
                    <span>
                      {{ heightByScaleY.toFixed(3) }}
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
                <td colspan="3">
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
                <td colspan="3">
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
import optionsGlobal from './optionsGlobal.vue';
import optionsImage from './optionsImage.vue';
import optionsShape from './optionsShape.vue';
import optionsText from './optionsText.vue';
import optionsContainer from './optionsContainer.vue';

export default {
  name: 'setting-options',
  components: {
    videoRangeSelect,
    voiceOptions,
    optionsGlobal,
    optionsImage,
    optionsShape,
    optionsText,
    optionsContainer,
  },
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
    
    
    fontsList() {
      return fontsList;
    },
    // ==============================================
    
    
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

    widthByScaleX: {
      get() {
        // console.log('this.targetthis.targetthis.targetthis.targetthis.targetthis.target',this.target);
        return (this.target.getBounds() || {width: 5}).width * this.target.scaleX;
      },
      set(val){
        if(this.cLayer.type == 'image') {
          let initScale =  util.getImageScale({img: this.target.image, cw: this.project.width, ch: this.project.height,type: 'cover'})
          this.scaleX = val / this.target.image.width / initScale;
        } else {
          this.scaleX = val / this.target.getBounds().width;
        }
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
    heightByScaleY: {
      get() {
        // console.log('this.targetthis.targetthis.targetthis.targetthis.targetthis.target',this.target);
        return (this.target.getBounds() || {height: 5}).height * this.target.scaleY;
      },
      set(val){
        console.log(val);
        if(this.cLayer.type == 'image') {
          let initScale = util.getImageScale({img: this.target.image, cw: this.project.width, ch: this.project.height,type: 'cover'})
          this.scaleY =  val / this.target.image.height / initScale;
        } else {
          this.scaleY = val / this.target.getBounds().height;
        }
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
    initChange({type, value}){

    },
    // 属性变化
    change({type, value}) {
      // alert([type, value]);
      if (!this.target) return;
      
      this.$store.dispatch('propsChange', {target: this.target, currentLayer: this.cLayer});
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
    // 设置对齐
    setAlign(type) {
      this.$store.dispatch('setAlign', {type});
    },
     update() {
      let {topIndex, subIndex} = this.$store.state.tl; 
      this.$store.dispatch('updateTween', {topIndex, subIndex});
    },
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
