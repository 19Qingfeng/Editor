<template>
  <div class="editor-top">
    <header class="header">wonder编辑器v1.0—《霸王龙哭了》v1.0</header>
    <div class="body">
      <div class="sheets">
        <el-button
          type="text"
          icon="el-icon-menu"
          style="color: #fff"
          @click="openPictureList"
          >{{ Sp }}</el-button
        >
      </div>
      <section>
        <el-button
          v-for="(btn, index) in btnList"
          :key="index"
          @click="
            () => {
              btn.on();
            }
          "
        >
          {{ btn.text }}
        </el-button>
      </section>
    </div>

    <animation-list v-if="isShow" :is-show.sync="isShow" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AnimationList from "../animationList";
export default {
  data() {
    return {
      isShow: false
    };
  },
  components: {
    AnimationList
  },
  computed: {
    ...mapGetters("picture", ["curAnimationBookIndex"]),
    Sp() {
      return `SP${this.curAnimationBookIndex * 1 + 1}`;
    },
    btnList() {
      return [
        {
          text: "导入",
          on: () => {
            console.log("导入");
          }
        },
        {
          text: "保存",
          on: () => {
            console.log("点击保存");
            // 将vuex中的当前绘本信息 组合 然后推入electron-stroe
            this.saveAnimationBook();
          }
        },
        {
          text: "复制"
        },
        {
          text: "粘贴"
        },
        {
          text: "顶层"
        },
        {
          text: "底层"
        },
        {
          text: "添加文本"
        },
        {
          text: "返回",
          on: () => {
            this.$router.push({
              name: "Home"
            });
          }
        }
      ];
    }
  },
  methods: {
    ...mapActions("picture", ["saveAnimationBook"]),
    // 打开绘本中的插画弹窗
    openPictureList() {
      this.isShow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.editor-top {
  height: 100%;
  box-sizing: border-box;
  padding-left: 20px;
  .header {
    height: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .body {
    display: flex;
    padding: 10px 0px;
    .sheets {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 20px 0 0;
    }
  }
  background: $bg-primary;
}
</style>
