/*
 * @Author: zhangzhenyang 
 * @Date: 2018-10-31 15:43:12 
 * @Last Modified by:   zhangzhenyang 
 * @Last Modified time: 2018-10-31 15:43:12 
 */
// 搜索
<template>
  <div class="search-input-wrap">
    <input type="text" class="bottom" :placeholder="placeholder" v-model="localValue" @keydown.enter="search"><button class="bottom pointer" @click="search">搜索</button>
  </div>
</template>

<script>
export default {
  name: 'search-input',
  props:{
    placeholder:{
      type: String,
      default: '关键字，编码，ID'
    },
    value: {
      type: String,
      default: '',
    }
  },
  data () {
    return {
      localValue: '',
    }
  },
  computed: {

  },
  methods: {
    search() {
      // alert(this.localValue);
      this.$emit('search', this.localValue);
    },
    setLocalValue() {
      this.localValue = this.value;
    }
  },
  created() {
  },
  mounted() {
    this.setLocalValue();
  },
  watch: {
    value() {
      this.setLocalValue();
    }
  }
}
</script>

<style lang="scss">
  .search-input-wrap{
    display: inline-block;
    white-space:nowrap;
    height: 30px;
    input{
      border: 1px solid #7D8699;
      outline: none;
      padding:0 5px;
      width: 230px;
      height: 100%;
    }
    button{
      background-color: #7D8699;
      color: white;
      border: none;
      outline: none;
      height: 100%;
    }
  }

  
</style>
