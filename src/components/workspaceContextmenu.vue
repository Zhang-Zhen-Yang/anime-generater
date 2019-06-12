<template>
  <div v-if="show" id="workspace-contextmenu" :style="style" @click.stop="" @contextmenu="contextmenu($event)" :data-type="layer.type">
    <!--<div>
      {{ layer.type }}
    </div>-->
    <div v-for="item,index in allActionList" class="relative">
      <div class="pointer contextmenu-item" @click="selectAction(item.action)">{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'workspace-contextmenu',
  data () {
    return {
      msg: 'workspace-contextmenu',
      // 共用菜单选项
      actionList:[
          {
            name: '删除图层',
            action: 'deleteLayer',
          }
      ],
      // 图片类型的菜单选项
      actionListImage: [
        {
          name: '选择图片',
          action: 'selectImage'
        }
      ],
      // 视频类型的菜单选项
      actionListVideo: [
        {
          name: '选择视频',
          action: 'selectVideo'
        }
      ]
    };
  },
  computed: {
    context(){
      return this.$store.state.os.contextmenu;
    },
    show() {
      return this.context.show;
    },
    layer() {
      // console.log(this.context.layer);
      return this.context.layer;
    },
    style() {
      return {
        left: this.context.x + 'px',
        top: this.context.y + 'px',
      }
    },
    allActionList() {
      let type = this.layer.type;
      if(type == 'image') {
        return this.actionList.concat(this.actionListImage);
      } else if(type == 'video') {
        return this.actionList.concat(this.actionListVideo);
      } else {
        return this.actionList;
      }
    }
  },
  methods: {
    contextmenu(e) {
      e.preventDefault();
    },
    hideContext() {
      this.$store.dispatch('hideContextMenu');
    }, 
    // 选择操作
    selectAction(action) {
      // console.log(action);
      switch(action) {
        // 删除图层
        case 'deleteLayer':
          this.$store.dispatch('layerAction', {type: 2});
          this.hideContext();
          break;
        // 选择图片， 打开面板
        case 'selectImage':
          this.imageSelect();
          break;
        // 选择视频， 打开面板
        case 'selectVideo':
          this.clipVideo();
          break;
        default: break;
      }
    },
    // 选择图片
    imageSelect() {
      this.$store.state.dialogImage.selectedPic = this.layer.pic_url.indexOf('data:image/') < 0 ? this.layer.pic_url : '';
      this.$store.state.dialogImage.itemData = this.layer;
      this.$store.state.dialogImage.show = true;
      this.$store.state.dialogImage.key = 'pic_url';
      this.$store.state.dialogImage.callback = (pic_url)=>{
        // alert(pic_url);
        this.$store.dispatch('imageChange', {img: pic_url});
      }
    },
    // 选择视频
    clipVideo() {
      this.$store.state.dialogVideoClip.item = this.layer;
      this.$store.state.dialogVideoClip.src = this.layer.src;
      this.$store.state.dialogVideoClip.start_time = this.layer.start_time;
      this.$store.state.dialogVideoClip.end_time = this.layer.end_time;
      this.$store.state.dialogVideoClip.show = true;
    },
  },
  created() {
    
  },
}
</script>

<style lang="scss">
  #workspace-contextmenu{
    width: 100px;
    min-height: 100px;
    background-color: white;
    border: 1px solid #eee;
    box-shadow: 0 0 100px rgba(10, 10, 10, 0.5);
    position: absolute;
    .contextmenu-item{
      font-size: 14px;
      line-height: 1.5em;
      padding:3px 5px;
    }
    .contextmenu-item:hover{
      color: white;
      background-color: #1284e7;
    }
  }
</style>
