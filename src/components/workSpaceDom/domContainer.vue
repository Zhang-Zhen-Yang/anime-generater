// 容器类型
<template>
  <div v-show="isVisible">
    <div :style="dragStyle" class="dom-container-d" ref="domContainerD" v-show="isActivity">
      <div :style="resizeStyle" class="dom-container-r" ref="domContainerR"></div>
    </div>
    <div class="dom-container" :style="style" ref="domContainer" @click="setActiveIndex">
      <template v-for="i,iindex in item.children">
        <!--容器下的image-->
        <domImage
          v-if="i.type == 'image'"
          :isSub="true"
          :obj="i.obj"
          :index="index"
          :sIndex="iindex"
          :parentObj="obj"
        ></domImage>
        <!--容器下的text-->
        <domText
          v-if="i.type == 'text'|| i.type == 'shape'"
          :isShape="i.type == 'shape'"
          :isSub="true"
          :obj="i.obj"
          :index="index"
          :sIndex="iindex"
          :parentObj="obj"
        ></domText>
      </template>
    </div>
  </div>
</template>

<script>
import  utilTimeline from '../../script/utilTimeline.js';
import  util from '../../script/util.js';
import domImage from './domImage.vue';
import domText from './domText.vue';
export default {
  name: 'dom-container',
  components: {domImage, domText},
  props: {
    obj: {
      type: Object,
      default() {
        return {}
      }
    },
    item: {
      type: Object,
      default() {
        return {
          children: []
        }
      }
    },
    index: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {
      msg: 'dom-container',
      resizing: false,
      resizeStartRStyle: {},
      resizeStartDStyle: {},
      dragging: false,
      dragStartRStyle: {},
      dragStartDStyle: {},

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
    style() {
      let left = this.obj.x + 'px';
      let top = this.obj.y + 'px';
      let width = this.project.width;
      let height = this.project.height;
      let scaleX = this.obj.scaleX;
      let scaleY = this.obj.scaleY;
      return {
        position: 'absolute',
        left: left,
        top:  top,
        width: width * scaleX + 'px',
        height: height * scaleY + 'px',
        transformOrigin: '0 0',
        transform: `${this.obj.scaleX < 0 ?'scaleX(-1)': ''} ${this.obj.scaleY < 0 ?'scaleY(-1)': ''} rotateZ(${this.obj.rotation}deg)`,
        border: this.topIndex == this.index ? '1px dashed #aaaaaa' : 'none'
      }
    },
    dragStyle() {
      if(this.resizing) {
        return this.resizeStartDStyle;
      }
      if(this.dragging){
        return this.dragStartDStyle;
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
      return this.topIndex == this.index && this.subIndex == -1 && !this.playing && this.currentTween;
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
    bindDraggableResizable() {
      // 调整大小
      $(this.domContainerR)
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
          let {left, top} = ui.position;
          let {width, height} = ui.size;
          let scaleX = width / this.project.width;
          let scaleY = height / this.project.height;
          let x = parseFloat(this.domContainerD.style.left) - 0 + left;
          let y = parseFloat(this.domContainerD.style.top) - 0 + top;
          let currentLayer = utilTimeline.getCurrentLayer({rootState: this.$store.state});
          if(!currentLayer) return;
          let initScale = 1;//util.getImageScale({img: this.obj.image, cw: this.project.width, ch: this.project.height,type: 'cover'});
          // alert(initScale);
          if(currentLayer.tween[this.tweenIndex]) {
            // alert('uuu');
            currentLayer.tween[this.tweenIndex].props.x = x;
            currentLayer.tween[this.tweenIndex].props.y = y;
            currentLayer.tween[this.tweenIndex].props.scaleX = scaleX / initScale;
            currentLayer.tween[this.tweenIndex].props.scaleY = scaleY /initScale;
            this.$store.dispatch('propsChange', {target: this.obj});
            this.domContainerR.style.left = 0;
            this.domContainerR.style.top = 0;
          }
          // this.$store.dispatch('propsChange', {target: this.obj});
        },
        resize: (e, ui)=>{
          let {left, top} = ui.position;
          let {width, height} = ui.size;
          let scaleX = width / this.project.width;//this.obj.image.width;
          let scaleY = height / this.project.height;//this.obj.image.height;
          let x = parseFloat(this.domContainerD.style.left) - 0 + left;
          let y = parseFloat(this.domContainerD.style.top) - 0 + top;
          // console.log([parseFloat(this.domContainerD.style.left), this.domContainerD.style.top]);
          console.log([this.domContainerD.style.left,y]);
          this.obj.scaleX = scaleX;
          this.obj.scaleY = scaleY;
          this.obj.x = x;
          this.obj.y = y;
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
          // console.log(degrees);
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
        // console.log('dblclick');
      })



      // 可拖动
      $(this.domContainerD).draggable({
        start: (e, ui)=>{
          this.dragStartRStyle = JSON.parse(JSON.stringify(this.resizeStyle));
          this.dragStartDStyle = JSON.parse(JSON.stringify(this.dragStyle));
          this.dragging = true;
        },
        stop: (e, ui)=>{
          this.as();
          let left = ui.position.left - 0;
          let top = ui.position.top - 0;
          let currentLayer = utilTimeline.getCurrentLayer({rootState: this.$store.state});
          if(currentLayer.tween[this.tweenIndex]) {
            // alert('uuu');
            currentLayer.tween[this.tweenIndex].props.x = left;
            currentLayer.tween[this.tweenIndex].props.y = top;
            this.$store.dispatch('propsChange', {target: this.obj});
          }
        },
        drag: (e, ui) => {
          this.dragging = false
          let left = ui.position.left;
          let top = ui.position.top;
          this.obj.x = left;
          this.obj.y = top;
          this.u();
          // console.log([left, top]);
        },
      })
    },
    // 点击击活图层
    setActiveIndex(e) {
      return;
      console.log(e.target);
      this.$store.state.activeLayerIndex = [this.index];
      this.$store.state.tl.topIndex = this.index;
      this.$store.state.tl.subIndex = -1;
      // alert('ddd');
    }
  },
  created() {
    
  },
  mounted() {
    this.domContainer = this.$refs.domContainer;
    this.domContainerR = this.$refs.domContainerR;
    this.domContainerD = this.$refs.domContainerD;
    this.bindDraggableResizable();
  }
}
</script>

<style lang="scss">
  .dom-container{
    
  }
  .dom-container-r{
    border: 1px dashed #1284e7;
  }
</style>
