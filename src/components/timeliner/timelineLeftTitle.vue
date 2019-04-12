<template>
  <div class="timeline-left-title" @dragover="dragover" @drop="drop">
    <div  v-for="item,index in layers" class="layers" :key="index">

      <div @click="setActiveLayer([index])"
        @dragstart="dragStart($event, item, index)"
        draggable="true"
        :data-index="index"
        :class="['layer'+index,'timeline-layer-title', activeLayerIndex.length == 1 && activeLayerIndex[0] == index ? 'activeLayer' : '']"
      >
        <div class="relative" @dragover="dragoverMask(index, -1)" style="border-bottom:1px solid #525252;height:25px;">
          <block-slice dir="horizontal" :staticIndex="1" :staticValue="57 + 'px'">
            <!--图层名称-->
            <div slot="e" style="width: 100%;">
              <table cellspacing="0" cellpadding="0" style="table-layout:fixed;width: 100%">
                <tr>
                  <td style="width: 1.5em"></td>
                  <td style="overflow:hidden;text-overflow:ellipsis;" @dblclick="setFocusIndex({e: $event, indexs: [index, -1]})">
                    <span v-if="!(focusIndex[0] == index && focusIndex[1] == -1)">{{ item.layerName }} {{ isDropToContainer }}</span>
                    <input ref="layerNameInput" :data-index="index" @blur="focusIndex=[-1, -1]" v-show="focusIndex[0] == index && focusIndex[1] == -1" class="layer-name-input" type="text" v-model="item.layerName">
                  </td>
                </tr>
              </table>
             
            </div>
            <!--图层的显示，隐藏;锁定图层-->
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
                  <td style="width: 5px;">
                  </td>
                </tr>
              </table>
            </div>
          </block-slice>
          
        </div>
        <!--container 显示子元素 隐藏子元素 的三角图标-->
        <div
          v-if="item.type == 'container'"
          :class="['pointer','sub-layer-trigger', 'down-icon']"
          :style="{transform: `rotate(${item.tlShowChildren ? '0deg': '-90deg'})`}"
          @click="toggleShowChild(item)"
        ></div>
        <!-- 用于检测是否有元素拖动到该图层上 --->
        <div v-if="dragoverMaskIndex == index && dragoverMaskSubIndex == -1" class="drag-over-mask" style="">
          <div style="background-color:rgba(0,0,0,0.1);" :class="['drag-over-half', dargoverMaskPosition==0?'drag-over-half-top' : '']" @dragover="dargoverMaskPosition=0" @dragmove="dargoverMaskPosition=0">
            <!--{{ item.type=='container'&&dragoverMaskIndex == index && dragoverMaskSubIndex == -1&&dargoverMaskPosition==1 }}-->
          </div>
          <div style="background-color:rgba(255,0,0,0.1);" :class="['drag-over-half', dargoverMaskPosition==1 && !isDropToContainer?'drag-over-half-bottom' : '']" @dragover="dargoverMaskPosition=1" @dragmove="dargoverMaskPosition=1">


          </div>
        </div>
        <!---->
        <div v-if="item.type=='container'&&dragoverMaskIndex == index && dragoverMaskSubIndex == -1&&dargoverMaskPosition==1&&isDropToContainer"
          class="dropAsContainer"
          style="position:absolute;width: 100%;height: 2px;background-color: red;left: 35px;bottom: 0px;"
        ></div>
        <!---------------------------------------子层--------------------------------------------------------------------->
        <div v-if="item.type=='container' && item.tlShowChildren" style="" class="timeline-layer-title-child-wrap">

          <!--start sublist-->
          <div v-for="c, cindex in item.children"
            :key="cindex" style="height: 25px;position: relative;"
            @dragover="dragoverMask(index, cindex)"
            draggable="true"
            @dragstart="dragStartSub($event, item, index, cindex)"
          >
            <!--图层名称-->
            <div
              @click.stop="setActiveLayer([index, cindex])"
              :class="['timeline-layer-title-child', activeLayerIndex.length == 2 && activeLayerIndex[0] == index && activeLayerIndex[1] == cindex? 'activeLayer' : '']">
              <table cellspacing="0" cellpadding="0" style="table-layout:fixed;width: 100%">
                <tr>
                  <td style="width: 2.5em"></td>
                  <td style="overflow:hidden;text-overflow:ellipsis;" @dblclick.stop="setFocusIndex({e: $event, indexs: [index, cindex]})">
                    <span v-if="!(focusIndex[0] == index && focusIndex[1] == cindex)">
                      {{ c.layerName }}
                    </span>
                    <input :id="'input-'+index+'-'+cindex" ref="layerNameInputChild" :data-index="index+'-'+cindex" @blur="focusIndex=[-1, -1]" v-show="focusIndex[0] == index && focusIndex[1] == cindex" class="layer-name-input" type="text" v-model="c.layerName">
                  </td>
                  <td style="width:57px;">
                    <table cellspacing="0" cellpadding="0" style="width:100%;">
                      <tr>
                        <td class="center">
                          <div class="pointer" @click.stop="toggleVisible(c)" style="width: 25px;">
                            {{c.visible ? '·' : '×'}}
                          </div>
                        </td>
                        <td class="center">
                          <div class="pointer" @click.stop="toggleEditable(c)" style="width: 25px;">
                            {{c.editable ? '·' : '×'}}
                          </div>
                        </td>
                        <td style="width: 5px;">
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
             <!-- 子层用于检测是否有元素拖动到该图层上 --->
            <div v-if="dragoverMaskIndex == index && dragoverMaskSubIndex == cindex" class="drag-over-mask-sub" style="background-color: rgba(255, 0, 0, 0.2)">
              <div :class="['drag-over-half', dargoverMaskPosition==0?'drag-over-half-top' : '']" @dragover="dargoverMaskPosition=0" @dragmove.stop="dargoverMaskPosition=0"></div>
              <div :class="['drag-over-half', dargoverMaskPosition==1?'drag-over-half-bottom' : '']" @dragover="dargoverMaskPosition=1" @dragmove.stop="dargoverMaskPosition=1"></div>
            </div>
          </div>
          <!--end sub list-->
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
      dragoverMaskSubIndex: -1,
      // 图层的上面还是下面
      dargoverMaskPosition: 0,
      focusIndex: [-1, -1],
      // 移动层时鼠标的x坐标
      dragStartPageX: 0,
      dragOverPageX: 0,
    }
  },
  computed: {
    activeLayerIndex() {
      return this.$store.state.activeLayerIndex;
    },
    isDropToContainer() {
      return this.dragOverPageX - this.dragStartPageX > 35;
    },
  },
  methods: {
    // 设置要修改哪个层的名字
    setFocusIndex({e, indexs}) {
      // console.log(indexs);
      this.focusIndex = indexs;
      if(indexs[1] > -1) {
        this.$nextTick(()=>{
          let targetInput = document.getElementById(`input-${indexs[0]}-${indexs[1]}`);
          targetInput && targetInput.focus();
        })
      } else {
        this.$nextTick(()=>{
        let targetInput = this.$refs.layerNameInput[indexs[0]];
        // console.log(targetInput);
          targetInput.focus();
        })
      }
    },
    toggleShowChild(item) {
      item.tlShowChildren = !item.tlShowChildren;
    },
    // 
    toggleVisible(item) {
      item.obj.set({
        visible: !item.visible
      })
      item.visible = !item.visible;
    },
    // 
    toggleEditable(item) {
      item.editable = !item.editable;
    },
    setActiveLayer(indexs) {
      // alert(typeof indexs);
      this.$store.state.activeLayerIndex = indexs;
      this.$store.state.tl.topIndex = typeof indexs[0] == 'number' ?　indexs[0]: -1;
      this.$store.state.tl.subIndex = typeof indexs[1] == 'number' ? indexs[1] : -1;
      this.$store.state.tl.tweenIndex = -1;
      this.$store.state.tl.currentTween = null;
    },
    // 开始拖动
    dragStart(e, item, index) {
      console.error(e.pageX);
      this.dragStartPageX = e.pageX;
      e.dataTransfer.setData('index', index);
      e.dataTransfer.effectAllowed = "allow";
      console.log(e);
    },
    dragStartSub(e, item, index,cindex){
      // alert([index, cindex]);
      e.stopPropagation();
      e.dataTransfer.setData('index', [index, cindex].join(','));
    },
    dragover(e) {
      this.dragOverPageX = e.pageX;
      e.preventDefault();
    },
    
    drop(e){
      e.preventDefault();
      console.log(e);
      let fromIndexs = e.dataTransfer.getData('index').split(',');
      console.log('fromIndexsfromIndexsfromIndexs', fromIndexs);
      let fromIndex = parseInt(fromIndexs[0]);
      let fromSubIndex = parseInt(fromIndexs[1] || -1);
      let dragoverMaskIndex = this.dragoverMaskIndex;
      let dragoverMaskSubIndex = this.dragoverMaskSubIndex;
      let dargoverMaskPosition = this.dargoverMaskPosition;

      if(this.layers[dragoverMaskIndex] && this.layers[dragoverMaskIndex].type=='container' &&dragoverMaskSubIndex == -1&&dargoverMaskPosition==1&&this.isDropToContainer) {
        // alert('yes');
        dragoverMaskSubIndex = this.layers[dragoverMaskIndex].children.length - 1;

      }
      

      this.$store.dispatch('swipeChild',{
        fromIndex,
        fromSubIndex,
        toIndex: dragoverMaskIndex,
        toSubIndex: dragoverMaskSubIndex,
        position: dargoverMaskPosition,
      })
      // alert(fromIndex);
      this.dragoverMaskIndex = -1;
    },
    dragoverMask(index, subIndex) {
      console.log([index, subIndex]);
      this.dragoverMaskIndex = index;
      this.dragoverMaskSubIndex = subIndex;
    },
    dropInOuter(e) {
      this.drop(e);
    },
    cancelDrop() {
      // alert('cancelDrop');
      this.dragoverMaskIndex = -1;
    }
  },
  created() {
    
  },
  mounted() {
    document.body.addEventListener('drop', this.cancelDrop, false);
  },
  destroyed() {
    document.body.removeEventListener('drop', this.cancelDrop, false);
  }
}
</script>

<style lang="scss">
  .timeline-layer-title,.timeline-layer-title-child{
    // height: 25px;
    // border-bottom: 1px solid #525252;
    font-size: 14px;
    color: #CCCCCC;
    line-height: 25px;
    // background-color: #444444;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
  }
  .timeline-layer-title-child{
    border-bottom: 1px solid #525252;
    height: 25px;
    // background-color: red;
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
  .drag-over-mask,.drag-over-mask-sub{
    position:absolute;
    width:100%;
    height: 100%;
    left: 0;
    top:0;
    // background-color: rgba(255,255,255,0.8)
  }
  .drag-over-mask-sub{
    left: 2em;
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

  .layer-name-input{
    background: #57595a;
    border: 1px solid #2f3132;
    color: #fff;
    padding: 2px 5px;
    width: 100%;
    &:focus{
      outline: none;
    }
  }

</style>
