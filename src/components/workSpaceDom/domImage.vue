<template>
  <img class="dom-image" :src="obj.image.src" :style="style"/>
</template>

<script>
export default {
  name: 'dom-image',
  props: {
    obj: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data () {
    return {
      msg: 'dom-image'
    }
  },
  computed: {
    style() {
      let left = this.obj.x;
      let top = this.obj.y;
      let width = this.obj.image.width * this.obj.scaleX;
      let height = this.obj.image.height * this.obj.scaleY;
      return {
        position: 'absolute',
        left: left - width / 2 + 'px',
        top:  top - height / 2 + 'px',
        width: width + 'px',
        height: height + 'px',
        transform: `rotate(${this.obj.rotation}deg)`
      }
    }
  },
  methods: {

  },
  created() {
    
  },
}
</script>

<style lang="scss">
  .dom-image{
    
  }
</style>
