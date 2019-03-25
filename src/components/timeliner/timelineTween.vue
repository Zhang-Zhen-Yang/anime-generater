<template>
  <div id="timeline-layer-tweens" :style="{width: width, left: left}">
    <div v-for="item,index in layers"  :key="index">
      <div class="timeline-layer-tween">
        <timelineTweenItem :anTween="item" :topIndex="index">
        </timelineTweenItem>
      </div>
      <!--子元素-->
      <div v-if="item.type=='container' && item.tlShowChildren">
        <div class="timeline-layer-tween-child" v-for="cItem,cIndex in item.children">
          <timelineTweenItem :anTween="cItem" :topIndex="index" :subIndex="cIndex">
          </timelineTweenItem>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import timelineTweenItem from './timelineTweenItem';
export default {
  name: 'timeline-layer-tweens',
  components: {timelineTweenItem},
  data () {
    return {
      msg: 'temp'
    }
  },
  computed: {
    tl() {
      return this.$store.state.tl;
    },
    scale() {
      return this.tl.scale;
    },
		offsetX() {
      return this.tl.offsetX;
    },
    width() {
      return (1 / this.scale) * 100 + '%'
    },
    left() {
      return -(this.offsetX * 1 / this.scale)* 100 + '%'
    },
    activeLayerIndex() {
      return this.$store.state.activeLayerIndex;
    },
    project() {
      return this.$store.state.project;
    },
    layers() {
      return this.project.layers;
    }
  },
  methods: {

  },
  created() {
    
  },
}
</script>

<style lang="scss">
  #timeline-layer-tweens{
    position: relative;
  }
  .timeline-layer-tween, .timeline-layer-tween-child{
    border-bottom: 1px solid #3D4041;
    height: 25px;
  }
</style>
