<template>
  <div class="m-opearction">
    <section class="top">
      <top-cmp />
    </section>
    <section class="bottom">
      <bottom-cmp />
    </section>
  </div>
</template>

<script>
import TopCmp from "./top";
import BottomCmp from "./bottom";
export default {
  name: "Operaction",
  components: {
    TopCmp,
    BottomCmp
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.m-opearction {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-left: 0.5px solid #666;
  .top {
    height: 300px;
  }
  .bottom {
    flex: 1;
  }
}
</style>
