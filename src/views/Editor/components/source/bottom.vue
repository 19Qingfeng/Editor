<template>
  <div class="source-bottom">
    <div class="header">
      <title-cmp :title="title" :btnList="btnList" />
    </div>
    <div class="source-list">
      <div v-for="(value, key) in formatSourceList" :key="key">
        <div class="title">{{ key }}</div>
        <div class="source" v-for="item in value" :key="item.id">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TitleCmp from "@/components/TitleHeader";
import { parseSourceList } from "@/utils/index";
export default {
  components: {
    TitleCmp
  },
  inject: ["getSourceList"],
  data() {
    return {
      title: "资源库",
      formatSourceList: {},
      btnList: [
        {
          text: "搜索"
        },
        {
          text: "播放"
        }
      ]
    };
  },
  // 感觉就初始化的时候调用就够了
  created() {
    this.initSourceList();
  },
  methods: {
    initSourceList() {
      this.formatSourceList = parseSourceList(this.sourceList);
    }
  },
  computed: {
    sourceList() {
      return this.getSourceList();
    }
  }
};
</script>

<style lang="scss" scoped>
.source-bottom {
  height: 100%;
  .header {
    height: 28px;
  }
  .source-list {
    height: calc(100% - 28px);
    overflow-y: auto;
    .title {
      font-size: 14px;
      text-indent: 20px;
      padding: 10px 0;
    }
    .source {
      text-indent: 40px;
      margin: 10px 0;
      cursor: pointer;
    }
  }
}
</style>
