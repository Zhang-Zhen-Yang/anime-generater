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
        <td>
          <div class="history-zoom-divider"></div>
        </td>
        <td>
          <div id="zoom-in" class="action-item bg-preset pointer" :title="`放大`" @click="setZoom(0)">
          </div>
        </td>
        <td style="width: 40px;color:#1296db;">
            {{zoom * 100}}%
        </td>
        <td>
          <div id="zoom-out" class="action-item bg-preset pointer"  :title="`缩小`"  @click="setZoom(1)">
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
      msg: 'undoredo',
      zoomList: [
        0.1,
        0.2,
        0.3,
        0.4,
        0.5,
        0.6,
        0.7,
        0.8,
        0.9,
        1,
        1.2,
        1.5,
        2
      ]
    }
  },
  computed: {
    tl() {
      return this.$store.state.tl;
    },
    zoom:{
      get() {
        return this.$store.state.project.zoom;
      },
      set(val) {
        this.$store.state.project.zoom = val;
      }

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
    },
    setZoom(type) {
      // alert(type);
      let index = this.zoomList.indexOf(this.zoom);
      if(type == 0) {
        index += 1;
      } else {
        index -= 1;
      }
      // alert(index);
      if(this.zoomList[index]) {
        this.zoom = this.zoomList[index];
      }
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
      width: 220px;
    }
    table td{
      text-align: center;
      vertical-align: middle;
    }
    .action-item{
      width: 23px;
      height: 23px;
      display: inline-block;
      vertical-align: middle;
    }
    .history-zoom-divider{
      display: block;
      width: 2px;
      height: 18px;;
      background-color: #1296db;
    }
    #undo{
      background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3Cstyle/%3E%3C/defs%3E%3Cpath d='M289.638 256H614.4a307.2 307.2 0 1 1 0 614.4H204.8a51.2 51.2 0 0 1 0-102.4h409.6a204.8 204.8 0 1 0 0-409.6H286.003l59.239 59.238a51.2 51.2 0 1 1-72.448 72.346L128 345.242a51.2 51.2 0 0 1 0-72.448L272.794 128a51.2 51.2 0 0 1 72.448 72.397L289.638 256z' fill='%231296db'/%3E%3C/svg%3E");
    }
    #redo{
      background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3Cstyle/%3E%3C/defs%3E%3Cpath d='M737.997 256l-55.603-55.603A51.2 51.2 0 1 1 754.842 128l144.793 144.794a51.2 51.2 0 0 1 0 72.448L754.842 489.984a51.2 51.2 0 0 1-72.448-72.397l59.238-59.187H409.6a204.8 204.8 0 1 0 0 409.6h409.6a51.2 51.2 0 0 1 0 102.4H409.6a307.2 307.2 0 1 1 0-614.4h328.397z' fill='%231296db'/%3E%3C/svg%3E");
    }
    #zoom-in{
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M911.9 839.2l-161-160.9C871 517.7 838.2 290.1 677.5 170s-388.2-87.3-508.3 73.4C122.3 306.1 97 382.4 97 460.8 97 661.4 259.6 824 460.1 824c78.4 0 154.7-25.4 217.5-72.3l160.8 160.8c20.2 20.3 53.1 20.3 73.4.1 20.3-20.3 20.3-53.1.1-73.4zM408.2 408.9h-51.9c-28.7 0-51.9 23.2-51.9 51.9s23.2 51.9 51.9 51.9h51.9v51.9c0 28.7 23.2 51.9 51.9 51.9s51.9-23.2 51.9-51.9v-51.9h51.9c28.7 0 51.9-23.2 51.9-51.9s-23.2-51.9-51.9-51.9H512V357c0-28.7-23.2-51.9-51.9-51.9s-51.9 23.2-51.9 51.9v51.9zm51.9 311.3c-143.3 0-259.4-116.1-259.4-259.4s116.1-259.4 259.4-259.4 259.4 116.1 259.4 259.4-116.1 259.4-259.4 259.4z' fill='%231296db'/%3E%3C/svg%3E");
    }
    #zoom-out{
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M911.8 839.7L750.9 678.8c120.1-160.6 87.3-388.2-73.4-508.3s-388.2-87.3-508.3 73.4C122.4 306.7 97 383 97 461.4c0 200.5 162.6 363.1 363.1 363.1 78.4 0 154.7-25.4 217.5-72.3L838.4 913c20.2 20.3 53.1 20.3 73.4.1s20.3-53.1 0-73.4zm-451.7-119c-143.2 2-261-112.4-263-255.7s112.4-261 255.7-263h7.3c143.2 0 259.4 116.1 259.4 259.4S603.4 720.7 460.1 720.7zM304.5 461.4c0 28.6 23.2 51.9 51.9 51.9h207.5c28.6 0 51.9-23.2 51.9-51.9 0-28.6-23.2-51.9-51.9-51.9H356.4c-28.7 0-51.9 23.2-51.9 51.9z' fill='%231296db'/%3E%3C/svg%3E");
    }
  }
</style>
