<template>
  <div class="context-menu" :style="style" v-if="contextMenu.show">
    <div v-for="item,index in menuItems" class="context-menu-item" @click="menuClick(item)">
      {{ item.label }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'context-menu',
  props: {
    
  },
  data () {
    return {
      msg: 'context-menu',
    }
  },
  computed: {
    contextMenu() {
      return this.$store.state.tl.contextMenu;
    },
    menuItems() {
      return this.contextMenu.menuItems;
    },
    yOffset() {
      return this.contextMenu.yOffset;
    },
    style() {
      return {
        left: this.contextMenu.x + 'px',
        top: this.contextMenu.y + this.yOffset + 'px',
      }
    },
    
  },
  methods: {
    bodyClick(e) {
      // console.log(e);
      this.contextMenu.show = false;
    },
    menuClick(item) {
      if(typeof this.contextMenu.callback == 'function') {
        this.contextMenu.callback(item.value);
      }
    }
  },
  created() {
    
  },
  mounted() {
    document.body.addEventListener('click', this.bodyClick, false);
  },
  destroyed() {
    document.body.addEventListener('click', this.bodyClick, false);
  }
}
</script>

<style lang="scss">
  .context-menu{
    background-color: #ffffff;
    display: inline-block;
    position: fixed;
    left: 0;
    top: 0;
    font-size: 14px;
  }
  .context-menu-item{
    // display: inline-block;
    padding: 5px 10px;
    cursor: pointer;
  }
</style>
