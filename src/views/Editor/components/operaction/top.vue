<template>
  <div class="opearion-wrapper">
    <div class="header">
      <title-cmp :title="title" />
    </div>
    <template v-if="hasCurAnimation">
      <div class="opearion-inner-wrapper">
        <div class="name">
          <span class="name">{{ elementName }}</span>
        </div>
        <div v-for="(value, key) in positionInfo" :key="key" class="position">
          <el-input
            :value="value"
            @input="
              value => {
                changeSize(value, key);
              }
            "
          >
            <template slot="append">{{ key }}</template>
          </el-input>
        </div>
        <div class="first-animation">
          <el-input
            v-model="firstAnimation"
            size="mini"
            placeholder="first animation"
          />
        </div>
      </div>
    </template>

    <section v-if="hasCurAnimation" class="opearion-bottom-wrapper">
      <div class="level">
        <span class="title">层级:</span>
        <el-select v-model="level" placeholder="输入层级" size="mini">
          <el-option v-for="i in 100" :key="i" :value="i" :label="i" />
        </el-select>
      </div>
      <div class="guide">
        <el-checkbox v-model="readingGuide"></el-checkbox>
        <span class="title">点读引导</span>
      </div>
    </section>
  </div>
</template>

<script>
import TitleCmp from "@/components/TitleHeader";
import { getActualDisplaySize } from "@/utils/size";
import { validateNumber } from "@/utils/validate";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      title: "样式"
    };
  },
  computed: {
    ...mapGetters("picture", [
      "curAnimationElement",
      "canvasScale",
      "curAnimationElement"
    ]),
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
    // 首次播放动画
    firstAnimation: {
      get() {
        return this.curAnimationElement.firstAnimation;
      },
      set(val) {
        this.updateAnimationStyle({
          id: this.animationId,
          firstAnimation: val
        });
      }
    },
    // 当前动画ID
    animationId() {
      return this.curAnimationElement.id;
    },
    // 是否勾选读引道
    readingGuide: {
      get() {
        return this.curAnimationElement.readingGuide;
      },
      set(val) {
        this.updateAnimationStyle({
          id: this.animationId,
          readingGuide: val
        });
      }
    },
    // 层级
    level: {
      get() {
        return this.curAnimationElement.level;
      },
      set(val) {
        this.updateAnimationStyle({
          id: this.animationId,
          level: val
        });
      }
    },
    positionInfo() {
      return {
        x: this.showLeft,
        y: this.showTop,
        w: this.showWidthValue,
        h: this.showHeightValue
      };
    }
  },
  methods: {
    ...mapActions("picture", ["updateAnimationStyle"]),
    changeSize(value, key) {
      const boolean = validateNumber(value);
      if (!boolean) return;
      this._changeSize(value, key);
    },
    _changeSize(styleValue, styleKey) {
      const mapKey = {
        x: {
          key: "left",
          realKey: "displayLeft"
        },
        y: {
          key: "top",
          realKey: "displayTop"
        },
        w: {
          key: "width",
          realKey: "displayWidth"
        },
        h: {
          key: "height",
          realKey: "displayHeight"
        }
      };
      const { key, realKey } = mapKey[styleKey];
      const realValue = getActualDisplaySize(styleValue, this.canvasScale);
      // 需要改变的是
      const updateInfo = {
        id: this.animationId,
        [key]: Number(styleValue),
        [realKey]: Number(realValue)
      };
      this.updateAnimationStyle(updateInfo);
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
  .opearion-inner-wrapper {
    .position {
      box-sizing: border-box;
      margin: 5px;
    }
    .title {
      margin-right: 5px;
    }
    .name {
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-weight: 600;
    }
    .first-animation {
      margin: 5px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .opearion-bottom-wrapper {
    margin: 5px;
    > div {
      margin: 5px 5px 10px 5px;
    }
    .title {
      font-size: 12px;
      width: 60px;
    }
    .level {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .guide {
      .title {
        margin-left: 10px;
      }
    }
  }
}
</style>
