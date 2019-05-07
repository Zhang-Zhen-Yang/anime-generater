/*
 * @Author: zhangzhenyang 
 * @Date: 2018-12-20 08:58:55 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: yyyy-12-dd 08:59:41
 */
<template>
  <!--海报 content-->
    <div style="padding-left:0;padding-bottom: 58px;height:500px;background-color:#eeeeee;">
      <block-slice slot="e" dir="vertical" :staticIndex="0" :staticValue="45 + 'px'">
        <table slot="s">
          <tr>
            <td class="left" style="white-space:nowrap;padding-left: 13px;">
              <!-- 活动类型 -->
              <dropdown
                grouped v-if="tabIndex==1"
                :data="promotionActivity"
                :width="200"
                :cbChanged="promotionChange"
                :cbCustomSelectedText="promotionLabel"></dropdown>

              <!-- 出售中，仓库中 -->
              <dropdown
                v-if="tabIndex==0"
                :data="typeData"
                :width="100"
                :cbCustomSelectedText="typeValue"
                :cbChanged="typeChange"
              ></dropdown>
              <!-- 宝贝分类 -->
              <dropdown
                v-if="tabIndex==0"
                :data="sellerCats"
                :width="150"
                :cbCustomSelectedText="sellerCatValue"
                :cbChanged="sellerCatChange"
              ></dropdown>

            </td>
            <td class="right" style="padding-right: 25px;">
              <search-input v-if="tabIndex==0" :value="keyword" @search="search" placeholder="搜索：关键字、宝贝链接、商家编码"></search-input>
            </td>
          </tr>
        </table>
        <div class="dialog-image-content scrollbar-overwrite" slot="e">
          <div v-for="item, index in goodslist" class="goods-list-item">
            <table class="image-goods-table" cellspacing="0" cellpadding="0">
              <tr>
                <td style="width:160px;">
                  <div class="goods-image bg-preset" :style="{backgroundImage: `url(${item.pic_url})`}">
                  </div>
                </td>
                <td>
                  {{ item.title }}
                </td>
                <td style="width:100px;" class="color-red">
                  ¥ {{ item.price }}
                </td>
                <td style="width:100px">
                  <div class="pointer" @click="toggleShowImages(item)">
                    {{ item.showImages ? '收起' : '展开' }}
                  </div>
                </td>
              </tr>
            </table>
            <div v-if="item.showImages" style="padding-left: 80px;">
              <div
                class="goods-image-sub bg-preset pointer"
                v-for="image in item.images"
                :style="{backgroundImage: `url(${image.url})`}"
                @click="selectImage(image.url)">
                <img class="absolute dialog-image-checked-icon" :src="checkedIcon" alt="" v-if="selectedPic == image.url">
              </div>
            </div>
          </div>
          <!--{{ goodslist }}-->
          <content-notice :lastAction="lastAction" :count="goodslist.length"></content-notice>
        </div>
      </block-slice>
    </div>
</template>

