/*
 * @Author: zhangzhenyang 
 * @Date: 2019-04-20 14:32:17 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-06-12 11:31:17
 */

<template>
  <modal-dialog
    @dismiss="dismiss"
    @confirm="dismiss"
    title="视频片段截取"
    :showFooter="true"
    :showHeader="true"
  >
    <div class="dialog-video-content" slot="content" style="padding: 50px 20px 0 10px;">
        <div style="padding:0 80px 10px;">
          <table cellpadding="0" cellspacing="0" style="width: 100%;">
            <tr>
              <td style="vertical-align:middle;">
                <input type="text" class="content-item-input" v-model="videoSrc">
              </td>
              <td style="text-align: right;width:100px;">
                <label class="btn primary">
                  本地
                  <input
                    type="file"
                    accept=".mp4,.avi,.flv,.mov,.mkv,.wmv,.f4v,.rmvb,.webm"
                    style="display:none;"
                    ref="videoFileInput"
                    @change="fileChange($event)">
                </label>
              </td>
            </tr>
          </table>
        </div>
        <table cellspacing="0" cellpadding="0" style="width:100%;">
          <tr>
            <td style="text-align:center;">
              <div style="display:inline-block;">
                <div v-if="!usable && isNet" class="color-red" style="width: 100%;text-align:center;padding: 100px 0;">
                  无效的视频链接
                </div>
                <!--视频-->
                <video
                  v-show="usable"
                  ref="video"
                  :src="trueVideoSrc"
                  crossorigin="anonymous"
                  @loadedmetadata="loadedmetadata"
                  @error="loaderror"
                  style="max-width:700px;max-height:400px;vertical-align:middle;"></video>
                <div v-if="!isNet&&thumbnail" >
                  <!--{{ position }}-->
                  <img :src="thumbnail" alt="" style="width: 700px;">
                </div>
                
                <div v-show="usable || !isNet" class="relative" style="width:700px;height:15px;background-color: #181818;">
                  <!--滑块-->
                  <div class="absolute video-select-block" style="width:10px;height: 100%;left:0;top:0;background-color:#37393A;" ref="video-select-block">
                    <div class="video-select-block-point" ref="video-select-block-point" style="width:0;">
                      <div class="timeline-pointer-cursor"></div>
                    </div>
                  </div>
                </div>

                <div v-show="usable || !isNet" style="font-size: 14px;user-select:none;line-height: 20px;">
                  <table>
                    <tr>
                      <td>开始：</td>
                      <td>
                        <num-resize v-model="start_time" :min="0" :max="end_time" :step="10":stepScale="10" @resize="setBlock">
                          {{ (start_time / 1000).toFixed(2) }}s
                        </num-resize>
                      </td>
                      <td>结束</td>
                      <td>
                        <num-resize v-model="end_time" :min="start_time" :max="duration * 1000" :step="10" :stepScale="10" @resize="setBlock">
                           {{ (end_time / 1000).toFixed(2) }}s
                        </num-resize>
                      </td>
                      <td>截取长度</td>
                      <td>{{ ((end_time - start_time) /1000).toFixed(2) }}s</td>
                      <td>视频长度</td>
                      <td>{{ duration.toFixed(2) }}s</td>
                    </tr>
                  </table>
                  <!--总长:{{ duration }}s|总长：{{ (end_time - start_time) /1000 }}s | usable:{{usable}}-->
                </div>
              </div>

            </td>
          </tr>
        </table>
        <div>
          
        </div>
    </div>
    <!--footer-->
    <table slot="footer">
      <tr>
        <td class="left">
          <a class="my-video-link" target="_blank" href="http://ugc.taobao.com/video/uploadVideo.htm">我的视频</a>
          <span class="font14 color-red">请到素材中心选择视频，点击复制链接，复制其中的MP4代码，填到上面的输入框中。</span>
        </td>
        <td>
        </td>
        <td class="right">
          <button class="btn white" @click="dismiss(false)">取消</button>
          <button v-if="true" class="btn primary" @click="confirm(true)">确定</button>
        </td>
      </tr>
    </table>
  </modal-dialog>
