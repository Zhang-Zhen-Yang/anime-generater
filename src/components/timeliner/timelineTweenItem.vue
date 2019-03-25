<template>
  <div class="timeline-tween-item">
    <table class="timeline-tween-item-table" cellspacing="0" cellpadding="0" style="width:100%;table-layout: fixed;">
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
export default {
  name: 'timeline-tween-item',
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
      msg: 'timeline-tween-item'
    }
  },
  computed: {
    tl() {
      return this.$store.state.tl;
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
        }
      })
    }
  },
  methods: {
    // 绑定拖动事件
    bindDraggable() {
      $('.timeline-tween-item .tween-action-dot').draggable({
        containment: 'parent',
        axis: 'x',
      })
    },
    // 当前选中的补间
    setActiveTween(index) {
      let topIndex = this.topIndex;
      let subIndex = this.subIndex;
      this.$store.dispatch('setActiveTween', {t: this.tween[index], topIndex, subIndex, tweenIndex: index})
    }
  },
  mounted() {
    this.bindDraggable();
  },
  created() {
    
  },
}
</script>

<style lang="scss">
  .timeline-tween-item{
    
  }
  .timeline-tween-item-table{
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
  }
</style>
