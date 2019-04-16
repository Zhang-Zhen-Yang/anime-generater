<template>
  <div class="tweens-move-block" :style="style" ref="tweensMoveBlock" v-show="showTweensMoveBlock">
    <!--{{ showTweensMoveBlock }}-->
  </div>
</template>

<script>
export default {
  name: 'tweensMoveBlock',
  props: {
    topIndex: {
      type: Number,
      default: -1
    },
    subIndex: {
      type: Number,
      default: -1
    },
    tween: {
      type: Array,
      default() {
        return [
          {
            left:0,
          }
        ]
      }
    }
  },
  data () {
    return {
      msg: 'tweensMoveBlock',
      dragging: false,
      dragStartPositionList: [],
    }
  },
  computed: {
    project() {
      return this.$store.state.project;
    },
    currentTween() {
      let currentTween = this.subIndex > -1 ? this.project.layers[this.topIndex].children[this.subIndex].tween : this.project.layers[this.topIndex].tween;
      return currentTween;
    },
    tl() {
      return this.$store.state.tl;
    },
    tlDuration() {
      return this.tl.duration;
    },
    showTweensMoveBlock() {
      return this.tl.showTweensMoveBlock;
    },
    tweenNumList() {
      return this.tween.map((item)=>{
        return parseFloat(item.left);
      });
    },
    style() {
      let min = Math.min.apply(null, this.tweenNumList);
      let max = Math.max.apply(null, this.tweenNumList);
      return {
        left: `${min}%`,
        width: `${max - min}%`,
        minWidth: '20px',
      }
    }
  },
  methods: {
    as() {
      this.$store.dispatch('addStep');
    },
  },
  created() {
    
  },
  mounted() {
    this.tweensMoveBlock = this.$refs.tweensMoveBlock;
    this.$tweensMoveBlock = $(this.tweensMoveBlock);
    this.$tweensMoveBlock.draggable({
      containment: 'parent',
      axis: 'x',
      start: () => {
        this.dragging = true;
        this.as();
        this.dragStartPositionList = this.currentTween.map((item)=>{
          return item.time;
        })
      },
      stop: (e, ui) => {
        this.dragging = false;
        this.$store.dispatch('updateTween', {topIndex: this.topIndex, subIndex: this.subIndex});
      },
      drag: (e, ui)=>{
        // console.log(ui);
        let originalPosition = ui.originalPosition;
        let position = ui.position;
        let totalWidth = this.$tweensMoveBlock.parent().width();
        let offset = position.left - originalPosition.left;

        let totalPosition = offset / totalWidth * this.tlDuration;
        console.log(totalPosition);
        console.log(this.dragStartPositionList);
        this.currentTween.forEach((item, index)=>{
          item.time = this.dragStartPositionList[index] + totalPosition;
        })

      },
    })
  }
}
</script>

<style lang="scss">
  .tweens-move-block{
    position: absolute;
    top: 1px;
    height: 23px;
    background-color: rgba(255, 195, 25, 0.5);
    cursor: move;
  }
</style>
