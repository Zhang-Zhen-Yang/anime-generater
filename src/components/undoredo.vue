<template>
  <div id="undoredo">
    <table cellspacing="0" cellpadding="0">
      <tr>
        <td>
          <div id="undo" class="action-item bg-preset pointer" :title="`撤销${undoList.length}`" @click="undoredo(0)">
          </div>
        </td>
        <td>
          <div id="redo" class="action-item bg-preset pointer"  :title="`重做${redoList.length}`"  @click="undoredo(1)">
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'undoredo',
  data () {
    return {
      msg: 'undoredo'
    }
  },
  computed: {
    tl() {
      return this.$store.state.tl;
    },
    undoList() {
      return this.tl.undoList;
    },
    redoList() {
      return this.tl.redoList;
    },
  },
  methods: {
    undoredo(type) {
      this.$store.dispatch('undoredo', {type});
    }
  },
  created() {
    
  },
}
</script>

<style lang="scss">
  #undoredo{
    position: absolute;
    left: 110%;
    top: 10px;
    z-index: 1;
    table{
      width: 80px;
    }
    table td{
      text-align: center;
    }
    .action-item{
      width: 25px;
      height: 25px;
      display: inline-block;
    }
    #undo{
      background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3Cstyle/%3E%3C/defs%3E%3Cpath d='M289.638 256H614.4a307.2 307.2 0 1 1 0 614.4H204.8a51.2 51.2 0 0 1 0-102.4h409.6a204.8 204.8 0 1 0 0-409.6H286.003l59.239 59.238a51.2 51.2 0 1 1-72.448 72.346L128 345.242a51.2 51.2 0 0 1 0-72.448L272.794 128a51.2 51.2 0 0 1 72.448 72.397L289.638 256z' fill='%231296db'/%3E%3C/svg%3E");
    }
    #redo{
      background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3Cstyle/%3E%3C/defs%3E%3Cpath d='M737.997 256l-55.603-55.603A51.2 51.2 0 1 1 754.842 128l144.793 144.794a51.2 51.2 0 0 1 0 72.448L754.842 489.984a51.2 51.2 0 0 1-72.448-72.397l59.238-59.187H409.6a204.8 204.8 0 1 0 0 409.6h409.6a51.2 51.2 0 0 1 0 102.4H409.6a307.2 307.2 0 1 1 0-614.4h328.397z' fill='%231296db'/%3E%3C/svg%3E");
    }
  }
</style>
