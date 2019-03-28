<template>
  <div>
    <img class="dom-image" :src="obj.image.src" :style="style" ref="domImage" />
    <div :style="dragStyle" class="dom-image-d" ref="domImageD">
      <div :style="resizeStyle" class="dom-image-r" ref="domImageR"></div>
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
    index: {
      type: Number,
      default: -1
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
    project() {
      return this.$store.state.project;
    },
    tl() {
      return this.$store.state.tl;
    },
    tweenIndex() {
      return this.tl.tweenIndex;
    },
    objWidth() {
      return this.obj.image.width * Math.abs(this.obj.scaleX);
    },
    objHeight() {
      return this.obj.image.height * Math.abs(this.obj.scaleY);
    },
    style() {
      let left = this.obj.x;
      let top = this.obj.y;
      let width = this.obj.image.width * Math.abs(this.obj.scaleX);
      let height = this.obj.image.height * Math.abs(this.obj.scaleY);
      return {
        position: 'absolute',
        left: left - width / 2 + 'px',
        top:  top - height / 2 + 'px',
        width: width + 'px',
        height: height + 'px',
        transform: `${this.obj.scaleX < 0 ?'scaleX(-1)': ''} ${this.obj.scaleY < 0 ?'scaleY(-1)': ''} rotateZ(${this.obj.rotation}deg)`
      }
    },
    dragStyle() {
      if(this.resizing) {
        return this.resizeStartDStyle;
      }
      let style = {position: 'absolute', left: this.style.left, top: this.style.top};
      return style;
    },
    resizeStyle() {
      console.log(this.resizing);
      if(this.resizing) {
        return this.resizeStartRStyle;
      }
      let style = {...this.style, left: 0, top: 0};
      return style;
    }
  },
  methods: {
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
          this.resizing = false;
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
            currentLayer.tween[this.tweenIndex].props.x = x;
            currentLayer.tween[this.tweenIndex].props.y = y;
            currentLayer.tween[this.tweenIndex].props.scaleX = scaleX / initScale;
            currentLayer.tween[this.tweenIndex].props.scaleY = scaleY /initScale;
            this.$store.dispatch('propsChange', {target: this.obj});
            this.domImageR.style.left = 0;
            this.domImageR.style.top = 0;
          }
          // this.$store.dispatch('propsChange', {target: this.obj});
        },
        resize: (e, ui)=>{
          let {left, top} = ui.position;
          let {width, height} = ui.size;
          let scaleX = width / this.obj.image.width;
          let scaleY = height / this.obj.image.height;
          let x = parseFloat(this.domImageD.style.left) - 0 + left + width / 2;
          let y = parseFloat(this.domImageD.style.top) - 0 + top + height / 2;
          // console.log([parseFloat(this.domImageD.style.left), this.domImageD.style.top]);
          console.log([this.domImageD.style.left,y]);
          this.obj.scaleX = scaleX;
          this.obj.scaleY = scaleY;
          this.obj.x = x;
          this.obj.y = y;
          console.log(ui);
        }
      })// 可旋转
      .rotatable({
        start: ()=>{

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
        }
      }).find('.ui-rotatable-handle')
      .on('dblclick',() => {
         let currentLayer = utilTimeline.getCurrentLayer({rootState: this.$store.state});
          if(currentLayer.tween[this.tweenIndex]) {
            currentLayer.tween[this.tweenIndex].props.rotation = 0;
            this.$store.dispatch('propsChange', {target: this.obj});
          }
        console.log('dblclick');
      })



      // 可拖动
      $(this.domImageD).draggable({
        start: (e, ui)=>{

        },
        stop: (e, ui)=>{
          let left = ui.position.left - 0 + this.objWidth / 2;
          let top = ui.position.top - 0 + this.objHeight / 2;
          let currentLayer = utilTimeline.getCurrentLayer({rootState: this.$store.state});
          if(currentLayer.tween[this.tweenIndex]) {
            // alert('uuu');
            currentLayer.tween[this.tweenIndex].props.x = left;
            currentLayer.tween[this.tweenIndex].props.y = top;
            this.$store.dispatch('propsChange', {target: this.obj});
          }
        },
        drag: (e, ui) => {
          let left = ui.position.left - 0 + this.objWidth / 2;
          let top = ui.position.top - 0 + this.objHeight / 2;
          this.obj.x = left;
          this.obj.y = top;
          // console.log([left, top]);
        },
      })
    }
  },
  created() {
    
  },
  mounted() {
    this.domImage = this.$refs.domImage;
    this.domImageR = this.$refs.domImageR;
    this.domImageD = this.$refs.domImageD;
    this.bindDraggableResizable();
  }
}
</script>

<style lang="scss">
  .dom-image{
    
  }
</style>
