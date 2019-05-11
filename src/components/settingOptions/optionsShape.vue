<template>
  <div>
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
          <td class="width1-4">
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
          <td class="width1-4">
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
          <td class="width1-4">
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
          <td class="width1-4">
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
          <td class="width1-4">
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
          <td class="width1-4">
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
          <td class="width1-4">
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
          <td class="width1-4">
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
          <td class="width1-4">
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
          <td class="width1-4">
            <span class="prop-name-x">fill</span>
          </td>
          <td>
            <color-picker title="颜色" v-model="shapeColor" :showTitle="false" @start="()=>{as();}">
            </color-picker>
          </td>
        </tr>
      </table>
      <table cellspacing="0" cellpadding="0" style="width: 100%;">
        <tr>
          <td>
              <checkbox v-model="fillBefore">
                &nbsp;缓动前显示
              </checkbox>
              
          </td>
          <td>
            <checkbox v-model="fillAfter">
              &nbsp;缓动后显示
            </checkbox>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'optionsShape',
  props: {
    cLayer: {
      type: Object,
      default() {
        return {};
      }
    },
    target: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data () {
    return {
      msg: 'optionsShape'
    }
  },
  computed: {
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
  },
  methods: {
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
 
</style>