</template>

<script>
// import VueSlideBar from 'vue-slide-bar';
export default {
  name: 'dialog-generate',
  components: {  },
  data () {
    return {
      loading: 50,
      showMore: false,
      duration: 0,
      start_time: 0,
      end_time: 0,
      position: 0,
      src: '',
      usable: false,
      isNet: true,
      hasVideoImage: true,

    }
  },
  computed: {
    modal(){
      return this.$store.state.dialogVideoClip;
    },
    show() {
      return this.modal.show;
    },
    localVideoData() {
      return this.modal.localVideo[this.src];
    },
    // 
    trueVideoSrc() {
      if(this.localVideoData) {
        let blob = new Blob([this.localVideoData.data], {type: 'video/mp4'});
        let url = URL.createObjectURL(blob);
        this.isNet = false;
        return url;
      }
      this.isNet = true;
      return this.src; 
    },
    thumbnail() {
      console.log(this. position)

      if(this.localVideoData) {
        let index = parseInt(this.position * this.localVideoData.fps);
        console.log([index, this.localVideoData.thumbnails.length]);
        let tunmbnailData = this.localVideoData.thumbnails[index];
        return tunmbnailData || '';
      }
      return '';
    },
    videoSrc: {
      get() {
        return this.src;
      },
      set(val) {
        this.src = val;
        this.isNet = true;
      }
    }
    
  },
  methods: {
    loadedmetadata() {
      console.log('loadedmetadata');
      this.duration = this.$refs.video.duration;
      this.setBlock();
      // 能播放
      this.usable = true;
      let video = this.$refs.video;
      let videoWidth = this.video.videoWidth;
      if(videoWidth == 0) {
        this.hasVideoImage = false;
      } else {
        this.hasVideoImage = true;
      }
      // console.log([this.video.videoWidth, this.video.videoHeight]);

      // alert('ddd');
    },
    loaderror(e){
      // 有可能是无效的视频地址或浏览器不支持播放。
      console.log(e);
      console.log('出错');
      // 不能播放
      this.usable = false;
      this.hasVideoImage = false;

    },
    dismiss(){
      this.modal.show = false;
    },
    // 确定
    confirm() {
      // alert(typeof this.trueVideoSrc);
      if(this.start_time > this.end_time) {
        this.$store.commit('showSnackbar', {text: '结束时间不能小于开始时间'});
        return;
      }
      // 如果可用而且视频来自网络
      if(this.usable && this.isNet) {
        this.$store.dispatch('videoChange', {
          start_time: this.start_time,
          end_time: this.end_time,
          item: this.modal.item,
          src: this.src,
          isNet: true,
          hasVideoImage: this.hasVideoImage,
          callback: () => {
          }
        });
        this.dismiss();
      } else if(!this.isNet && (this.trueVideoSrc.indexOf('blob')>-1)) { // 视频来自本地
        this.$store.dispatch('videoChange', {
          start_time: this.start_time,
          end_time: this.end_time,
          item: this.modal.item,
          src: this.src,
          isNet: false,
          hasVideoImage: this.hasVideoImage,
          callback: () => {
          }
        });
      } else {
          this.$store.commit('showSnackbar', {text: '请输入有效的视频链接'});
      }
      // this.modal.item.start_time = this.start_time;
      // this.modal.item.end_time = this.end_time;

    },
    // 设置视频的位置
    setPosition() {
      let pLeft = this.$bp.position().left;
      let pbLeft = this.$b.position().left;
      let totalLeft = pLeft + pbLeft;
      let position = totalLeft / 700 * this.duration;
      // console.log(position);
      this.position = position;
      if(this.usable) {
        this.video.currentTime = position;
      }
    },
    // 设置滑块的位置
    setBlock() {
      console.log('setBlock');
      if(this.duration > 0) {
        console.log([this.end_time, this.start_time, this.duration*1000]);
        // 如果截取的视频片段大于视频总长
        if(this.end_time - this.start_time > this.duration*1000) {
          this.end_time = this.start_time + this.duration*1000;
        }
        // 如果结束时间大于总长
        if(this.end_time > this.duration*1000) {
          this.start_time = this.duration*1000 - (this.end_time - this.start_time);
          this.end_time = this.duration*1000;
        }
        let videoClientWidth = 700;// this.$refs.video.clientWidth
        let left = this.start_time / this.duration / 1000 * videoClientWidth;
        let width = (this.end_time - this.start_time) / 1000 / this.duration * videoClientWidth;
        console.log([left, width]);
        this.$b.css({
          left: `${left}px`,
          width: `${width}px`,
        })
        this.$bp.css({
          left: 0
        })
        this.position = this.start_time / 1000;
        if(this.usable) {
          this.video.currentTime = this.start_time / 1000;
        }
      }
    },
    setStartEndTime() {
      let pLeft = this.$b.position().left;
      let pWidth = this.$b.width();
      this.start_time = pLeft / /*this.$refs.video.clientWidth*/ 700 * this.duration * 1000;
      this.end_time = (pLeft + pWidth) / /*this.$refs.video.clientWidth*/ 700 * this.duration * 1000;
      console.log([pLeft]);
    },
    // 本地选择视频
    fileChange(e) {
      let file = e.target.files[0];
      console.log(file);
      let fileReader = new FileReader();
      fileReader.onload = () =>  {
          // console.log(fileReader.result);
          window.videoArrayBuffer = fileReader.result;
          // let blob = new Blob([ window.videoArrayBuffer], {type: 'video/mp4'});
          // let url = URL.createObjectURL(blob);
          // this.$refs.video.src = url;
          // URL.revokeObjectURL(url);
          this.isNet = false;
          this.$store.dispatch('getVideoMessage', {
            data: fileReader.result,
            name: file.name,
            size: file.size,
            callback: ({uuid})=>{
              this.src = uuid;
            }
          });
          this.$refs.videoFileInput.value = '';
      }
      fileReader.readAsArrayBuffer(file);
    }
  },
  created() {
    
  },
  mounted() {
    this.video = this.$refs.video;
    this.b = this.$refs['video-select-block'];
    this.$b = $(this.b);
    this.bp = this.$refs['video-select-block-point'];
    this.$bp = $(this.bp);
    this.$b.draggable({
      axis: 'x',
      containment: 'parent',
      cancel: '.timeline-pointer-cursor',
      start: (e, ui)=>{

      },
      stop: (e, ui)=>{
        this.setStartEndTime();

      },
      drag: (e, ui)=>{
        this.setPosition();
        this.setStartEndTime();
      }
    })
    .resizable({
      handles: 'e,w',
      containment: 'parent',
      start: (e, ui)=>{

      },
      stop: (e, ui) =>{
        this.setStartEndTime();
      },
      resize: (e, ui)=>{
        console.log([this.$b.width(), this.$bp.position().left ]);
        if(this.$b.width() < this.$bp.position().left) {
          this.$bp.css({
            left: `${this.$b.width()}px`,
          })
        }
        this.setPosition();
        this.setStartEndTime();
      }
    })
    this.$bp.draggable({
      axis: 'x',
      containment: 'parent',
      start: (e, ui)=>{

      },
      stop: (e, ui)=>{

      },
      drag: (e, ui)=>{
        // console.log(ui);
        this.setPosition();
      }
    })
    this.start_time = this.modal.start_time;
    this.end_time = this.modal.end_time;
    
    this.src = this.modal.src;
  },
  watch: {
    show(nval, oval) {
      // alert(nval);
      /* if(nval) {
        this.start_time = this.modal.start_time;
        this.end_time = this.modal.end_time;
        this.setBlock();
      }*/
    },
    localVideoData: {
      deep: true,
      handler() {
        if(this.localVideoData) {
          // alert(this.localVideoData.duration);
          this.duration = this.localVideoData.duration;
          this.setBlock();
        }
        // alert('fffff');
      }
    }
  }
}
</script>

