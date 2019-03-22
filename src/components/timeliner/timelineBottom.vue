<template>
  <div id="timeline-bottom">
    <div class="timeline-bottom-icon add-icon" title="新建图层" @click="setAction(0)">

    </div>
    <div class="timeline-bottom-icon file-icon" title="新建文件夹" @click="setAction(1)">

    </div>
    <div class="timeline-bottom-icon delete-icon" title="删除" @click="setAction(2)">

    </div>
    <span id="log"></span>
  </div>
</template>

<script>
export default {
  name: 'timeline-bottom',
  data () {
    return {
      msg: 'timeline-bottom'
    }
  },
  computed: {
    
  },
  methods: {
    setAction(type){
      console.log(type);
    }
  },
  created() {
    
  },
}
</script>

<style lang="scss">
  #timeline-bottom{
    height: 25px;
    border-top: 1px solid #525252;
    padding-top: 2px;
    background-color: #2c2e2f;
  }
  .timeline-bottom-icon{
    width: 20px;
    height: 20px;
    display: inline-block;
    background-position: center;
    background-size: 18px auto;
    background-repeat:no-repeat;
    cursor: pointer;
    margin-left: 10px;
    opacity: 0.8;
    &:hover{
      opacity: 1;
    }
  }
  .add-icon{
    background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3Cstyle/%3E%3C/defs%3E%3Cpath d='M123.1 98.3c-14.3 0-25.9 11.6-25.9 25.9v526.6l277.5 277.3h526.4c14.3 0 25.9-11.6 25.9-25.9v-778c0-14.3-11.6-25.9-25.9-25.9h-778zm283.2 767.6L159.4 619.2v-.2h247.8v246.9h-.9zm456.5-2H469.4V582.7c0-14.3-11.6-25.9-25.9-25.9H161.4V162.5h701.4v701.4z' fill='%23efefef'/%3E%3C/svg%3E");
  }
  .file-icon{
    background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3Cstyle/%3E%3C/defs%3E%3Cpath d='M595.072 290.288L537.472 160H108.8A28.528 28.528 0 0 0 80 188.24V880h864V290.288H595.072zm-457.472-45.6a28.528 28.528 0 0 1 28.8-28.224h342.272l28.8 73.824H137.6v-45.6zm748.8 578.848H137.6v-476.8h748.8v476.8z' fill='%23efefef'/%3E%3Cpath d='M595.072 290.288L537.472 160H108.8A28.528 28.528 0 0 0 80 188.24V880h864V290.288H595.072zm-457.472-45.6a28.528 28.528 0 0 1 28.8-28.224h342.272l28.8 73.824H137.6v-45.6zm748.8 578.848H137.6v-476.8h748.8v476.8z' fill='%23efefef'/%3E%3C/svg%3E");
  }
  .delete-icon{
    background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3Cstyle/%3E%3C/defs%3E%3Cpath d='M256 256v608a32 32 0 0 0 32 32h448a32 32 0 0 0 32-32V256zm480 704H288a96 96 0 0 1-96-96V224a32 32 0 0 1 32-32h576a32 32 0 0 1 32 32v640a96 96 0 0 1-96 96z' fill='%23efefef'/%3E%3Cpath d='M160 256a32 32 0 0 1 0-64h704a32 32 0 0 1 0 64zm192 192a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0zm128 0a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0zm128 0a32 32 0 0 1 64 0v256a32 32 0 0 1-64 0z' fill='%23efefef'/%3E%3Cpath d='M647.04 128H376.96l-16 64h302.08zM704 256H320a32 32 0 0 1-32-39.68l32-128A32 32 0 0 1 352 64h320a32 32 0 0 1 32 24.32l32 128A32 32 0 0 1 704 256z' fill='%23efefef'/%3E%3C/svg%3E");
  }
</style>
