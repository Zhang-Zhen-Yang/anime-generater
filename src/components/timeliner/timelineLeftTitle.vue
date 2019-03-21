<template>
  <div class="timeline-left-title" @dragover="dragover" @drop="drop">
    <div  v-for="item,index in layers" class="layers" :key="index">

      <div @click="setActiveLayer([index])"
        @dragstart="dragStart($event, item, index)"
        draggable="true"
        :data-index="index"
        :class="['layer'+index,'timeline-layer-title', activeLayerIndex.length == 1 && activeLayerIndex[0] == index ? 'activeLayer' : '']"
      >
        <div class="relative" @dragover="dragoverMask(index)">
          <block-slice dir="horizontal" :staticIndex="1" :staticValue="50 + 'px'">
            <div slot="e" style="overflow:hidden;text-overflow:ellipsis; ">
              &emsp;&nbsp;{{ item.type }}{{ item.UUID }}
            </div>
            <div slot="s">
              <table cellspacing="0" cellpadding="0" style="width:100%;">
                <tr>
                  <td class="center">
                    <div class="pointer" @click.stop="toggleVisible(item)" style="width: 25px;">
                      {{item.visible ? '·' : '×'}}
                    </div>
                  </td>
                  <td class="center">
                    <div class="pointer" @click.stop="toggleEditable(item)" style="width: 25px;">
                      {{item.editable ? '·' : '×'}}
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </block-slice>
          <!-- 用于检测是否有元素拖动到该图层上 --->
          <div v-if="dragoverMaskIndex == index" class="drag-over-mask" style="">
            <div :class="['drag-over-half', dargoverMaskPosition==0?'drag-over-half-top' : '']" @dragover="dargoverMaskPosition=0"></div>
            <div :class="['drag-over-half', dargoverMaskPosition==1?'drag-over-half-bottom' : '']" @dragover="dargoverMaskPosition=1"></div>
          </div>
        </div>
        <!--container 显示子元素 隐藏子元素 的三角图标-->
        <div
          v-if="item.type == 'container'"
          :class="['pointer','sub-layer-trigger', 'down-icon']"
          :style="{transform: `rotate(${item.tlShowChildren ? '0deg': '-90deg'})`}"
          @click="toggleShowChild(item)"
        ></div>
        <!--子层-->
        <div v-if="item.type=='container' && item.tlShowChildren" style="" class="timeline-layer-title-child-wrap">
          <div v-for="c,cindex in item.children" :key="cindex">
            <div @click.stop="setActiveLayer([index, cindex])" :class="['timeline-layer-title-child', activeLayerIndex.length == 2 && activeLayerIndex[0] == index && activeLayerIndex[1] == cindex? 'activeLayer' : '']">
              &emsp;&emsp;{{ c.type }}
            </div>
          </div>
        </div>
      
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'timeline-left-title',
  props: {
    layers: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data () {
    return {
      msg: 'timeline-left-title',
      // 第几个图层
      dragoverMaskIndex: -1,
      // 图层的上面还是下面
      dargoverMaskPosition: 0,
    }
  },
  computed: {
    activeLayerIndex() {
      return this.$store.state.activeLayerIndex;
    }
  },
  methods: {
    toggleShowChild(item) {
      item.tlShowChildren = !item.tlShowChildren;
    },
    // 
    toggleVisible(item) {
      item.visible = !item.visible;
    },
    // 
    toggleEditable(item) {
      item.editable = !item.editable;
    },
    setActiveLayer(indexs) {
      this.$store.state.activeLayerIndex = indexs;
    },
    // 开始拖动
    dragStart(e, item, index) {
      console.log(e);
    },
    dragover(e) {
      e.preventDefault();
    },
    drop(e){
      e.preventDefault();
      console.log(e);
      this.dragoverMaskIndex = -1;
    },
    dragoverMask(index) {
      this.dragoverMaskIndex = index;
    }
  },
  created() {
    
  },
  mounted() {
    

  }
}
</script>

<style lang="scss">
  .timeline-layer-title,.timeline-layer-title-child{
    // height: 25px;
    border-top: 1px solid #525252;
    font-size: 14px;
    color: #CCCCCC;
    line-height: 25px;
    background-color: #444444;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
  }
  .timeline-layer-title.activeLayer,.timeline-layer-title-child.activeLayer{
    background-color: rgba(255,195,25,0.5);
  }
  .sub-layer-trigger{
    position: absolute;
    left: 2px;
    top: 5px;
    width: 15px;
    height: 15px;
    background-size: 80% auto;
    background-position: center;
    background-repeat: no-repeat;
    cursor:pointer;
    opacity: 0.8;
    
    &:hover{
      opacity: 1;
    }
  }

  
  .down-icon{
    background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3Cstyle/%3E%3C/defs%3E%3Cpath d='M941.808 195.931L512 828.07 82.192 195.93z' fill='%23ffffff'/%3E%3C/svg%3E");
  }



  /*drag-over-mask*/
  .drag-over-mask{
    position:absolute;
    width:100%;
    height: 100%;
    left: 0;
    top:0;
    // background-color: rgba(255,255,255,0.8)
  }
  .drag-over-half{
    width: 100%;
    height: 50%;
  }
  .drag-over-half-top{
    border-top: 2px solid red;
  }
  .drag-over-half-bottom{
    border-bottom: 2px solid red;
  }

</style>
