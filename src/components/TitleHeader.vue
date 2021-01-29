<template>
  <div class="title-header">
    <div class="title">{{ title }}</div>
    <div class="btn-wrapper">
      <!-- <el-button
        class="btn"
        v-for="(btn, index) in btnList"
        type="text"
        :key="index"
        :disabled="btn.disabled"
        @click="btn.on"
      >
        {{ btn.text }}
      </el-button> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "TitleHeader",
  props: {
    title: {
      type: String,
      default: ""
    },
    btnList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.title-header {
  background: rgba(25, 25, 25, 0.3);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 5px;
  .btn-wrapper {
    display: flex;
    > .btn {
      margin: 0 5px;
    }
  }
}
</style>
