<template>
  <div class="source-bottom">
    <title-cmp :title="title" :btnList="btnList" />
  </div>
</template>

<script>
import TitleCmp from "@/components/TitleHeader";
export default {
  components: {
    TitleCmp
  },
  data() {
    return {
      title: "当前页资源",
      btnList: [
        {
          text: "搜索"
        },
        {
          text: "移除"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.source-bottom {
}
</style>
