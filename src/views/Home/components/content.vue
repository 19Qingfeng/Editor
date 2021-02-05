<template>
  <div class="m-picture-list">
    <div v-for="book in pictureList" :key="book.id" class="picture-wrapper">
      <img class="img" :src="book.cover" />
      <div class="content-wrapper">
        <div v-for="(value, key) in getPictureBaseInfo(book)" :key="key">
          {{ value }}
        </div>
        <div>{{ getPictureSize(book) }}张</div>
      </div>
      <div class="btn-wrapper">
        <el-button
          @click="handleEditBook(book.id)"
          type="primary"
          icon="el-icon-eleme"
          >绘本</el-button
        >
        <el-button @click="handleEditBase(book.id)">基础信息</el-button>
        <el-button
          icon="el-icon-delete"
          circle
          @click="handleDelete(book.id)"
        ></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { parseTime } from "@/utils/index";
export default {
  props: {
    id: {
      type: String,
      default: ""
    },
    isShow: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapState("picture", ["pictureList"])
  },
  methods: {
    // 编辑基础信息
    handleEditBase(id) {
      this.$emit("update:id", id);
      this.$emit("update:isShow", true);
    },
    // 删除
    handleDelete(id) {
      this.$confirm("此操作将永久删除该绘本, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$emit("delPictureBook", id);
      });
    },
    getPictureBaseInfo(book) {
      const info = book.baseInfo;
      return {
        date: parseTime(info.date, "{y}-{m}-{d}"),
        name: info.name
      };
    },
    getPictureSize(book) {
      return book.animationBookList.length;
    },
    handleEditBook(id) {
      this.$emit("editPictureBook", id);
    }
  }
};
</script>
<style lang="scss" scoped>
.m-picture-list {
  display: flex;
  flex-wrap: wrap;
  margin: 10px;
  padding: 5px 10px;
  .picture-wrapper {
    width: 220px;
    height: 360px;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .img {
      border: 1px solid #666;
      width: 200px;
      height: 280px;
    }
    .content-wrapper {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 12px;
      margin: 10px 0;
      display: flex;
      text-align: center;
      width: 100%;
      > div {
        flex: 1;
      }
    }
    .btn-wrapper {
      display: flex;
      width: 100%;
      box-sizing: border-box;
      margin: 0 10px;
      > button {
        flex: 1;
      }
    }
  }
}
</style>
