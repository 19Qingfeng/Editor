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

    <content-cmp />

    <dialog-cmp v-if="isShow" :isShow.sync="isShow" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import HeaderCmp from "./components/header.vue";
import DialogCmp from "./components/pictureDialog.vue";
import ContentCmp from "./components/content.vue";
export default Vue.extend({
  name: "Home",
  components: {
    HeaderCmp,
    DialogCmp,
    ContentCmp
  },
  data() {
    return {
      isShow: false
    };
  },
  methods: {
    addPictureBook() {
      this.isShow = true;
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
