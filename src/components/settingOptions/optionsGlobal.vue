
<template>
  <div>
    <!--画布尺寸-->
    <div class="c-layer-title">
      <span class="prop-name">画布尺寸</span>
    </div>
    <div style="padding-left: 15px;">
        <table cellspacing="0" cellpadding="0" style="width: 100%;">
          <tr>
            <td class="width1-4">宽</td>
            <td colspan="2">
              <num-resize
                v-model="projectWidth"
                @start="startSetValue"
                :min="100"
                :max="1280">
                <span >
                  {{ projectWidth }}
                </span>
              </num-resize>
            </td>
          </tr>
          <tr>
            <td class="width1-4">高</td>
            <td colspan="2">
              <num-resize
                v-model="projectHeight"
                @start="startSetValue"
                :min="100"
                :max="1280">
                <span >
                  {{ projectHeight }}
                </span>
              </num-resize>
            </td>
          </tr>
        </table>
    </div>

    <div class="c-layer-title">
      <span class="prop-name">背景颜色</span>
    </div>
    <div style="padding-left: 15px;">
      <color-picker title="颜色" v-model="bgColor" :showTitle="false" @start="startSetValue">
      </color-picker>
    </div>
  </div>
</template>
<script>
export default {
  name: 'optionsGlobal',
  data () {
    return {
      msg: 'optionsGlobal'
    }
  },
  computed: {
    project() {
      return this.$store.state.project;
    },
    // 画布宽
    projectWidth: {
      get() {
        return this.project.width;
      },
      set(val) {
        this.project.width = val;
      }
    },
    // 画布高
    projectHeight: {
      get() {
        return this.project.height;
      },
      set(val) {
        this.project.height = val;
      }
    },
    bgColor: {
      get() {
        return this.project.bgColor;
      },
      set(val) {
        this.project.bgColor = val;
      }
    },
  },
  methods: {
    // 添加历史记录
    as() {
      this.$store.dispatch('addStep');
    },
    startSetValue() {
      // alert('dd');
      this.as();
      this.$store.dispatch('startSetValue');
    },
  },
  created() {
    
  },
}
</script>

<style lang="scss">
  #temp{
    
  }
</style>
