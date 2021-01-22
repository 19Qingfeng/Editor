<template>
  <el-drawer
    size="200px"
    title="添加交互"
    :visible.sync="drawerShow"
    :with-header="false"
    custom-class="operaction-bottom-drawer"
    :before-close="beforeClose"
  >
    <div class="drawer-inner">
      <el-button type="primary"> 添加操作 </el-button>
    </div>
    <span>我来啦!</span>
  </el-drawer>
</template>

<script>
export default {
  name: "Drawer",
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    drawerShow: {
      get() {
        return this.isShow;
      },
      set(val) {
        this.$emit("update:isShow", val);
      }
    }
  }
};
</script>

<style lang="scss">
.operaction-bottom-drawer {
  box-sizing: border-box;
  padding: 20px 5px;
  .drawer-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
