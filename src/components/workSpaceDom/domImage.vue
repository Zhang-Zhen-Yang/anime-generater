<template>
  <div style="position: relative;" ref="domImageWrap" v-show="isVisible" @click.stop="">
    <img class="dom-image" :src="obj.image.src" :style="style" ref="domImage" @click.stop="setActiveIndex" />
    <div :style="dragStyle" :class="['dom-image-d', isSub ? 'dom-image-d-sub': '']" ref="domImageD" v-show="isActivity" @click.stop="">
      <div :style="resizeStyle" class="dom-image-r" ref="domImageR">
        <!--{{ isSub ? style : {} }}-->
        {{ obj.x }}，{{ obj.image.width }}，{{ obj.image.height}}, {{ obj.scaleX }}
      </div>
    </div>
  </div>
</template>

<script>
import  utilTimeline from '../../script/utilTimeline.js';
import  util from '../../script/util.js';
export default {
  name: 'dom-image',
  props: {
    obj: {
      type: Object,
      default() {
        return {}
      }
    },
    parentObj: {
      default() {
        return {};
      }
    },
    index: {
      type: Number,
      default: -1
    },
    sIndex: {
      type: Number,
      default: -1
    },
    // 是否是container 下的 元素
    isSub: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      msg: 'dom-image',
      resizing: false,
      resizeStartRStyle: {},
      resizeStartDStyle: {},
    }
  },
  computed: {
    playing() {
      return this.$store.state.playing;
    },
    project() {
      return this.$store.state.project;
    },
    tl() {
      return this.$store.state.tl;
    },
    topIndex() {
      return this.tl.topIndex;
    },
    subIndex() {
      return this.tl.subIndex;
    },
    tweenIndex() {
      return this.tl.tweenIndex;
    },
    // 
    currentTween() {
      return this.tl.currentTween;
    },
    objWidth() {
      return this.obj.image.width * Math.abs(this.obj.scaleX);
    },
    objHeight() {
      return this.obj.image.height * Math.abs(this.obj.scaleY);
    },
    style() {

      let pScaleX = 1;
      let pScaleY = 1;
      if(this.isSub) {
        pScaleX = this.parentObj.scaleX;
        pScaleY = this.parentObj.scaleY;
      }

      let left = this.obj.x;
      let top = this.obj.y;
      let width = this.obj.image.width * Math.abs(this.obj.scaleX);
      let height = this.obj.image.height * Math.abs(this.obj.scaleY);
      return {
        position: 'absolute',
        left: (left - width / 2) * pScaleX + 'px',
        top:  (top - height / 2) * pScaleY + 'px',
        width: width  * pScaleX + 'px',
        height: height * pScaleY + 'px',
        transform: `${this.obj.scaleX < 0 ?'scaleX(-1)': ''} ${this.obj.scaleY < 0 ?'scaleY(-1)': ''} rotateZ(${this.obj.rotation}deg)`
      }
    },
    dragStyle() {
      if(this.resizing) {
        return this.resizeStartDStyle;
      }
      let style = {
        position: 'absolute',
        left: this.style.left,
        top: this.style.top
      };
      if(this.topIndex == this.index) {
        style['z-index'] = 1000;
      }
      return style;
    },
    resizeStyle() {
      // console.log(this.resizing);
      if(this.resizing) {
        return this.resizeStartRStyle;
      }
      let style = {...this.style, left: 0, top: 0};
      return style;
    },
    isActivity() {
      if(this.isSub) {
        return this.topIndex == this.index && this.subIndex == this.sIndex && !this.playing && !!this.currentTween;
      }
      return this.topIndex == this.index && !this.playing && !!this.currentTween;
    },
    isVisible() {
      return this.obj.visible;
    }
  },
  methods: {
    u(){
      window.stage.update();
    },
    as() {
      this.$store.dispatch('addStep');
    },
    // 绑定缩放和拖动
    bindDraggableResizable() {
      // 调整大小
      $(this.domImageR)
      .resizable({
        handles: 's,n,e,w,se,sw,ne,nw',
        aspectRatio: true,
        start: (e, ui) => {
          console.log(ui);
          this.resizeStartRStyle = JSON.parse(JSON.stringify(this.resizeStyle));
          this.resizeStartDStyle = JSON.parse(JSON.stringify(this.dragStyle));
          this.resizing = true;
        },
        stop: (e,ui) => {
          this.as();
          this.resizing = false;
          let pScaleX = 1;
          let pScaleY = 1;
          if(this.isSub) {
            pScaleX = this.parentObj.scaleX;
            pScaleY = this.parentObj.scaleY;
          }

          let {left, top} = ui.position;
          let {width, height} = ui.size;
          let scaleX = width / this.obj.image.width;
          let scaleY = height / this.obj.image.height;
          let x = parseFloat(this.domImageD.style.left) - 0 + left + width / 2;
          let y = parseFloat(this.domImageD.style.top) - 0 + top + height / 2;
          let currentLayer = utilTimeline.getCurrentLayer({rootState: this.$store.state});
          if(!currentLayer) return;
          let initScale = util.getImageScale({img: this.obj.image, cw: this.project.width, ch: this.project.height,type: 'cover'});
          // alert(initScale);
          if(currentLayer.tween[this.tweenIndex]) {
            // alert('uuu');
            currentLayer.tween[this.tweenIndex].props.x = x / pScaleX;
            currentLayer.tween[this.tweenIndex].props.y = y / pScaleY;
            currentLayer.tween[this.tweenIndex].props.scaleX = scaleX / initScale / pScaleX;
            currentLayer.tween[this.tweenIndex].props.scaleY = scaleY /initScale / pScaleY;
            this.$store.dispatch('propsChange', {target: this.obj});
            this.domImageR.style.left = 0;
            this.domImageR.style.top = 0;
          }
          // this.$store.dispatch('propsChange', {target: this.obj});
        },
        resize: (e, ui)=>{
          let pScaleX = 1;
          let pScaleY = 1;
          if(this.isSub) {
            pScaleX = this.parentObj.scaleX;
            pScaleY = this.parentObj.scaleY;
          }


          let {left, top} = ui.position;
          let {width, height} = ui.size;
          let scaleX = width / this.obj.image.width;
          let scaleY = height / this.obj.image.height;
          let x = parseFloat(this.domImageD.style.left) - 0 + left + width / 2;
          let y = parseFloat(this.domImageD.style.top) - 0 + top + height / 2;
          // console.log([parseFloat(this.domImageD.style.left), this.domImageD.style.top]);
          console.log([this.domImageD.style.left,y]);
          this.obj.scaleX = scaleX / pScaleX;
          this.obj.scaleY = scaleY / pScaleY;
          this.obj.x = x / pScaleX;
          this.obj.y = y / pScaleY;
          this.u();
          // console.log(ui);
        }
      })// 可旋转
      .rotatable({
        start: ()=>{

        },
        stop: (e, ui) => {
          this.as();
          let degrees = ui.angle.current / Math.PI * 180;
          if(degrees >= 0) {
            degrees -= 360;
          }
          let currentLayer = utilTimeline.getCurrentLayer({rootState: this.$store.state});
          if(!currentLayer) return;
          if(currentLayer.tween[this.tweenIndex]) {
            currentLayer.tween[this.tweenIndex].props.rotation = degrees;
            this.$store.dispatch('propsChange', {target: this.obj});
          }
        },
        rotate: (e, ui) => {
          console.log(ui);
          let degrees = ui.angle.current / Math.PI * 180;
          if(degrees >= 0) {
            degrees -= 360;
          }
          console.log(degrees);
          this.obj.rotation = degrees;
          this.u();
        }
      }).find('.ui-rotatable-handle')
      .on('dblclick',() => {
        this.as();
        let currentLayer = utilTimeline.getCurrentLayer({rootState: this.$store.state});
          if(currentLayer.tween[this.tweenIndex]) {
            currentLayer.tween[this.tweenIndex].props.rotation = 0;
            this.$store.dispatch('propsChange', {target: this.obj});
          }
        console.log('dblclick');
      })



      // 可拖动
      $(this.domImageD).draggable({
        cancel: this.isSub? '' : 'dom-image-d-sub', // 如果不是container 下的元素，阻止拖动
        start: (e, ui)=>{

        },
        stop: (e, ui)=>{
          this.as();
          let pScaleX = 1;
          let pScaleY = 1;
          if(this.isSub) {
            pScaleX = this.parentObj.scaleX;
            pScaleY = this.parentObj.scaleY;
          }

          let left = ui.position.left - 0 + (this.objWidth / 2 * pScaleX);
          let top = ui.position.top - 0 + (this.objHeight / 2 * pScaleY);
          let currentLayer = utilTimeline.getCurrentLayer({rootState: this.$store.state});
          if(currentLayer && currentLayer.tween && currentLayer.tween[this.tweenIndex]) {
            // alert('uuu');
            currentLayer.tween[this.tweenIndex].props.x = left / pScaleX;
            currentLayer.tween[this.tweenIndex].props.y = top / pScaleY;
            this.$store.dispatch('propsChange', {target: this.obj});
          }
        },
        drag: (e, ui) => {
          let pScaleX = 1;
          let pScaleY = 1;
          if(this.isSub) {
            pScaleX = this.parentObj.scaleX;
            pScaleY = this.parentObj.scaleY;
          }
          let left = ui.position.left - 0 + (this.objWidth / 2 * pScaleX);
          let top = ui.position.top - 0 + (this.objHeight / 2 * pScaleY);
          // console.log([ui.position.left, ui.position.top]);
          this.obj.x = left / pScaleX;
          this.obj.y = top / pScaleY;
          this.u();
          // console.log([left, top]);
        },
      })
    },
    // 点击击活图层
    setActiveIndex() {
      if(this.isSub) {
        this.$store.state.activeLayerIndex = [this.index, this.sIndex];
        this.$store.state.tl.topIndex = this.index;
        this.$store.state.tl.subIndex = this.sIndex;
      } else {
        this.$store.state.activeLayerIndex = [this.index];
        this.$store.state.tl.topIndex = this.index;
        this.$store.state.tl.subIndex = -1;
      }      
      // alert('ddd');
    }
  },
  created() {
    
  },
  mounted() {
    this.domImageWrap = this.$refs.domImageWrap;
    this.domImage = this.$refs.domImage;
    this.domImageR = this.$refs.domImageR;
    this.domImageD = this.$refs.domImageD;
    this.bindDraggableResizable();
  }
}
</script>

<style lang="scss">
  .dom-image{
    opacity: 0;
  }
  .dom-image-r{
    border: 1px dashed #1284e7;
  }
</style>
