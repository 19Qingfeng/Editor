<template>
  <div class="m-editor">
    <header class="header">
      <top-cmp />
    </header>
    <div class="content">
      <source-cmp class="source" :sourceList="sourceList" />
      <div class="canvas-cmp-wrapper">
        <canvas-cmp />
      </div>
      <operaction-cmp class="opeartion-cmp" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import TopCmp from "./components/header/index";
import SourceCmp from "./components/source/index";
import CanvasCmp from "./components/canvas";
import OperactionCmp from "./components/operaction";
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Editor",
  provide() {
    return {
      getSourceList: this.getSourceList,
      getWordList: this.getWordList
    };
  },
  components: {
    TopCmp,
    SourceCmp,
    CanvasCmp,
    OperactionCmp
  },
  computed: {
    ...mapState("picture", ["currentPicture"]),
    ...mapGetters("picture", ["sourceList", "wordSourceList"])
  },
  methods: {
    ...mapActions("picture", [
      "initAnimationBook",
      "updatePicutreList",
      "clearVuex"
    ]),
    getSourceList() {
      return cloneDeep(this.sourceList);
    },
    getWordList() {
      return cloneDeep(this.wordSourceList);
    }
  },
  beforeDestroy() {
    this.clearVuex();
  },
  created() {
    console.log("created");
    this.initAnimationBook();
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
    .canvas-cmp-wrapper {
      // will-change: transform;
      // transform: translate3d(0, 0, 0);
      height: 100%;
      width: 100%;
    }
    .opeartion-cmp {
      width: 220px;
      height: 100%;
    }
  }
}
</style>
