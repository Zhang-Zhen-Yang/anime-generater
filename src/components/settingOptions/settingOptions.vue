<template>
  <block-slice slot="e" dir="vertical" :staticIndex="0" :staticValue="35 + 'px'">
    <div id="setting-options-title" slot="s">
      title
    </div>
    <div id="setting-options-content" slot="e">

      <table cellspacing="0" cellpadding="0" style="width:100%;" v-if="hasProps">
        <tr>
          <td style="width: 8em;">缓动</td>
          <td>
            
          </td>
        </tr>
        <!--x-->
        <tr>
          <td>x</td>
          <td>
            <num-resize
              v-model="x"
              @start="startSetValue"
              @change="change({type:'x',value: x})">
              <span>
                {{ x }}
              </span>
            </num-resize>
            <input type="number" v-if="false" v-model="x" @change="change({type:'x',value: x})">
          </td>
        </tr>
        <!--y-->
        <tr>
          <td>y</td>
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
          <td>scaleX</td>
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
          <td>scaleY</td>
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
          <td>rotation</td>
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
          <td>alpha</td>
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
     
      <hr>
      {{ tlTopIndex }} {{ tlSubIndex }} {{ tlTweenIndex }}{{ cTween }}
      <hr>
      <mask-replace
        v-if="cLayer.type=='image'"
        :text="'选择图片'"
        :showImageUpload="true"
        @select="bgImageSelect"
        @change="imageChange(0, $event)"
      >
        <img v-if="cLayer.type=='image'" :src="cLayer.pic_url" alt="" style="max-width: 100%;">
      </mask-replace>
      {{ cLayer.type }}
      <!-- {{ cLayer.tween.length }}-->
    </div>
  </block-slice>
</template>

<script>
import util from '../../script/util';
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
    layers() {
      return this.$store.state.project.layers;
    },
    currentTween() {
      return this.tl.currentTween;
    },
    hasProps() {
      return this.currentTween ? this.currentTween.props : null;
    },
    // 当前属性
    props() {
      return this.currentTween ? this.currentTween.props : {};
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
        cLayer = {...this.layers[this.tlTopIndex]};
        currentContainer = window.stage.children[this.tlTopIndex + 1];
      }
      if(cLayer && cLayer.children && cLayer.children[this.tlSubIndex]) {
        cLayer = {...cLayer.children[this.tlSubIndex]};
        currentContainer = window.stage.children[this.tlTopIndex + 1].children[0].children[this.tlSubIndex];
      }
      let UUID = cLayer.UUID;
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
    // 
    change({type, value}) {
      // alert([type, value]);
      if (!this.target) return;
      this.$store.dispatch('propsChange', {target: this.target, currentLayer: this.cLayer});
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
      padding: 5px;
      font-size: 13px;
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
  
</style>
