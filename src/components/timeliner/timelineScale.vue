<template>
  <div id="timeline-scale">
    <div class="timeline-scale-item" v-for="item, index in data" v-if="!item.isHide" :style="{left: item.value / tlDuration * 100 + '%'}">
      <div class="timeline-scale-item-label">
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script>
import util from '../../script/util.js';
export default {
  name: 'timeline-scale',
  data () {
    return {
      msg: 'timeline-scale'
    }
  },
  computed: {
    tl() {
      return this.$store.state.tl;
    },
    tlDuration(){
      return this.tl.duration;
    },
    duration() {
      return 10000;
    },
    data() {
      let power = (this.tlDuration + '').length - 2;
      let powerDivValue = Math.pow(10, power);
      let count1 = Math.ceil(this.tlDuration / powerDivValue);
      let count2 = Math.ceil(this.tlDuration / (powerDivValue * 2));
      let count5 = Math.ceil(this.tlDuration / (powerDivValue * 5));

      // console.log([count1, count2, count5]);
      let testList = [[count1, 1], [count2, 2], [count5, 5]].map((item, index) => {
        return {
          count: item[0],
          distance: Math.abs(item[0] - 15),
          value: powerDivValue * item[1]
        }
        // console.log(item);
      })
      testList.sort(function(p, n){
        return p.distance - n.distance;
      });
      // console.log(testList);
      let distItem = testList[0];
      let timeScaleList = [];
      for(let i=0; i <= distItem.count; i++  ) {
        timeScaleList.push({
          label: util.formatMinutes(i * distItem.value),//`${i * distItem.value / 1000}s`,
          isHide: false,
          value: i * distItem.value
        })
      }
      // console.log(timeScaleList);
      return timeScaleList;


      // console.log('powerDivValue---------------------',powerDivValue);


      let data = [];
      let ten_seconds = Math.ceil(this.tlDuration / 10000);
      if(ten_seconds < 1) {
        ten_seconds = 1;
      }
      let distance = 100 * ten_seconds;
      for(let i = 0; i <= this.tlDuration / distance; i++) {
        data.push(i/(1000 / distance));
      }
      // console.log(data);
      return data;
    },
    range() {
      // alert(this.duration);
      return this.data.map((item, index)=>{
      let ten_seconds = Math.ceil(this.duration / 10000);
      if(ten_seconds < 1) {
        ten_seconds = 1;
      }
        if (item % ten_seconds  == 0 ) {
          return {
            label: `${item}s`,
            isHide: false,
            value: item * 1000
          }
        }
        return {
          label: `${item}s`,
          isHide: true,
          value: item * 1000
        }
      })
    },
    scaleList() {

      return [
        {
          label: '0s',
          value: 0,
        },
        {
          label: '1s',
          value: 1000,
        },
        {
          label: '2s',
          value: 2000,
        },
        {
          label: '3s',
          value: 3000,
        },
        {
          label: '4s',
          value: 4000,
        },

      ]
    }
  },
  methods: {

  },
  created() {
    
  },
}
</script>

<style lang="scss">

  #timeline-scale{
    position: absolute;
    width: 100%;
    height: 20px;
    left:0;
    top: 0;
    // background-color: yellowgreen;
    opacity: 1;
    top: 5px;
  }
  .timeline-scale-item{
    position: absolute;
    top: 0;
    width: 0;
  }
  .timeline-scale-item:after{
    content: '';
    display: inline-block;
    width: 1px;
    height: 5px;
    background-color: #5A5E5F;
    position: absolute;
    left: -0.5px;
    top: 15px;
  }
  .timeline-scale-item-label{
    display: inline-block;
    position: absolute;
    font-size: 12px;
    transform: translate(-50%, 0) scale(0.8);
    white-space:nowrap;
  }
</style>
