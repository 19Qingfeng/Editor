<template>
  <div class="m-picture-list">
    <div v-for="book in pictureList" :key="book.id" class="picture-wrapper">
      <img class="img" :src="book.cover" />
      <div class="content-wrapper">
        <div>{{ book.baseInfo.name }}</div>
        <div>张数</div>
        <div>日期</div>
      </div>
      <div class="btn-wrapper">
        <el-button @click="handleEditBase(book.id)">基础信息</el-button>
        <el-button
          @click="handleEditBook(book.id)"
          type="primary"
          icon="el-icon-eleme"
          >绘本</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
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
      > button {
        flex: 1;
      }
    }
  }
}
</style>
