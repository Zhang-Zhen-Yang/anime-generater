<template>
  <div class="timeline-tween-item relative" ref="timeline-tween-item" @dblclick="addTween">
    <timelineTweenVideoLength v-if="anTween.type == 'video'" :item="anTween" :tween="tweenLocal"></timelineTweenVideoLength>
    <timelineTweensMoveBlock :topIndex="topIndex" :subIndex="subIndex" :tween="tweenLocal"></timelineTweensMoveBlock>
    <div
      v-for="t,index in tweenLocal"
      :style="{left: t.left}"
      :class="['absolute', 'tween-props-dot',topIndex == tlTopIndex && subIndex == tlSubIndex && index == tlTweenIndex? 'tween-props-dot-active' : '']" 
      @click="setActiveTween(index)"
      :data-index="index"
    >
      <div :class="['tween-props-dot-handle']">

      </div>
    </div>

    <table v-if="false" class="timeline-tween-item-table" cellspacing="0" cellpadding="0" style="width:100%;table-layout: fixed;">
      <tr>
        <td style="width:0;"></td>
        <td v-for="t,index in tweenLocal" :class="['relative']" :style="{whiteSpace:'nowrap',width: t.width}">
          <div v-if="t.action=='to'" :class="['tween-action', 'tween-to-action', topIndex == tlTopIndex && subIndex == tlSubIndex ? 'tween-to-action-active' : '']">
            <div
              :class="['tween-action-dot', 'tween-to-action-dot', topIndex == tlTopIndex && subIndex == tlSubIndex && index == tlTweenIndex? 'tween-action-dot-active' : '']"
              @click="setActiveTween(index)"
            >
              <!--{{ t.action }}-->
            </div>
          </div>
          <div v-if="t.action=='wait'" :class="['tween-action', 'tween-wait-action', topIndex == tlTopIndex && subIndex == tlSubIndex ? 'tween-wait-action-active' : '']">
            <div
              :class="['tween-action-dot', 'tween-wait-action-dot', topIndex == tlTopIndex && subIndex == tlSubIndex && index == tlTweenIndex ? 'tween-action-dot-active' : '']"
               @click="setActiveTween(index)"
            >
              {{ t.action }}
            </div>
          </div>
        </td>
        <td></td>
      </tr>
    </table>
    <!--
    {{ anTween.type }} {{duration }}
    -->
  </div>
</template>

