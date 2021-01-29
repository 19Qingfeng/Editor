<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    class="animation-list"
    :before-close="handleClose"
  >
    <div
      v-for="book in animationBookList"
      class="book"
      :style="{ background: getBackgroundImage(book.bg.path) }"
      :key="book.id"
      @click="changeBook(book.id)"
    >
      <!-- {{ book }} -->
    </div>
    <div class="book new" @click="addBook">+新建页面</div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { v4 } from "uuid";
import { normalizationPath } from "../../../../utils/index";
export default {
  name: "CtxDialog",
  props: {
    title: {
      type: String,
      default: ""
    },
    width: {
      type: String,
      default: "30%"
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("picture", ["animationBookList"]),
    dialogVisible: {
      get() {
        return this.isShow;
      },
      set(val) {
        this.$emit("update:isShow", val);
      }
    }
  },
  methods: {
    ...mapActions("picture", ["addAnimationBook", "changeAnimationBook"]),
    getBackgroundImage(path) {
      if (!path) return "";
      return `url(${normalizationPath(path)}) center / 100% 100%`;
    },
    // 切换插画中的绘本
    changeBook(id) {
      //  判断是否修改了
      this.changeAnimationBook(id);
      this.dialogVisible = false;
    },
    // 给当前绘本添加插画页
    addBook() {
      const book = {
        id: v4(),
        bg: "",
        animationList: [], // 添加一页插画这是什么东西？ 这不对吧
        text: []
      };
      this.addAnimationBook(book);
    },
    onCancel() {
      this.dialogVisible = false;
      // this.$emit("onCancel", this.row);
    },
    handleClose() {
      this.dialogVisible = false;
      // this.$emit("onClose", this.row);
    },
    onConfirm() {
      this.dialogVisible = false;
      // this.$emit("onConfirm", this.row);
    }
  }
};
</script>
<style lang="scss">
.animation-list {
  .book {
    width: 400px;
    margin: 10px auto;
    height: 120px;
    border: 1px solid #666;
    cursor: pointer;
  }
  .new {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
