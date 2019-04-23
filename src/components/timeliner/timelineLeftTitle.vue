<template>
  <div class="timeline-left-title" @dragover="dragover" @drop.stop="drop">
    <div class="voice-layers bg-preset tts-icon">
      语音合成
    </div>
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
                  <td style="width: 1.5em;line-height: 15px;">
                    <!--是否作为遮罩使用-->
                    <div
                      v-if="item.type=='shape'"
                      :class="['clip-icon', 'bg-preset', 'pointer', item.asMask ? '' : 'clip-icon-no-asmask']"
                      title="作为罩遮"
                      @click.stop="toggleAsMask(item)">
                    </div>
                  </td>
                  <td style="overflow:hidden;text-overflow:ellipsis;" @dblclick="setFocusIndex({e: $event, indexs: [index, -1]})">
                    <span v-if="!(focusIndex[0] == index && focusIndex[1] == -1)">{{ item.layerName }} <!--{{ isDropToContainer }}--></span>
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
          <div style="background-color:rgba(0,0,0,0);" :class="['drag-over-half', dargoverMaskPosition==0?'drag-over-half-top' : '']" @dragover="dargoverMaskPosition=0" @dragmove="dargoverMaskPosition=0">
            <!--{{ item.type=='container'&&dragoverMaskIndex == index && dragoverMaskSubIndex == -1&&dargoverMaskPosition==1 }}-->
          </div>
          <div style="background-color:rgba(255,0,0,0);" :class="['drag-over-half', dargoverMaskPosition==1 && !isDropToContainer?'drag-over-half-bottom' : '']" @dragover="dargoverMaskPosition=1" @dragmove="dargoverMaskPosition=1">


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
                  <td style="width: 2.5em;vertical-align:middle;line-height: 15px;padding-left:10px;">
                    <!--是否作为遮罩使用-->
                    <div
                      v-if="c.type=='shape'"
                      :class="['clip-icon', 'bg-preset', 'pointer', c.asMask ? '' : 'clip-icon-no-asmask']"
                      title="作为罩遮"
                      @click.stop="toggleAsMask(c)">
                    </div>
                  </td>
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
            <div v-if="dragoverMaskIndex == index && dragoverMaskSubIndex == cindex" class="drag-over-mask-sub" style="background-color: rgba(255, 0, 0, 0)">
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
      // alert(item.type == 'shape');
      if(item.type =='shape' && item.asMask) {

      } else {
        item.obj.set({
          visible: !item.visible
        })
      }
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
      // console.error(e.pageX);
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

      let dropInNoneContainer = false;
      if(this.layers[dragoverMaskIndex] && this.layers[dragoverMaskIndex].type=='container' &&dragoverMaskSubIndex == -1&&dargoverMaskPosition==1&&this.isDropToContainer) {
        // alert('yes');
        dragoverMaskSubIndex = this.layers[dragoverMaskIndex].children.length;// - 1;
        dargoverMaskPosition = 0;
        if(this.layers[dragoverMaskIndex].children.length == 0) {
          dropInNoneContainer = true;
        }
      }
      

      this.$store.dispatch('swipeChild',{
        fromIndex,
        fromSubIndex,
        toIndex: dragoverMaskIndex,
        toSubIndex: dragoverMaskSubIndex,
        position: dargoverMaskPosition,
        dropInNoneContainer,
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
    },
    // 切换是否作为遮罩
    toggleAsMask(item) {
      item.asMask = !item.asMask;
      this.$store.dispatch('checkAsMask', {layers: this.$store.state.project.layers});
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

  .clip-icon{
    display: inline-block;
    width: 20px;
    height: 18px;
    margin-top: 2px;
    
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M765.091 213.382L223.418 754.967V213.382H765.09zm-500.51 582.72l541.877-541.819v541.819H264.582zM79.42 213.586c.29 0 .524-.204.815-.204h85.003v611.81c0 .408-.174.757-.145 1.164.64 16.146 14.225 28.8 30.4 28.131.29 0 .524-.174.815-.203H806.43v87.272c0 .408-.174.756-.145 1.164a29.178 29.178 0 1 0 58.297-1.134v-.234c0-.29.204-.58.175-.93 0-.233-.116-.378-.145-.582v-85.528h86.924c.406 0 .785.205 1.221.175a29.324 29.324 0 1 0-2.298-58.589c-.29.029-.524.204-.815.204h-85.032v-600l78.254-78.255a29.003 29.003 0 0 0 8.728-21.76 29.295 29.295 0 0 0-30.4-28.131 28.974 28.974 0 0 0-20.77 10.066l-77.15 77.178H223.418V67.928c0-.408.204-.728.204-1.135a29.178 29.178 0 0 0-58.327 1.135h-.058v.203c0 .32-.146.61-.146.931 0 .233.146.407.146.64v85.528H78.4c-.436 0-.815-.263-1.25-.234a29.295 29.295 0 1 0 2.268 58.59z' fill='%23d81e06'/%3E%3C/svg%3E");
  }
  .clip-icon-no-asmask{
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M765.091 213.382L223.418 754.967V213.382H765.09zm-500.51 582.72l541.877-541.819v541.819H264.582zM79.42 213.586c.29 0 .524-.204.815-.204h85.003v611.81c0 .408-.174.757-.145 1.164.64 16.146 14.225 28.8 30.4 28.131.29 0 .524-.174.815-.203H806.43v87.272c0 .408-.174.756-.145 1.164a29.178 29.178 0 1 0 58.297-1.134v-.234c0-.29.204-.58.175-.93 0-.233-.116-.378-.145-.582v-85.528h86.924c.406 0 .785.205 1.221.175a29.324 29.324 0 1 0-2.298-58.589c-.29.029-.524.204-.815.204h-85.032v-600l78.254-78.255a29.003 29.003 0 0 0 8.728-21.76 29.295 29.295 0 0 0-30.4-28.131 28.974 28.974 0 0 0-20.77 10.066l-77.15 77.178H223.418V67.928c0-.408.204-.728.204-1.135a29.178 29.178 0 0 0-58.327 1.135h-.058v.203c0 .32-.146.61-.146.931 0 .233.146.407.146.64v85.528H78.4c-.436 0-.815-.263-1.25-.234a29.295 29.295 0 1 0 2.268 58.59z' fill='%23ffffff'/%3E%3C/svg%3E");
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
  .voice-layers{
    height: 25px;
    line-height: 24px;
    border-bottom: 1px solid #525252;
    width: 100%;
    padding-left: 18px;
  }
  .tts-icon{
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1746 1024' xmlns='http://www.w3.org/2000/svg' width='341.016' height='200'%3E%3Cpath d='M120.47 0h1505.883a120.47 120.47 0 0 1 120.47 120.47v783.06a120.47 120.47 0 0 1-120.47 120.47H120.47A120.47 120.47 0 0 1 0 903.53V120.47A120.47 120.47 0 0 1 120.47 0zm30.118 120.47a30.118 30.118 0 0 0-30.117 30.118v722.824a30.118 30.118 0 0 0 30.117 30.117h1445.647a30.118 30.118 0 0 0 30.118-30.117V150.588a30.118 30.118 0 0 0-30.118-30.117H150.588zm100.292 189.5h387.614v66.26H483.448v406.829h-77.522v-406.83H250.88v-66.258zm407.492 0h387.614v66.26H890.94v406.829h-77.523v-406.83H658.372v-66.258zm610.906-9.275c55.658 0 99.388 11.264 130.53 34.454 33.13 24.516 52.344 62.946 56.983 114.628h-76.86c-6.627-29.154-19.216-50.357-36.443-62.946-17.227-13.252-43.73-19.215-78.185-19.215-29.817 0-52.345 3.976-68.247 12.59-19.878 9.938-29.154 26.503-29.154 49.03 0 19.878 10.602 36.443 33.13 48.37 9.938 5.3 37.104 15.24 80.835 29.154 64.271 19.877 105.352 35.78 123.904 46.38 41.08 24.516 61.621 58.308 61.621 102.04 0 42.405-16.565 76.197-49.694 100.713-33.13 23.853-80.173 36.442-140.469 36.442-58.308 0-104.026-11.264-136.493-33.792-39.755-27.829-61.62-71.56-64.934-131.855h76.86c5.301 35.78 17.89 61.62 38.43 76.86 18.553 13.252 47.044 20.54 86.137 20.54 34.455 0 62.283-5.963 82.161-17.227 19.878-11.926 30.48-27.166 30.48-47.044 0-25.178-15.24-45.056-44.394-59.633-9.276-4.638-39.756-15.24-92.1-31.141-58.308-18.553-94.75-31.804-108.664-39.755-36.443-21.866-54.333-53.67-54.333-95.413 0-41.743 17.228-74.873 53.007-98.726 33.13-23.19 74.873-34.454 125.892-34.454z' fill='%231296db'/%3E%3C/svg%3E");
    background-size: auto 16px;
    background-position: 80px center;
  }
</style>
