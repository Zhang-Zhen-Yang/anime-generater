<template>
  <div id="timeline-pointer" class="relative" ref="timeline-pointer" :style="{width: width, left: left}">
    <div>
      <div v-for="item,index in ranges"
      :class="['timeline-display-label', item.sl? 'timeline-display-label-sl' : '' ]"
      :style="{left: (item.value / tlDuration * 100 )+'%' }">
        <div class="timeline-display-label-time" v-if="item.sl">
          {{ item.label }}
        </div>
      </div>
      <!--总长时的红线-->
      <div class="timeline-display-label total-position" :style="{left: (duration / tlDuration * 100 + '%')}">
      </div>

    </div>
    
    <div style="width: 0;" class="timeline-pointer-cursor-wrap" ref="timeline-pointer-cursor-wrap">
      <div class="timeline-pointer-cursor">
      </div>
      <!--{{ width }} {{left }}-->
    </div>
  </div>
</template>

<script>
import util from '../../script/util.js';
export default {
  name: 'timeline-pointer',
  data () {
    return {
      msg: 'timeline-pointer',
      dragging: false,
      lastTime: 0,
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
    timeline() {
      return this.$store.state.timeline;
    },
    // 动画时长
    duration() {
      if(this.timeline) {
        return this.timeline.duration;
      }
      return 0;
    },
    position() {
      return this.$store.state.position;
    },
    // 时间轴在是显示区的多少倍
    scaleValue(){
      return Math.ceil(1 / this.scale);
    },
    ranges() {
      /**
       * {
       *  sl shlowLabel 是否显示标签
       * }
       * 
      */




      /* let scaleCloseValue = this.scaleValue;
      let round2 = scaleCloseValue - (scaleCloseValue % 2);
      let round5 = scaleCloseValue - (scaleCloseValue % 5);
      let disScaleValue;
      if(Math.abs(round2 - scaleCloseValue) > Math.abs(round5 - scaleCloseValue)) {
        disScaleValue = round5;
      } else {
        disScaleValue = round2;
      }
      console.log('scaleCloseValue', scaleCloseValue);
      console.log('disScaleValue----------------------------------------------',disScaleValue);

    
      console.log(scaleCloseValue);
      let power = (this.tlDuration + '').length - 3;
      let powerDivValue = Math.pow(10, power) / (this.scaleValue);
      let count1 = Math.ceil(this.tlDuration / powerDivValue);
      let count2 = Math.ceil(this.tlDuration / (powerDivValue * 2));
      let count5 = Math.ceil(this.tlDuration / (powerDivValue * 5));
      let testList = [[count1, 1], [count2, 2], [count5, 5]].map((item, index) => {
        return {
          count: item[0],
          distance: Math.abs(item[0] - 100 * scaleCloseValue),
          value: powerDivValue * item[1]
        }
      })
      testList.sort(function(p, n){
        return p.distance - n.distance;
      });
      let distItem = testList[0];
      let timeScaleList = [];
      for(let i=0; i <= distItem.count; i++  ) {
        timeScaleList.push({
          label: util.formatMinutes(i * distItem.value),//`${i * distItem.value / 1000}s`,
          sl: false,
          value: i * distItem.value
        })
      }
      console.log(timeScaleList);
      return timeScaleList;
      */

     
     let scaleCloseValue = this.scaleValue;
     // let scaleTen =  Math.pow(10, Math.ceil(scaleCloseValue / 10));

      let power = (this.tlDuration + '').length - 2;
      let powerDivValue = Math.pow(10, power);
      let count1 = Math.ceil(this.tlDuration / powerDivValue);
      let count2 = Math.ceil(this.tlDuration / (powerDivValue * 2));
      let count5 = Math.ceil(this.tlDuration / (powerDivValue * 5));

      let testList = [[count1, 1], [count2, 2], [count5, 5]].map((item, index) => {
        return {
          count: item[0],
          distance: Math.abs(item[0] - 15 * scaleCloseValue),
          value: powerDivValue * item[1]
        }
      })
      testList.sort(function(p, n){
        return p.distance - n.distance;
      });
      let distItem = testList[0];
      let timeScaleList = [];
      for(let i=0; i <= distItem.count; i++  ) {
        timeScaleList.push({
          label: util.formatMinutes(i * distItem.value),//`${i * distItem.value / 1000}s`,
          sl: true,
          value: i * distItem.value
        })

      }
      return timeScaleList;





      

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
          let left = ui.position.left;
          let totalWidth = this.$refs['timeline-pointer'].clientWidth;
          let position = parseInt(left / totalWidth * this.tlDuration);
          window.timeline.setPosition(position);

          this.setPosition();
        },
        drag: (e, ui) => {
          let now = Date.now();
          if((now - this.lastTime) > 50) {
            // console.log(now - this.lastTime);
            this.lastTime = now;
            // console.log('dd');
           let left = ui.position.left;
            let totalWidth = this.$refs['timeline-pointer'].clientWidth;
            let position = parseInt(left / totalWidth * this.tlDuration);
            // console.log(position);
            window.timeline.setPosition(position);
          }
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
    opacity: 0.7;
    cursor:move;
  }
  .timeline-pointer-cursor-wrap:after{
    content: '';
    width: 1px;
    height: 1000px;
    position: absolute;
    left: 0;
    top: 0;
    // background-color: #ffffff;
    background-color: #1284e7;

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
  .timeline-display-label.total-position:after{
    background-color: rgba(255, 0, 0, 0.8);
  }
  .timeline-display-label-sl:after{
     background-color: #515556;
  }
  .timeline-display-label-time{
    transform: translate(-50%, 0);
  }

</style>
