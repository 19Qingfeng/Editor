<template>
  <div class="source-top">
    <div class="header">
      <title-cmp :title="title" :btnList="btnList" />
    </div>
    <div class="source-list">
      <!-- 背景资源 -->
      <div v-if="hasBg">
        <div class="title">背景</div>

        <el-popover placement="right" width="200" trigger="hover">
          <el-button size="mini" type="danger" @click="handleRemoveBg"
            >删除</el-button
          >
          <div slot="reference" class="source">
            {{ hasBg.name }}
          </div>
        </el-popover>
      </div>
      <!-- 动画资源 -->
      <div v-if="hasAnimation">
        <div class="title">动画</div>

        <el-popover
          v-for="animation in curAnimationBookSource"
          :key="animation.id"
          placement="right"
          width="200"
          trigger="hover"
        >
          <el-button
            size="mini"
            type="danger"
            @click="handleRemoveAnimation(animation)"
            >删除</el-button
          >
          <div class="source" slot="reference">
            {{ animation.name }}
          </div>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
import TitleCmp from "@/components/TitleHeader";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    TitleCmp
  },
  computed: {
    ...mapGetters("picture", [
      "curAnimationBookSource",
      "curAnimationBookBg",
      "curAnimationElement"
    ]),
    hasAnimation() {
      if (
        this.curAnimationBookSource?.length !== 0 &&
        this.curAnimationBookSource
      ) {
        return true;
      }
      return false;
    },
    hasBg() {
      return this.curAnimationBookBg;
    }
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
  },
  methods: {
    ...mapActions("picture", [
      "changeAnimationBookBg",
      "deleteSourceToCurrentBook",
      "clearAnimationStyle"
    ]),
    handleRemoveBg() {
      this.changeAnimationBookBg();
    },
    handleRemoveAnimation(animation) {
      const { id } = animation;
      if (id === this.curAnimationElement?.id) {
        console.log("一个动画吗");
        // 如果是当前选中的动画被删除 那么就要清除当前选中的
        this.clearAnimationStyle();
      }
      // 在进行对比
      this.deleteSourceToCurrentBook(animation);
    }
  }
};
</script>

<style lang="scss" scoped>
.source-top {
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