<style lang="scss">
  .dialog-video-content{
    .content-item-input{
      color: #555;
      background-color: #fff;
      border: 1px solid #ccc;
      // width: 800px;
      // margin-bottom: 10px;
    }
    .video-video-icon{
      position: absolute;
      top: 0px;
      right: 5px;
    }
    .video-video-text{
      margin-right: 1em;
    }
    .upload-table{
      width: 100%;
      td{
        padding: 5px;
      }
    }
    .upload-file-btn-wrap{
      position: absolute;
      right: 10px;
      bottom: 10px;
    }
    .upload-file-btn{
      /*background-image: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Cdefs%3E%3Cstyle/%3E%3C/defs%3E%3Cpath d='M767.718 256.282c-2.258-.564-4.516-1.693-5.645-3.951-45.16-117.98-140.56-193.059-284.507-193.059-182.898 0-311.603 137.173-324.587 316.12 0 2.822-1.693 5.08-4.516 5.644C62.095 411.52 0 502.968 0 605.706c0 127.577 98.787 235.397 216.203 235.397h92.578c17.499 0 32.176-14.677 32.176-32.741s-14.112-32.741-32.176-32.741h-92.578c-82.417 0-152.98-77.901-152.98-170.479 0-81.852 56.45-155.801 127.013-168.22l23.144-3.952c3.387-.564 5.645-3.951 5.645-7.338l-2.258-23.71v-.564c0-157.495 102.175-277.168 260.799-277.168 127.012 0 198.703 63.788 231.444 172.172l5.645 17.5c1.129 2.822 3.387 4.515 6.21 4.515l18.063.565c119.11 2.258 222.977 100.48 222.977 222.412 0 110.642-72.256 234.267-181.768 234.267h-73.385c-17.5 0-32.176 14.677-32.176 32.74 0 18.065 14.112 32.742 32.176 32.742h72.82c160.318-4.516 243.299-159.753 243.299-299.185C1024 392.891 910.536 273.782 767.718 256.282z' fill='%23ffffff'/%3E%3Cpath d='M536.273 514.822l-8.467-9.031c-4.516-4.516-10.161-7.339-16.37-7.339-5.645 0-11.855 2.258-16.371 7.339l-7.903 8.467s0 .564-.564.564L370.875 644.657c-8.467 9.032-9.032 24.274-.564 33.87.564.565 1.129 1.129 1.693 1.129l7.339 5.08c9.032 9.597 23.709 6.21 32.176-2.822l56.45-63.788c3.952-4.516 11.855-1.694 11.855 4.516v309.91c0 18.063 14.112 32.74 32.176 32.74 17.5 0 32.176-14.677 32.176-32.74v-309.91c0-6.21 7.903-9.032 11.855-4.516l58.708 65.481c9.032 9.597 23.144 12.42 32.176 2.823l7.339-5.08c.564-.565 1.129-.565 1.693-1.13 8.468-9.596 7.903-24.273-.564-33.87l-119.11-131.528z' fill='%23ffffff'/%3E%3C/svg%3E");
      background-size:auto 65%;
      background-repeat: no-repeat;
      background-position: 10px center;*/
      
    }
    .sub-cover-imgs{
      left: 100%;
      top: 0;
      height: 100%;
      text-align: left;
      // padding-left: 10px;
      // background-color: antiquewhite;
      // display: none;
    }
    .current-video-cover:hover .sub-cover-imgs{
      display: block;
    }
    
    .ui-resizable-handle{
      opacity: 0;
      width: 3px;
      border-radius: 0;
    }
    .ui-resizable-e{
      right: -1.5px;
    }
    .ui-resizable-w{
      left: -1.5px;
    }
    .video-select-block{
      top: 0!important;
    }
    .video-select-block-point{
      position: absolute;
      width: 0;
      left: 0;
      top: -12px!important;;
    }
    .video-select-block-point:after{
      content: '';
      display: block;
      position: absolute;
      width: 1px;
      height: 27px;
      left: -0.5px;
      top: 0;
      background-color: #1284e7;
    }
  }
  .my-video-link{
    font-size: 14px;
    text-decoration: underline;
  }
</style>
