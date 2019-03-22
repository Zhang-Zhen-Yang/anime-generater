<template>
  <div id="timeline-layer-tweens">
    <div v-for="item,index in layers"  :key="index">
      <div class="timeline-layer-tween">
        {{ item.type }}
      </div>
      <div v-if="item.type=='container' && item.tlShowChildren">
        <div class="timeline-layer-tween-child" v-for="cItem,cIndex in item.children">
          {{ cItem.type }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'temp',
  data () {
    return {
      msg: 'temp'
    }
  },
  computed: {
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
    
  }
  .timeline-layer-tween, .timeline-layer-tween-child{
    border-bottom: 1px solid #3D4041;
    height: 25px;
  }
</style>
