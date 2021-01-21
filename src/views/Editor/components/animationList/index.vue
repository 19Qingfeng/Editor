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
      :key="book.id"
      @click="changeBook(book.id)"
    >
      {{ book }}
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
    // 切换插画中的绘本
    async changeBook(id) {
      //  判断是否修改了
      await this.$confirm("此操作将丢失未保存信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      this.changeAnimationBook(id);
      this.dialogVisible = false;
    },
    // 给当前绘本添加插画
    addBook() {
      const book = {
        id: v4(),
        bg: "",
        animationBookList: [],
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
