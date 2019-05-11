/*
 * @Author: zhangzhenyang 
 * @Date: 2019-05-10 10:52:29 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2019-05-10 11:28:58
 */


<template>
  <modal-dialog
    @dismiss="dismiss"
    @confirm="dismiss"
    :sty="'width: 500px;height:340px'"
    :showFooter="true"
    title="设置">
    <div class="dialog-setting-content-wrap" slot="content" >
      <div class="dialog-setting-content scrollbar-overwrite">
        <div style="">
          <div>
            version
          </div>
          <p></p>
          <div>
            <label class="radioWrap">
              <input type="radio" name="asmVer" value="1" v-model="ver">
              <div class="radio sm"></div>
              <span>ver.1</span>
            </label>
            &emsp;
            <label class="radioWrap">
              <input type="radio" name="asmVer" value="2" v-model="ver">
              <div class="radio sm"></div>
              <span>ver.2</span>
            </label>
          </div>
          
        </div>

      </div>
    </div>
    


    <!--footer-->
    <table slot="footer">
      <tr>
        <td class="left">
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

export default {
  name: 'dialog-asm-switch',
  components: { },
  data () {
    return {
      ver: 1,
    }
  },
  computed: {
    modal(){
      return this.$store.state;
    },
    
    /* ver: {
      get() {
        return this.modal.convertVer;  
      },
      set(val) {
        this.modal.convertVer = val;
        localStorage.setItem('setting-asmVer', val);
        
      }
    }*/
    

  },
  methods: {
    dismiss(){
      this.$store.state.dialogSetting.switchShow = false;
    },
    confirm() {

      this.dismiss();
      this.modal.convertVer = this.ver;
      localStorage.setItem('setting-asmVer', this.ver);
      this.$store.dispatch('accessWorker');
    }
  },
  created() {
    this.ver = this.modal.convertVer;
  }
}
</script>

<style lang="scss">
  .dialog-setting-content-wrap{
    padding: 50px 0 50px 0;
    height: 100%;
    font-size: 14px;
  }
  .dialog-setting-content{
    height: 100%;
    overflow: auto;
    text-align: left;
    padding: 20px;
    padding-bottom: 0;
  }
  
  .modal-setting-footer{
    background-color: white;
  }
 
</style>
