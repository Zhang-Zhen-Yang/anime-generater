/*
 * @Author: zhangzhenyang 
 * @Date: 2019-04-20 09:17:56 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-04-29 15:31:57
 */

<template>
  <div class="mask-replace" @click="click">
    <slot></slot>
    <div class="mask-view">
      <table>
        <tr>
          <td>
          <!--<button :class="['btn', 'primary', btnSize]" @click="selectVideo">{{ text }}</button>-->

          <div :class="['btn', 'primary', 'video-clip-btn', btnSize]" @click="clipVideo">
            <span style="color:transparent;">图片</span><span>选择/截取</span>
          </div>
          </td>
        </tr>
      </table>
    </div>
    <slot name="after"></slot>
  </div>
</template>

<script>
export default {
  name: 'mask-replace',
  props: {
    text: {
      type: String,
      default: '选择视频',
    },
    showImageUpload: {
      type: Boolean,
      default: false,
    },
    showActions: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 1,
    },
    btnSize: {
      type: String,
      default: 'medium',
    }
  },
  data () {
    return {
    }
  },
  computed: {

  },
  methods: {
    click() {

    },
    // 选择视频
    selectVideo() {
      this.$emit('selectVideo');
    },
    // 截取片段
    clipVideo() {
      this.$emit('clipVideo');
    }
  },
  created() {
  }
}
</script>

<style lang="scss">
  .mask-replace{
    position: relative;
    width: 100%;
    max-width: 300px;
    .btn{
      margin: 5px 0;
    }
  }
  .mask-view{
    background-color: rgba(0,0,0,0.2);
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: none;
    table{
      width: 100%;
      height: 100%;
    }
    td{
      text-align: center;
    }
  }
  .mask-replace:hover .mask-view{
    display: block;
  }
  .actions-wrap{
    position: absolute;
    right:5px;
    top:5px
  }

  .video-clip-btn{
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M844.8 924.672H179.2c-93.184 0-168.96-75.776-168.96-168.96V268.288c0-93.184 75.776-168.96 168.96-168.96h665.6c93.184 0 168.96 74.752 168.96 166.912v126.976c0 18.432-15.36 33.792-33.792 33.792-18.432 0-33.792-15.36-33.792-33.792V266.24c0-54.272-47.104-99.328-102.4-99.328h-665.6c-56.32 0-102.4 46.08-102.4 102.4v486.4c0 56.32 46.08 102.4 102.4 102.4h665.6c56.32 0 102.4-46.08 102.4-102.4V543.744c0-18.432 15.36-33.792 33.792-33.792 18.432 0 33.792 15.36 33.792 33.792v210.944c0 94.208-75.776 169.984-168.96 169.984z' fill='%23fff'/%3E%3Cpath d='M445.44 689.152c-12.288 0-25.6-3.072-36.864-10.24-23.552-13.312-36.864-36.864-36.864-64.512V408.576c0-26.624 14.336-51.2 36.864-64.512 23.552-13.312 51.2-13.312 73.728 0L660.48 447.488c23.552 13.312 36.864 36.864 36.864 64.512s-14.336 51.2-36.864 64.512l-178.176 102.4c-12.288 7.168-24.576 10.24-36.864 10.24zm0-287.744c-1.024 0-3.072 0-4.096 1.024-2.048 1.024-3.072 3.072-3.072 6.144V614.4c0 3.072 2.048 5.12 3.072 6.144 2.048 1.024 4.096 2.048 7.168 0L626.688 517.12c3.072-2.048 3.072-4.096 3.072-6.144s-1.024-4.096-3.072-6.144l-178.176-102.4c-1.024 0-2.048-1.024-3.072-1.024z' fill='%23fff'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: 30px center;
    background-size: 20px auto;
  }
  .upload-btn input{
    display: none;
  }
  .upload-btn.small{
    background-position: 10px center;
    background-size: 15px auto;
  }
</style>
