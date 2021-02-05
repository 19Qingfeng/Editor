<template>
  <div class="m-home">
    <header-cmp />

    <div class="add-btn">
      <el-button
        @click="addPictureBook"
        icon="el-icon-folder-add"
        type="primary"
        size="mini"
        >新建绘本</el-button
      >
    </div>

    <content-cmp
      :id.sync="id"
      :is-show.sync="isShow"
      @editPictureBook="editPictureBook"
      @delPictureBook="deletePicture"
    />

    <dialog-cmp v-if="isShow" :id="id" :isShow.sync="isShow" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import HeaderCmp from "./components/header.vue";
import DialogCmp from "./components/pictureDialog.vue";
import ContentCmp from "./components/content.vue";
import { mapActions } from "vuex";
export default Vue.extend({
  name: "Home",
  components: {
    HeaderCmp,
    DialogCmp,
    ContentCmp
  },
  data() {
    return {
      isShow: false,
      id: ""
    };
  },
  methods: {
    ...mapActions("picture", ["setCurrentEditPictureBook", "delPictureBook"]),
    addPictureBook() {
      this.id = "";
      this.isShow = true;
    },
    editPictureBook(id: string) {
      this.setCurrentEditPictureBook(id);
      // 更新vuex 当前正在编辑的绘本信息
      this.$router.push({
        name: "Editor"
      });
    },
    deletePicture(id: string) {
      this.delPictureBook(id);
    }
  }
});
</script>

<style lang="scss" scoped>
.m-home {
  .add-btn {
    display: flex;
    justify-content: flex-end;
    margin: 10px;
  }
}
</style>