<script>
export default {
  name: 'dialogImageGoods',
  data () {
    return {
      data:[{
        label: 'Volvo',
        value: 1
      }, {
        label: 'Saab',
        value: 2
      }, {
        label: 'Long long long long long long test',
        value: 2
      }],
      typeData: [
        {
          label: '出售中',
          value: 'onsale',
        },
        {
          label: '仓库中',
          value: 'instock',
        }
      ],
      typeMapData: {
        onsale: '出售中',
        instock: '仓库中'
      },
      selectedGood: {},
    }
  },
  computed: {
    md() {
      return this.$store.state.dialogGoods;
    },
    mode() {
      return this.md.mode;
    },
    goodslist(){
      // return goodslist.list;
      return this.md.list;
    },
    promotionGoodsList() {
      return this.md.promotionList || [];
    },
    modals(){
      return this.$store.state.modals;
    },
    tabIndex: {
      get() {
        return this.md.tabIndex;
      },
      set(index) {
        this.md.tabIndex = index;
      }
    },
    list() {
      return this.md.list;
    },
    pageSize() {
      return this.md.pageSize;
    },
    promotionPageSize(){
      return this.md.promotionPageSize;
    },
    pageNo() {
      return this.md.pageNo;
    },
    promotionPageNo() {
      return this.md.promotionPageNo;
    },

    count() {
      return this.md.count;
    },
    promotionCount() {
      return this.md.promotionCount;
    },
    lastAction(){
      return this.md.lastAction;
    },
    promotionLastAction(){
      return this.md.promotionLastAction;
    },
    type:{
      get(){
        return this.md.type;
      },
      set(type){
        this.$store.state.dialogGoods.type = type;
      }
    },
    keyword:{
      get() {
        return this.md.keyword;
      }
    },
    cid:{
      get() {
        return this.md.cid;
      },
      set(cid) {
        this.$store.state.dialogGoods.cid = cid;
      }
    },
    sellerCats(){
      return this.$store.state.dialogGoods.sellerCats.map((item,index)=>{
        return {
          label: item.name,
          value: item.id,
        }
      })
    },
    promotionActivity() {
      return this.md.promotionActivity;
    },
    itemData() {
      return this.md.itemData;
    },
    allowCount() {
      return this.md.allowCount;
    },
    numIids() {
      return this.itemData.list.map((item)=>{
        return item.num_iid;
      });
    },
    checkedIcon() {
      return `${window.assets}checked.svg`
    },
    // 选中的图片
    selectedPic: {
      get() {
        return this.$store.state.dialogImage.selectedPic;
      },
      set(url) {
        this.$store.state.dialogImage.selectedPic = url;
      }
    },
  },
  methods: {
    dismiss(){
      this.md.show = false;
    },
    confirm(res) {
      if(this.mode == 'add') {
        this.dismiss();
      } else if(this.mode == 'alternative'){
        if(!res) {
           
        } else {
          this.addStep();
          if(this.selectedGood && this.selectedGood.num_iid) {
            console.log(JSON.stringify(this.itemData));
            this.itemData.list.splice(0, 1, {...this.selectedGood});
          }
        }
        this.dismiss();
      }
    },
    toggleChange(item, index) {
      // 如果是添加模式
      if(this.mode == 'add') {
        let checked = true;
        if(this.numIids.indexOf(item.num_iid) > -1) {
          checked = false;
        }
        this.change(checked, null, index, null);

      } else if(this.mode == 'alternative'){
        // 如果替换模式
        this.selectedGood = item;
        // console.log(JSON.stringify(item));
      }
    },
    change(checked,e,index,inputRef) {
      // 添加
      if(checked) {
        if(this.itemData.list.length < this.allowCount) {
          this.addStep();
          let item = this.tabIndex == 0 ? this.goodslist[index] : this.promotionGoodsList[index];

          let newItem = {...item};
          this.$store.dispatch('getPromotion', {item: newItem});


          this.$store.state.dialogGoods.itemData.list.push(newItem);
        } else {
          this.$nextTick(()=>{
            let text = `该模块最多能选择 ${this.allowCount} 个宝贝`;
            this.$store.commit('showSnackbar',{text, timeout: 1000});
            if(inputRef) {
              inputRef.checked = false;
              this.$refs.checkbox[index].checked = false;
            }
            // alert(inputRef.checked);
            // console.log(this.$refs.checkbox[index]);
          })
        }
      }else { // 删除
        this.addStep();
        let distList = (this.$store.state.dialogGoods.itemData.list).filter((item)=>{
          return item.num_iid != (this.tabIndex == 0 ? this.goodslist[index] : this.promotionGoodsList[index]).num_iid;
        });
        // console.log(distList);
        this.$store.state.dialogGoods.itemData.list = distList;
      }
    },
    // 搜索
    search(value) {
      // alert(value);
      this.$store.state.dialogGoods.keyword = value;
      this.init();
    },
    goToPage(e) {
      this.$store.dispatch('fetchGoods', {pageNo: e});
    },
    promotionGoToPage(e){
      this.$store.dispatch('fetchPromotionGoods', {pageNo: e});
    },
    typeValue() {
      return this.typeMapData[this.type];
    },
    promotionLabel() {
      return this.md.activityName || '请选择活动';
    },
    typeChange(type) {
      this.type = type[0].value;
      this.init();
    },
    sellerCatValue() {
      let sellerCatLable = '';
      this.sellerCats.forEach((item, index)=>{
        // console.log([item.value, this.cid]);
        if(item.value == this.cid) {
          sellerCatLable = item.label;
        }
      });
      // alert(sellerCatLable);
      return sellerCatLable;
    },
    sellerCatChange(sellerCat) {
      let sellerCatId = sellerCat[0].value;
      this.cid = sellerCatId;
      // console.log(sellerCatId);
      this.init();
    },
    promotionChange(promotion) {
      console.log(JSON.stringify(promotion));
      const {type, id, label} = promotion[0];
      this.$store.state.dialogGoods.promotion = type;
      this.$store.state.dialogGoods.activityId = id;
      this.$store.state.dialogGoods.activityName = label;
      this.promotionInit();
    },
    init(){
      this.$store.dispatch('fetchGoods', {pageNo: 1});
    },
    promotionInit(){
      this.$store.dispatch('fetchPromotionGoods', {pageNo: 1});
    },
    addStep() {
      this.$store.dispatch('addStep');
    },
    // 展开 收起
    toggleShowImages(item) {
      this.$store.dispatch('toggleShowImages', {item});
    },
    // 选择图片
    selectImage(imageUrl) {
      this.selectedPic = imageUrl;
    }
  },
  created() {
    if(this.lastAction == 'error' || (this.goodslist.length == 0)) {
      this.init();
    }
    if(this.promotionLastAction == 'error' || (this.promotionGoodsList.length == 0)) {
      // this.promotionInit();
    }
    if(this.sellerCats.length == 0) {
      this.$store.dispatch('getSellerCats');
    }
    // this.$store.dispatch('loadPromotionActivity');
  }
}
</script>

<style lang="scss">
  .goods-image{
    width: 80px;
    height: 80px;
    display: inline-block;
    border: 1px solid #cccccc;
  }
  .image-goods-table{
    table-layout: fixed;
    width: 100%;
    font-size: 14px;
  }
  .goods-image-sub{
    width: 80px;
    height: 80px;
    border: 1px solid #cccccc;
    display: inline-block;
    margin:5px;
    position: relative;
  }
  .goods-list-item{
    border-bottom: 1px solid #aaaaaa;
    padding: 5px 0;
    
  }
  .goods-list-item:first-child{
    border-top: 1px solid #aaaaaa;
  }
</style>
