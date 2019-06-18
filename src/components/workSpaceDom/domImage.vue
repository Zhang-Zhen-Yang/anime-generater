<template>
  <div style="position: relative;" ref="domImageWrap" v-show="isVisible" @click.stop="hideContextmenu" @contextmenu.stop="contextmenu($event)">
    <img class="dom-image" :src="obj.image.src" :style="{...style, opacity: type == 'canvas'? 0.8 : 0 }" ref="domImage" @click.stop="setActiveIndex" @contextmenu.stop="contextmenu($event)"/>
    <div :style="dragStyle" :class="['dom-image-d', isSub ? 'dom-image-d-sub': '']" ref="domImageD" v-show="isActivity && type =='event'" @click.stop="" >
      <div :style="resizeStyle" class="dom-image-r" ref="domImageR">
        <!--{{ isSub ? style : {} }}-->
        <!--{{ obj.x }}，{{ obj.image.width }}，{{ obj.image.height}}, {{ obj.scaleX }}-->
      </div>
    </div>
  </div>
</template>

<script>
import  utilTimeline from '../../script/utilTimeline.js';
import  util from '../../script/util.js';
import obj from '../../script/canvasRender.js';
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
    },
    type: {
      type: String,
      default: 'event',
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
    tweenIndex() {
      return this.tl.tweenIndex;
    },
    // 
    currentTween() {
      return this.tl.currentTween;
    },
    objWidth() {
      let objWidth = this.obj.image.width * Math.abs(this.obj.scaleX);
      // let boundWidth = this.obj.getBounds().width * this.obj.scaleX;
      // console.log('image objWidth', objWidth);
      // console.log('image bound objWidth', boundWidth);
      return objWidth;// boundWidth; //objWidth;
    },
    objHeight() {
      let objHeight = this.obj.image.height * Math.abs(this.obj.scaleY);
      // let boundHeight = this.obj.getBounds().height * this.obj.scaleY;
      return objHeight;// boundHeight;
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

      let left = this.obj.x;
      let top = this.obj.y;
      // 5.2
      if(this.isSub) {
        // this.parentObj
        // let {width:pWidth, height:pHeight} = this.parentObj.getBounds();
        // alert([pWidth, pHeight]);
        //left += this.pSize.width /2;
        // top += this.pSize.height / 2;
      }
      let width = this.obj.image.width * Math.abs(this.obj.scaleX);
      let height = this.obj.image.height * Math.abs(this.obj.scaleY);
      return {
        position: 'absolute',
        left: (left - width / 2) * pScaleX * this.zoom+ 'px',
        top:  (top - height / 2) * pScaleY * this.zoom + 'px',
        width: width  * pScaleX * this.zoom + 'px',
        height: height * pScaleY * this.zoom+ 'px',
        transform: `${this.obj.scaleX < 0 ?'scaleX(-1)': ''} ${this.obj.scaleY < 0 ?'scaleY(-1)': ''} rotateZ(${this.obj.rotation}deg) `
      }
    },
    dragStyle() {
      if(this.resizing) {
        return this.resizeStartDStyle;
      }
      let style = {
        position: 'absolute',
        left: this.style.left,
        top: this.style.top,
        // transform: `translate(${-50 * this.zoom}px, ${-50 * this.zoom}px)`

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
      return this.topIndex == this.index && !this.playing;// && !!this.currentTween;
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
    bindResizable({aspectRatio = true} = {aspectRatio : true}) {
      
      console.log('aspectRatioaspectRatioaspectRatioaspectRatioaspectRatioaspectRatioaspectRatio', aspectRatio);
      // 调整大小
      $(this.domImageR)
      .resizable({
        handles: 's,n,e,w,se,sw,ne,nw',
        aspectRatio: aspectRatio,
        // 开始调整大小
        start: (e, ui) => {
          this.as();
          this.c();
          // console.log(ui);
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
          let scaleX = width / this.zoom / this.obj.image.width;
          let scaleY = height / this.zoom / this.obj.image.height;
          let x = (parseFloat(this.domImageD.style.left) - 0 + left + width / 2) / this.zoom;
          let y = (parseFloat(this.domImageD.style.top) - 0 + top + height / 2) / this.zoom;
          let currentLayer = utilTimeline.getCurrentLayer({rootState: this.$store.state});
          if(!currentLayer) return;
          let initScale = util.getImageScale({img: this.obj.image, cw: this.project.width, ch: this.project.height,type: 'cover'});
          // alert(initScale);
          if(currentLayer.tween[this.tweenIndex]) {
            // alert('uuu');
            /*if(this.isSub) {
              currentLayer.tween[this.tweenIndex].props.x = x / pScaleX - this.pSize.width/2;
              currentLayer.tween[this.tweenIndex].props.y = y / pScaleY - this.pSize.height/2;
            } else {*/
              currentLayer.tween[this.tweenIndex].props.x = x / pScaleX;
              currentLayer.tween[this.tweenIndex].props.y = y / pScaleY;
            //}

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
          let scaleX = width / this.zoom / this.obj.image.width;
          let scaleY = height / this.zoom / this.obj.image.height;
          let x = (parseFloat(this.domImageD.style.left) - 0 + left + width / 2) / this.zoom;
          let y = (parseFloat(this.domImageD.style.top) - 0 + top + height / 2) / this.zoom;
          // console.log([parseFloat(this.domImageD.style.left), this.domImageD.style.top]);
          // console.log([this.domImageD.style.left,y]);
          this.obj.scaleX = scaleX / pScaleX;
          this.obj.scaleY = scaleY / pScaleY;

          /*if(this.isSub) {
            this.obj.x = x / pScaleX  - this.pSize.width/2;
            this.obj.y = y / pScaleY  - this.pSize.height/2;
          } else {*/
            this.obj.x = x / pScaleX;
            this.obj.y = y / pScaleY;
          // }
          this.u();
          // console.log(ui);
        }
      })
    },
    // 绑定缩放和拖动
    bindDraggableResizable() {
      if(this.type == 'canvas') { return; }
      this.bindResizable({aspectRatio: false});
      // 可旋转
      $(this.domImageR).rotatable({
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
          if(currentLayer && currentLayer.tween && currentLayer.tween[this.tweenIndex]) {
            // alert('uuu');
            /*if(this.isSub) {
              currentLayer.tween[this.tweenIndex].props.x = left / pScaleX - this.pSize.width/2;
              currentLayer.tween[this.tweenIndex].props.y = top / pScaleY - this.pSize.height/2;

            } else {*/
              currentLayer.tween[this.tweenIndex].props.x = left / pScaleX;
              currentLayer.tween[this.tweenIndex].props.y = top / pScaleY;
            //}
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
          let top = ui.position.top / this.zoom - 0 + (this.objHeight / 2 * pScaleY);
          // console.log([ui.position.left, ui.position.top]);
          /*if(this.isSub) {
            this.obj.x = left / pScaleX - this.pSize.width/2;
            this.obj.y = top / pScaleY - this.pSize.height / 2;
          } else {*/
            this.obj.x = left / pScaleX;
            this.obj.y = top / pScaleY;
          //}
          this.u();
          // console.log([left, top]);
        },
      })
      let _this = this;
      $(this.domImageR).on('mouseover', '.ui-resizable-handle', function(){
        let currentNode = $(this);
        let shouldAspect = (currentNode.is('.ui-resizable-se,.ui-resizable-sw,.ui-resizable-nw,.ui-resizable-ne'));
        let currentAspect =  $(_this.domImageR).resizable('option').aspectRatio;
        // console.log(currentAspect);
        if(shouldAspect != currentAspect) {
          $(_this.domImageR).resizable( "destroy" );
          _this.bindResizable({aspectRatio: shouldAspect});
        }
      });
    },
    hideContextmenu() {
      this.$store.dispatch('hideContextMenu');
    },
    // 右键
    contextmenu(e) {
      e.preventDefault();
      this.setActiveIndex();
      this.$store.dispatch('contextMenu', {e});
      // alert('contextMenu');
    },
    // 点击击活图层
    setActiveIndex() {
      this.$store.dispatch('hideContextMenu');
      if(this.isSub) {
        this.$store.state.activeLayerIndex = [this.index, this.sIndex];
        this.$store.state.tl.topIndex = this.index;
        this.$store.state.tl.subIndex = this.sIndex;
        this.$store.state.tl.voiceIndex = -1;
        // alert(this.$store.state.tl.voiceIndex);
        if(!this.project.layers[this.index].children[this.sIndex].tween[this.tweenIndex]) {
          this.$store.state.tl.tweenIndex = 0;
        }
      } else {
        this.$store.state.activeLayerIndex = [this.index];
        this.$store.state.tl.topIndex = this.index;
        this.$store.state.tl.subIndex = -1;
        this.$store.state.tl.voiceIndex = -1;
        // alert(this.$store.state.tl.voiceIndex);
        if(!this.project.layers[this.index].tween[this.tweenIndex]) {
          this.$store.state.tl.tweenIndex = 0;
        }
      }
      this.$store.dispatch('checkShouldSelectTweenNode');  
      // alert('ddd');
    },
    c() {
      this.$store.dispatch('checkAddTweenIf');
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
