<template>
  <div id="timeline-pointer" class="relative" ref="timeline-pointer" :style="{width: width, left: left}">
    <div>
      <div v-for="item,index in ranges" :class="['timeline-display-label', item.sl? 'timeline-display-label-sl' : '' ]" :style="{left: (item.value / tlDuration * 100 )+'%' }">
        <div class="timeline-display-label-time" v-if="item.sl">
          {{ item.label }}
        </div>
        
      </div>
    </div>
    
    <div style="width: 0;" class="timeline-pointer-cursor-wrap" ref="timeline-pointer-cursor-wrap">
      <div class="timeline-pointer-cursor">
      </div>
      {{ width }} {{left }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'timeline-pointer',
  data () {
    return {
      msg: 'timeline-pointer',
      dragging: false,
    }
  },
  computed: {
    tl() {
      return this.$store.state.tl;
    },
    scale() {
      return this.tl.scale;
    },
		offsetX() {
      return this.tl.offsetX;
    },
    width() {
      return (1 / this.scale) * 100 + '%'
    },
    left() {
      return -(this.offsetX * 1 / this.scale)* 100 + '%'
    },
    // 时间轴 的总长
    tlDuration() {
      return this.tl.duration;
    },
    // 动画时长
    duration() {
      return 10000;
    },
    position() {
      return this.$store.state.position;
    },
    ranges() {
      let ranges = [];
      for(let i =0;i<=180;i++){
        let label = {
          label: i / 10+'s',
          sl: false,
          value: i *100,
        }
        if(i % 10 == 0) {
          label.sl = true;
        }
        ranges.push(label);
      }
      return ranges;
    },
    

  },
  methods: {
    setPosition() {
      let left = this.position / this.tlDuration * 100 + '%';
      this.$refs['timeline-pointer-cursor-wrap'].style.left = left;
    }
  },
  created() {
    
  },
  mounted() {
    $(()=>{
      $('.timeline-pointer-cursor-wrap').draggable({
        axis: 'x',
        containment: '#timeline-pointer',
        start: () => {
          this.dragging = true;
        },
        stop: (e, ui) => {
          console.log(ui);
          this.dragging = false;
          this.setPosition();
        },
        drag: (e, ui) => {
          let left = ui.position.left;
          let totalWidth = this.$refs['timeline-pointer'].clientWidth;
          let position = parseInt(left / totalWidth * this.tlDuration);
          console.log(position);
          window.timeline.setPosition(position);
        }
      })
    })
  },
  watch: {
    position(nVal, oVal) {
      if(!this.dragging) {
        this.setPosition();
      }
    }
  }
}
</script>

<style lang="scss">
  #timeline-pointer{
    // width: 200%;
    // left: -100%;
  }
  .timeline-pointer-cursor-wrap{
    position: absolute;
    // left:500px;
    top:0;
    opacity: 0.5;
    cursor:move;
  }
  .timeline-pointer-cursor-wrap:after{
    content: '';
    width: 1px;
    height: 1000px;
    position: absolute;
    left: 0;
    top: 0;
    background-color: #ffffff;

  }
  .timeline-pointer-cursor{
    width: 10px;
    height: 13px;
    background-size:contain;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='26' viewBox='0 0 20 26'%3E%3Cpath fill='%23ffffff' fill-rule='evenodd' d='M2 0h16a2 2 0 0 1 2 2v14.917a1 1 0 0 1-.367.774L10 25.573.367 17.691A1 1 0 0 1 0 16.917V2a2 2 0 0 1 2-2z'/%3E%3C/svg%3E");
    transform: translate(-50%, 0);
  }


  // 
  .timeline-display-label{
    position: absolute;
    font-size: 12px;
  }
  .timeline-display-label:after{
    content: '';
    display: block;
    width: 1px;
    height: 10000px;
    background-color: #3D4041;
    left: -0.5px;
    // transform: translate(-50%, 0);
  }
  .timeline-display-label-sl:after{
     background-color: #515556;
  }
  .timeline-display-label-time{
    transform: translate(-50%, 0);
  }

</style>
