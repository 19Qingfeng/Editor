<template>
  <div class="m-editor">
    <header class="header">
      <top-cmp />
    </header>
    <div class="content">
      <source-cmp class="source" :sourceList="sourceList" />
      <div class="canvas">
        <canvas-cmp />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import TopCmp from "./components/header/index";
import SourceCmp from "./components/source/index";
import CanvasCmp from "./components/canvas";
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Editor",
  provide() {
    return {
      getSourceList: this.getSourceList
    };
  },
  components: {
    TopCmp,
    SourceCmp,
    CanvasCmp
  },
  computed: {
    ...mapState("picture", ["currentPicture"]),
    ...mapGetters("picture", ["sourceList"])
  },
  methods: {
    getSourceList() {
      return cloneDeep(this.sourceList);
    }
  }
};
</script>

<style lang="scss">
.m-editor {
  height: 100%;
  .header {
    height: 68px;
  }
  .content {
    height: calc(100% - 68px);
    display: flex;
    .source {
      width: 260px;
      height: 100%;
    }
  }
}
</style>
