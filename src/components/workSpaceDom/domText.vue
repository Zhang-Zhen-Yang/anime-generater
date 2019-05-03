<template>
  <div :style="{position: 'relative', zIndex: index}" v-show="isVisible">
    <div class="dom-text" :style="style" ref="domText"  @click.stop="setActiveIndex">
      <!--{{ obj.text || 'test' }} -->
    </div>
    <div :style="dragStyle" class="dom-text-d" ref="domTextD" v-show="isActivity" @click.stop="">
      <div :style="resizeStyle" class="dom-text-r" ref="domTextR"></div>
    </div>
  </div>
</template>

<script>
import  utilTimeline from '../../script/utilTimeline.js';
import  util from '../../script/util.js';
export default {
  name: 'dom-text',
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
    item: {
      type: Object,
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
    },
    isShape: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      msg: 'dom-text',
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
    zoom() {
      return this.project.zoom;
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
    bounds(){
      return this.obj.getBounds() || {width: 0, height: 0};
    },
    tweenIndex() {
      return this.tl.tweenIndex;
    },
    // 
    currentTween() {
      return this.tl.currentTween;
    },
    objWidth() {
      return this.bounds.width * Math.abs(this.obj.scaleX);
    },
    objHeight() {
      return this.bounds.height * Math.abs(this.obj.scaleY);
    },
    pSize() {
      let {width, height} = this.parentObj.getBounds();
      return {width, height}
    },
    style() {
      let pScaleX = 1;
      let pScaleY = 1;
      if(this.isSub) {
        pScaleX = this.parentObj.scaleX;
        pScaleY = this.parentObj.scaleY;
      }
      // alert([left, top]);
      let left = this.obj.x;
      let top = this.obj.y;
      if(this.isSub) {
        left += this.pSize.width /2;
        top += this.pSize.height / 2;
      }
      let bounds = this.bounds;
      // console.log('this.obj.getBounds()----------',this.obj.getBounds());
      let width = bounds.width * Math.abs(this.obj.scaleX); //this.obj.image.width * Math.abs(this.obj.scaleX);
      let height = bounds.height* Math.abs(this.obj.scaleY); //this.obj.image.height * Math.abs(this.obj.scaleY);
      return {
        position: 'absolute',
        left: (left - width / 2) * pScaleX * this.zoom + 'px',
        top:  (top - height / 2) * pScaleY * this.zoom+ 'px',
        width: width * pScaleX * this.zoom + 'px',
        height: height * pScaleY * this.zoom + 'px',
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
        return this.topIndex == this.index && this.subIndex == this.sIndex && !this.playing;// && !!this.currentTween;
      }
      return this.topIndex == this.index && !this.playing;// && !!this.currentTween; //  || (this.ojb instanceof createjs.Shape && this.item.asMask);
    },
    isVisible() {
      return this.obj.visible; //  || (this.isShape && this.item.asMask);
    }
  },
  methods: {
    u(){
      window.stage.update();
    },
    as() {
      this.$store.dispatch('addStep');
    },
    bindResizable({aspectRatio = true} = {aspectRatio : true}) {
      console.log('change resizable', aspectRatio);
      // 调整大小
      $(this.domTextR)
      .resizable({
        handles: 's,n,e,w,se,sw,ne,nw',
        aspectRatio,
        start: (e, ui) => {
          console.log(ui);
          this.as();
          this.c();
          this.resizeStartRStyle = JSON.parse(JSON.stringify(this.resizeStyle));
          this.resizeStartDStyle = JSON.parse(JSON.stringify(this.dragStyle));
          this.resizing = true;
        },
        stop: (e,ui) => {
          this.resizing = false;
          let pScaleX = 1;
          let pScaleY = 1;
          if(this.isSub) {
            pScaleX = this.parentObj.scaleX;
            pScaleY = this.parentObj.scaleY;
          }
          
          let {left, top} = ui.position;
          let {width, height} = ui.size;
          let scaleX = width / this.zoom / this.bounds.width;
          let scaleY = height / this.zoom / this.bounds.height;
          let x = (parseFloat(this.domTextD.style.left) - 0 + left + width / 2) / this.zoom;
          let y = (parseFloat(this.domTextD.style.top) - 0 + top + height / 2) / this.zoom;
          let currentLayer = utilTimeline.getCurrentLayer({rootState: this.$store.state});
          if(!currentLayer) return;
          let initScale = 1;//util.getImageScale({img: this.obj.image, cw: this.project.width, ch: this.project.height,type: 'cover'});
          // alert(initScale);
          if(currentLayer.tween[this.tweenIndex]) {
            // alert('uuu');
            if(this.isSub) {
              currentLayer.tween[this.tweenIndex].props.x = x / pScaleX  - this.pSize.width/2;
              currentLayer.tween[this.tweenIndex].props.y = y / pScaleY  - this.pSize.height/2;

            } else {
              currentLayer.tween[this.tweenIndex].props.x = x / pScaleX;
              currentLayer.tween[this.tweenIndex].props.y = y / pScaleY;
            }
            currentLayer.tween[this.tweenIndex].props.scaleX = scaleX / initScale / pScaleX;
            currentLayer.tween[this.tweenIndex].props.scaleY = scaleY /initScale / pScaleY;
            this.$store.dispatch('propsChange', {target: this.obj});
            this.domTextR.style.left = 0;
            this.domTextR.style.top = 0;
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
          let scaleX = width / this.zoom / this.bounds.width;//this.obj.image.width;
          let scaleY = height / this.zoom / this.bounds.height;//this.obj.image.height;
          let x = (parseFloat(this.domTextD.style.left) - 0 + left + width / 2) / this.zoom;
          let y = (parseFloat(this.domTextD.style.top) - 0 + top + height / 2) / this.zoom;
          // console.log([parseFloat(this.domTextD.style.left), this.domTextD.style.top]);
          // console.log([this.domTextD.style.left,y]);
          this.obj.scaleX = scaleX / pScaleX;
          this.obj.scaleY = scaleY / pScaleY;
          if(this.isSub) {
            this.obj.x = x / pScaleX - this.pSize.width/2;
            this.obj.y = y / pScaleY - this.pSize.height/2;
          } else {
            this.obj.x = x / pScaleX;
            this.obj.y = y / pScaleY;
          }
          this.u();
          // console.log(ui);
        }
      })
    },
    bindDraggableResizable() {
      this.bindResizable({aspectRatio: true});
      // 可旋转
      $(this.domTextR).rotatable({
        start: ()=>{
          this.as();
          this.c();
        },
        stop: (e, ui) => {
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
          // alert('dddd');
          this.as();
          let currentLayer = utilTimeline.getCurrentLayer({rootState: this.$store.state});
          if(currentLayer.tween[this.tweenIndex]) {
            currentLayer.tween[this.tweenIndex].props.rotation = 0;
            this.$store.dispatch('propsChange', {target: this.obj});
          }
        // console.log('dblclick');
      })



      // 可拖动
      $(this.domTextD).draggable({
        start: (e, ui)=>{
          this.as();
          this.c();
        },
        stop: (e, ui)=>{
          let pScaleX = 1;
          let pScaleY = 1;
          if(this.isSub) {
            pScaleX = this.parentObj.scaleX;
            pScaleY = this.parentObj.scaleY;
          }

          let left = ui.position.left / this.zoom - 0 + (this.objWidth / 2 * pScaleX);
          let top = ui.position.top / this.zoom - 0 + (this.objHeight / 2 * pScaleY);
          let currentLayer = utilTimeline.getCurrentLayer({rootState: this.$store.state});
          if(currentLayer.tween[this.tweenIndex]) {
            // alert('uuu');
            if(this.isSub) {
              currentLayer.tween[this.tweenIndex].props.x = left / pScaleX - this.pSize.width/2;
              currentLayer.tween[this.tweenIndex].props.y = top / pScaleY - this.pSize.width/2;
            } else {
              currentLayer.tween[this.tweenIndex].props.x = left / pScaleX;
              currentLayer.tween[this.tweenIndex].props.y = top / pScaleY;
            }
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
          let left = ui.position.left / this.zoom - 0 + (this.objWidth / 2 * pScaleX);
          let top = ui.position.top /this.zoom - 0 + (this.objHeight / 2 * pScaleY);
          if(this.isSub) {
            this.obj.x = left / pScaleX - this.pSize.width/2;
            this.obj.y = top / pScaleY - this.pSize.height/2;

          } else {
            this.obj.x = left / pScaleX;
            this.obj.y = top / pScaleY;
          }
          this.u();
          // console.log([left, top]);
        },
      })

      let _this = this;
      $(this.domTextR).on('mouseover', '.ui-resizable-handle', function(){
        let currentNode = $(this);
        let shouldAspect = (currentNode.is('.ui-resizable-se,.ui-resizable-sw,.ui-resizable-nw,.ui-resizable-ne'));
        let currentAspect =  $(_this.domTextR).resizable('option').aspectRatio;
        // console.log(currentAspect);
        if(shouldAspect != currentAspect) {
          $(_this.domTextR).resizable( "destroy" );
          _this.bindResizable({aspectRatio: shouldAspect});
        }
      });
    },
    // 点击击活图层
    setActiveIndex() {
      if(this.isSub) {
        this.$store.state.activeLayerIndex = [this.index, this.sIndex];
        this.$store.state.tl.topIndex = this.index;
        this.$store.state.tl.subIndex = this.sIndex;
        this.$store.state.tl.voiceIndex = -1;
        
      } else {
        this.$store.state.activeLayerIndex = [this.index];
        this.$store.state.tl.topIndex = this.index;
        this.$store.state.tl.subIndex = -1;
        this.$store.state.tl.voiceIndex = -1;
      }
      this.$store.dispatch('checkShouldSelectTweenNode');
    },
    c() {
      this.$store.dispatch('checkAddTweenIf');
    }
  },
  created() {
    
  },
  mounted() {
    this.domText = this.$refs.domText;
    this.domTextR = this.$refs.domTextR;
    this.domTextD = this.$refs.domTextD;
    this.bindDraggableResizable();

    console.log('domText', this.obj);
  }
}
</script>

<style lang="scss">
  .dom-text{
    
  }
  .dom-text-r{
    border: 1px dashed #1284e7;
  }
</style>