<script>
import timelineTweensMoveBlock from './timelineTweensMoveBlock.vue';
import timelineTweenVideoLength from './timelineTweenVideoLength.vue';
export default {
  name: 'timeline-tween-item',
  components: {timelineTweensMoveBlock, timelineTweenVideoLength},
  props: {
    anTween: {
      type: Object,
      default() {
        return {
          type: 'none',
          tween: []
        }
      }
    },
    topIndex: {
      type: Number,
      default: -1
    },
    subIndex: {
      type: Number,
      default: -1
    },


  },
  data () {
    return {
      msg: 'timeline-tween-item',
      dragging: false,
    }
  },
  computed: {
    tl() {
      return this.$store.state.tl;
    },
    showTweensMoveBlock() {
      return this.tl.showTweensMoveBlock;
    },
    tlDuration() {
      return this.tl.duration;
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
    timeline(){
      return this.$store.state.timeline;
    },
    duration() {
      return this.timeline? this.timeline.duration : 0
    },
    tween() {
      return this.anTween.tween || [];
    },
    tweenLocal() {
      return this.tween.map((item)=>{
        let action = item.action;
        let time = item.time || 0;
        // console.error('************************',time / this.tlDuration);
        let width = (time / this.tlDuration) * 100 + '%';
        let bgColor;
        switch(action){
          case 'wait':
            bgColor = '#FECEB7';
            break;
          case 'to':
            bgColor = '#EBCAFE';
            break;
          default: break;
        }
        return {
          action,
          width,
          bgColor,
          left: width,
        }
      })
    }
  },
  methods: {
    as() {
      this.$store.dispatch('addStep');
    },
    // 绑定拖动事件
    bindDraggable() {
      let thisTimelineTweenItem = this.$refs['timeline-tween-item'];
      if(thisTimelineTweenItem) {
        /*try{
          $(thisTimelineTweenItem).find('.tween-props-dot').draggable('disable');
        } catch(e){

        }*/
      }
      $(thisTimelineTweenItem).find('.tween-props-dot').draggable({
        containment: 'parent',
        axis: 'x',
        start: () => {
          this.dragging = true;
        },
        stop: (e, ui) => {
          this.as();
          let left = ui.position.left;
          let totalWidth = (this.$refs['timeline-tween-item'].clientWidth);
          let position = left / totalWidth * this.tlDuration;
          // console.log(position);
          let tweenIndex = $(e.target).data('index');
          this.tween[tweenIndex].time = position;
          // console.log();
          this.dragging = false;
          let topIndex = this.topIndex;
          let subIndex = this.subIndex;
          this.$store.dispatch('updateTween', {topIndex, subIndex});

          this.$store.dispatch('setActiveTweenVer2', {t: this.tween[tweenIndex], topIndex, subIndex, tweenIndex});
          // alert('kkk');
        },
        drag: (e, ui) => {
          // let left = ui.position.left;
        }
      })
      
    },
    // 当前选中的补间
    setActiveTween(index) {
      let topIndex = this.topIndex;
      let subIndex = this.subIndex;
      this.$store.dispatch('setActiveTweenVer2', {t: this.tween[index], topIndex, subIndex, tweenIndex: index});
    },
    // 添加缓动
    addTween(e) {
      let offsetX = e.offsetX;
      let totalWidth = (this.$refs['timeline-tween-item'].clientWidth);
      let position = offsetX / totalWidth * this.tlDuration;

      this.$store.dispatch('addTween', {topIndex: this.topIndex, subIndex: this.subIndex, position});

      // console.log(position);
    }
  },
  mounted() {
    this.bindDraggable();
  },
  created() {
    
  },
  watch:{
    tweenLocal: {
      deep: true,
      handler(nval) {
        this.$nextTick(()=>{
          this.bindDraggable();
        })
      }
    }
  }
}
</script>

<style lang="scss">
  .timeline-tween-item{
    height: 100%;
  }
  /*.timeline-tween-item-table{
    vertical-align: middle;
    height: 24px;
  }
  .tween-action {
    width: 100%;
    height: 100%;
    // background-color: red;
  }
  .tween-to-action, .tween-wait-action{
    display: inline-block;
    width: 100%;
    // border-bottom: 1px solid rgba(255,255,255, 0.1);
    position:relative;
    // height: 20px;
    // background-color: rgba(0,0,0,0.5);
  }
  .tween-action-dot{
    cursor: move;
  }
  .tween-action-dot-active{
    background-color: #6ECEDF!important;
  }
  .tween-to-action-dot{
    position: absolute;
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    top: 10px!important;
    transform: rotate(45deg);
  }
  .tween-wait-action{

  }
  .tween-wait-action-dot{
    position: absolute;
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: rgba(255, 255, 255, 0.5);
    top: 10px!important;
    transform: rotate(45deg);
  }
  .tween-to-action-active{
    background-color: rgba(0, 0, 0, 0.2)
  }
  .tween-wait-action-active{
    background-color: rgba(255, 255, 255, 0.1)
  }*/


  .tween-props-dot{
    width: 0px;
    height: 0px;
    background-color: rgba(255, 255, 255,0.5);
    border-radius: 50%;
    top: 50%!important;
    transform: translate(0, -50%);
    cursor: move;
    .tween-props-dot-handle{
      width: 10px;
      height: 10px;
      background-color: rgba(255, 255, 255,0.5);
      border-radius: 50%;
      left: -5px;
      top: -5px;
      position: absolute;
    }
  }
  .tween-props-dot-active{
    background-color: #6ECEDF;
    .tween-props-dot-handle{
      background-color: #6ECEDF;
    }

  }



</style>
