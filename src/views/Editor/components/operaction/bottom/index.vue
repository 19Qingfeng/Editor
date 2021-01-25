<template>
  <div class="m-opearction-bottom">
    <header class="header">
      <title-cmp :title="title" />
    </header>
    <div class="add">
      <el-select
        v-model="opearType"
        class="add-select"
        size="mini"
        placeholder="交互方式"
      >
        <el-option
          v-for="opearction in opearList"
          :key="opearction.value"
          :label="opearction.label"
          :value="opearction.value"
        />
      </el-select>
      <el-button
        class="btn"
        type="primary"
        size="mini"
        @click="addInteractive"
        :disabled="disabledAddBtn"
      >
        新建交互
      </el-button>
    </div>

    <drawer-cmp v-if="isShow" :isShow.sync="isShow" :eventType="opearType" />
  </div>
</template>

<script>
import TitleCmp from "@/components/TitleHeader";
import DrawerCmp from "./drawer/index";
import { mapGetters } from "vuex";
export default {
  components: {
    TitleCmp,
    DrawerCmp
  },
  data() {
    return {
      title: "交互",
      opearType: "",
      isShow: false,
      opearList: [
        {
          label: "点击",
          value: "click"
        },
        {
          label: "自动",
          value: "auto"
        },
        {
          label: "动画完成",
          value: "animactionComplete"
        }
      ]
    };
  },
  computed: {
    ...mapGetters("picture", ["curAnimationElement"]),
    // 存在ID 也就是存在编辑动画
    liveAniamtion() {
      return this.curAnimationElement?.id;
    },
    disabledAddBtn() {
      return this.opearType === "" || !this.liveAniamtion;
    }
  },
  methods: {
    addInteractive() {
      this.isShow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.m-opearction-bottom {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  .header {
    height: 28px;
    margin-bottom: 20px;
  }
  .add {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .add-select {
      width: 80%;
      margin: 10px;
    }
    .btn {
      width: 80%;
      margin: 0 auto;
    }
  }
}
</style>
