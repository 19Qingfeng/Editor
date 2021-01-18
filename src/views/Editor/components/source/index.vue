<template>
  <div class="source-cmp">
    <div class="current-source-list source-list">
      <top-source-list />
    </div>
    <div class="all-source-list source-list">
      <bottom-source-list />
    </div>
  </div>
</template>

<script>
import TopSourceList from "../source/top";
import BottomSourceList from "../source/bottom";
export default {
  components: {
    TopSourceList,
    BottomSourceList
  }
};
</script>

<style lang="scss" scoped>
.source-cmp {
  height: 100%;
  width: 100%;
  display: flex;
  box-sizing: border-box;
  border-right: 0.5px solid #666;
  flex-direction: column;
  .source-list {
    flex: 1;
    max-height: 50%;
  }
}
</style>
