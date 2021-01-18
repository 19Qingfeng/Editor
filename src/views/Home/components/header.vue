<template>
  <div class="home-header-cmp">
    <div class="inner-left">
      <span class="left-svg"> </span>
      <span class="left-title">wonder编辑器1.0</span>
    </div>

    <div class="inner-right">头像</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "HomeHeader",
  data() {
    return {};
  }
});
</script>

<style lang="scss">
.home-header-cmp {
  color: #2a3a4a;
  height: 60px;
  line-height: 60px;
  background: $bg-primary;
  color: $font-primary;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  .inner-left {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    .left-svg {
      width: 40px;
      height: 40px;
    }
    .left-title {
      margin-left: 10px;
      font-size: 12px;
    }
  }
  .inner-right {
    height: 100%;
  }
}
</style>
