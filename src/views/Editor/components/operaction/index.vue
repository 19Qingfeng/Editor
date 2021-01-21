<template>
  <div class="opearion-wrapper">
    <div class="header">
      <title-cmp :title="title" :btnList="btnList" />
    </div>
    <template v-if="hasCurAnimation">
      <div class="opearion-inner-wrapper">
        <div class="name">
          <span class="name">{{ elementName }}</span>
        </div>
        <div v-for="(value, key) in positionInfo" :key="key" class="position">
          <span class="title">{{ key }}:</span>
          <span>{{ value }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import TitleCmp from "@/components/TitleHeader";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      title: "样式"
    };
  },
  computed: {
    ...mapGetters("picture", ["curAnimationElement"]),
    hasCurAnimation() {
      return Boolean(this.curAnimationElement?.id);
    },
    elementName() {
      return this.curAnimationElement.name;
    },
    // 展示格式化后 针对1440*2340下的value值
    showHeightValue() {
      return this.curAnimationElement.height;
    },
    showWidthValue() {
      return this.curAnimationElement.width;
    },
    showLeft() {
      return this.curAnimationElement.left;
    },
    showTop() {
      return this.curAnimationElement.top;
    },
    positionInfo() {
      return {
        x: this.showLeft,
        y: this.showTop,
        w: this.showHeightValue,
        h: this.showHeightValue
      };
    }
  },
  components: {
    TitleCmp
  }
};
</script>

<style lang="scss" scoped>
.opearion-wrapper {
  .header {
    height: 28px;
  }
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-left: 0.5px solid #666;
  .opearion-inner-wrapper {
    .position {
      height: 18px;
      line-height: 18px;
      padding-left: 5px;
      box-sizing: border-box;
    }
    .title {
      margin-right: 5px;
    }
    .name {
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>
