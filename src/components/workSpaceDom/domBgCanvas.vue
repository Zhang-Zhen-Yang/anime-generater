<template>
  <div class="relative">
    <!-- {{ canvastype }} {{clipIndex}} {{ parentObj.scaleX }}-->
    <canvas class="dom-bg-canvas absolute" ref="canvas" :width="800" :height="800">
    </canvas>
  </div>
</template>

<script>
export default {
  name: 'dom-bg-canvas',
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
    },
    canvastype: {
      type: String,
      default: 'text',
    }
  },
  data () {
    return {
      msg: 'dom-bg-canvas'
    }
  },
  computed: {
    zoom() {
      return this.$store.state.project.zoom;
    },
    bounds(){
      return this.obj.getBounds() || {width: 0, height: 0};
    },
    canvasSize() {
      let pScaleX = 1;
      let pScaleY = 1;
      if(this.isSub) {
        pScaleX = this.parentObj.scaleX;
        pScaleY = this.parentObj.scaleY;
      }
      let bounds = this.bounds;
      let width = bounds.width * Math.abs(this.obj.scaleX) * this.zoom; 
      let height = bounds.height* Math.abs(this.obj.scaleY) * this.zoom;
      return {
        width: width,
        height: this.canvastype == 'text' ? height * 2 : height
      }

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
      /* if(this.isSub) {
        left += this.pSize.width /2;
        top += this.pSize.height / 2;
      }*/
      let bounds = this.bounds;
      // console.log('this.obj.getBounds()----------',this.obj.getBounds());
      let width = bounds.width * Math.abs(this.obj.scaleX); //this.obj.image.width * Math.abs(this.obj.scaleX);
      let height = bounds.height* Math.abs(this.obj.scaleY); //this.obj.image.height * Math.abs(this.obj.scaleY);
      return {
        width: width * pScaleX * this.zoom ,
        height: height * pScaleY * this.zoom ,
        transform: `${this.obj.scaleX < 0 ?'scaleX(-1)': ''} ${this.obj.scaleY < 0 ?'scaleY(-1)': ''} rotateZ(${this.obj.rotation}deg)`
      }
    },
    // 文本固有属性
    textAllValues(){
      return {
        text: this.item.text,
        fontSize: this.item.fontSize,
        fontFamily: this.item.fontFamily,
        textBaseline: this.item.textBaseline,

        outline: this.item.outline,
        outlineColor: this.item.outlineColor,
        
        editable: this.item.editable,
        layerName: this.item.layerName,
        shadowOffsetX: this.item.shadowOffsetX,
        shadowOffsetY: this.item.shadowOffsetY,
        shadowBlur: this.item.shadowBlur,
        shadowColor: this.item.shadowColor,
        fillBefore: this.item.fillBefore,
        fillAfter: this.item.fillAfter,
      };
    },
    // 文本动态属性
    textOtherValues() {
      let pScaleX = 1;
      let pScaleY = 1;
      if(this.isSub) {
        pScaleX = this.parentObj.scaleX;
        pScaleY = this.parentObj.scaleY;
      }
      return {
        scaleX: this.obj.scaleX * this.zoom * pScaleX,
        scaleY: this.obj.scaleY * this.zoom * pScaleY,
        color: this.item.color,
        visible: this.obj.visible,
      }
    },
    // 视频动态属性
    videoOtherValues() {
      let pScaleX = 1;
      let pScaleY = 1;
      if(this.isSub) {
        pScaleX = this.parentObj.scaleX;
        pScaleY = this.parentObj.scaleY;
      }
      console.log(pScaleX);
      return {
        scaleX: this.obj.scaleX * this.zoom * pScaleX,
        scaleY: this.obj.scaleY * this.zoom * pScaleY,
        visible: this.obj.visible,
      }
    },
    // 图形固定属性
    shapeAllValues() {
      return this.item.graphics;
    },
    shapeOtherValues() {
      let pScaleX = 1;
      let pScaleY = 1;
      if(this.isSub) {
        pScaleX = this.parentObj.scaleX;
        pScaleY = this.parentObj.scaleY;
      }
      return {
        scaleX: this.obj.scaleX * this.zoom * pScaleX,
        scaleY: this.obj.scaleY * this.zoom * pScaleY,
      }
    },
    clipIndex() {
      return this.item.clipIndex;
    }
  },
  methods: {
    update() {
      this.stage && this.stage.update();
    },
    setCanvasView() {
      let obj = this.obj.clone();
      obj.x = 0;
      obj.y = 0;
      obj.regX = 0;
      obj.regY = 0;
      console.log('setCanvasView', obj);
      var stage = new createjs.Stage(this.$refs.domTextCanvas);
      var image = new createjs.Bitmap('https://imgs.aixifan.com/content/2019_2_24/1.550976625128528E9.png?imageView2/1/w/200/h/110');
      // stage.addChild(obj);
      stage.addChild(image);
      setTimeout(()=>{
        stage.update();

      }, 5000)
    },
    addChild() {
      this.stage.removeAllChildren();
      switch(this.canvastype) {
        case 'text':
          this.addText();
          break;
        case 'video':
          this.addVideo();
          break;
        case 'shape':
          this.addShape();
          break;
        default:;
      }
      // let 
    },
    addText() {
      let text = this.textAllValues.text;
      let fontSize = this.textAllValues.fontSize;
      let fontFamily = this.textAllValues.fontFamily;
      let outline = this.textAllValues.outline;
      let outlineColor = this.textAllValues.outlineColor;
      let textObj = new createjs.Text(text, `normal ${fontSize}px ${fontFamily}`);
      textObj.set({
        x: 0,
        y: 0,
        color: this.textAllValues.color,
      })
      this.textObj = textObj;
      textObj.set(this.textOtherValues)
      this.stage.addChild(textObj);

    },
    setOtherValues() {
      this.textObj && this.textObj.set(this.textOtherValues) && this.update();
    },

    addVideo(){
      if(this.item.list && this.item.list[this.clipIndex]) {
        let bitmap = new createjs.Bitmap(this.item.list[this.clipIndex]);
        bitmap.set(this.videoOtherValues)
        // console.log(this.videoOtherValues);
        this.videoObj = bitmap;
        this.stage.addChild(bitmap);
      }
    },

    setOtherValuesVideo() {
      console.log(this.videoOtherValues);
      this.videoObj && this.videoObj.set(this.videoOtherValues) && this.update();
    },

    addShape() {
      let graphics = this.shapeAllValues;
      let {type, strokeWidth, stroke, fill} = graphics;
      let shape = new createjs.Shape();

      // 方形
      if (type === 'rect') {
        let {w, h, radius = 0, rRadius = 0} = graphics;
        shape.graphics.f(fill).drawRoundRect(-w / 2, -h / 2, w, h, rRadius);
        shape.setBounds(
          0,
          0,
          w,
          h
        );
        shape.set({
          regX: -w/2,
          regY: -h/2
        })
      // 圆形
      } else if (type === 'circle') {
        let {w, h, radius = 0} = graphics;
        shape.graphics.f(fill).drawCircle(0, 0, radius);
        shape.setBounds(
          0,
          0,
          radius * 2,
          radius * 2,
        );
        shape.set({
          regX: -radius,
          regY: -radius
        })
      } else if (type === 'ellipse') {
        let {w, h} = graphics;
        shape.graphics.f(fill).drawEllipse(0, 0, w, h);
        shape.setBounds(
          0,
          0,
          w,
          h,
        );
        shape.set({
          regX: -w/2,
          regY: -h/2
        })
      } else if (type === 'polyStar') {
        let { radius, sides, pointSize, angle } = graphics;
        shape.graphics.f(fill).drawPolyStar(0, 0, radius, sides, pointSize, angle);
        shape.setBounds(
          0,
          0,
          radius * 2,
          radius * 2
        );
        shape.set({
          regX: -radius,
          regY: -radius
        })
      }
      this.shape = shape;
      shape.set(this.shapeOtherValues);
      this.stage.addChild(shape);
    },
    setOtherValuesShape() {
      this.shape && this.shape.set(this.shapeOtherValues) && this.update()
    },
    setCanvasSize() {
      this.$refs.canvas.width = this.canvasSize.width;
      this.$refs.canvas.height = this.canvasSize.height;
      this.update();
    }
  },
  created() {
    
  },
  mounted() {
    console.log('this.item', this.item);
    this.canvas = this.$refs.canvas;
    this.stage = new createjs.Stage(this.canvas);
    this.addChild();
    createjs.Ticker.addEventListener("tick", ()=>{
      this.stage.update();
    });
  },
  watch: {
    textAllValues:{
      handler(){
        this.addChild();
      },
      deep: true
    },
    textOtherValues: {
      handler() {
        this.setOtherValues();
      },
      deep: true
    },
    clipIndex: {
      handler() {
        this.addChild();
      },
      deep: true,
    },
    videoOtherValues: {
      handler() {
        this.setOtherValuesVideo();
      },
      deep: true
    },
    shapeAllValues: {
      handler() {
        this.addChild();
      },
      deep: true,
    },
    shapeOtherValues: {
      handler() {
        this.setOtherValuesShape();
      },
      deep: true,
    },
    canvasSize: {
      handler() {
        this.setCanvasSize();
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
  .dom-bg-canvas{
    left:0;
    top: 0;
    opacity: 0.8
  }
</style>
