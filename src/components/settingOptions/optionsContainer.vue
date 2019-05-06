<template>
  <div>
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
  name: 'optionsContainer',
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
      msg: 'optionsContainer'
    }
  },
  computed: {
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
  #temp{
    
  }
</style>
