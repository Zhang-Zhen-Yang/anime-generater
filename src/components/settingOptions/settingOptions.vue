<template>
  <block-slice slot="e" dir="vertical" :staticIndex="0" :staticValue="35 + 'px'">
    <div id="setting-options-title" slot="s">
      title
    </div>
    <div id="setting-options-content" slot="e">
      deee
     
      <hr>
      {{ tlTopIndex }}
      <hr>
      <img v-if="cLayer.type=='image'" :src="cLayer.pic_url" alt="" style="max-width: 100%;">
      {{ cLayer.type }}
      {{ cLayer.tween.length }}
    </div>
  </block-slice>
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
    tl() {
      return this.$store.state.tl;
    },
    layers() {
      return this.$store.state.project.layers;
    },
    currentTween() {
      return this.tl.currentTween;
    },
    tlTopIndex() {
      return this.tl.topIndex;
    },
    tlSubIndex() {
      return this.tl.subIndex;
    },
    tlTweenIndex() {
      return this.tl.tweenIndex;
    },
    cLayer() {
      let cLayer = {};
      if(this.tlTopIndex > -1) {
        cLayer = {...this.layers[this.tlTopIndex]};
      }
      if(cLayer && cLayer.children && cLayer.children[this.tlSubIndex]) {
        cLayer = {...cLayer.children[this.tlSubIndex]};
      }
      return cLayer;
    }
  },
  methods: {

  },
  created() {
    
  },
}
</script>

<style lang="scss">
  #setting-options{
    
  }
  #setting-options-title{
    width: 100%;
    height: 100%;
    border-bottom: 1px solid #181818;
    padding: 0 10px;
    line-height: 34px;
  }
  #setting-options-title:after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: #484a4b;
  }
  #setting-options-content{
    padding: 10px;
  }
  
</style>
