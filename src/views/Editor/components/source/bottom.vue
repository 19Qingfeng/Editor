<template>
  <div class="source-bottom">
    <div class="header">
      <title-cmp :title="title" :btnList="btnList" />
    </div>
    <div class="source-list">
      <div class="title">
        <div class="title">热区</div>
        <div
          class="source"
          @dragstart="onDragStart"
          :data-source="saveHotDataset()"
          draggable="true"
        >
          <!-- 热区元素 本地找一个assets -->
          热区
        </div>
      </div>
      <div v-for="(value, key) in formatSourceList" :key="key">
        <div class="title">{{ key }}</div>

        <template v-for="item in value">
          <!-- 音乐可以播放 -->
          <el-popover
            placement="right"
            width="60"
            trigger="hover"
            :key="item.id"
            v-if="isMusic(item)"
          >
            <el-button @click="handlePlayMusic(item)" type="success"
              >播放</el-button
            >
            <div
              class="source"
              slot="reference"
              :data-source="saveDataset(item)"
              @dragstart="onDragStart"
              draggable="true"
            >
              {{ item.name }}
            </div>
          </el-popover>

          <!-- 一般图片 -->
          <div
            v-else
            class="source"
            :key="item.id"
            :data-source="saveDataset(item)"
            @dragstart="onDragStart"
            draggable="true"
          >
            {{ item.name }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import TitleCmp from "@/components/TitleHeader";
import { v4 } from "uuid";
import {
  parseSourceList,
  getStringify,
  normalizationPath
} from "@/utils/index";
import path from "path";
import { mapActions, mapState } from "vuex";
export default {
  components: {
    TitleCmp
  },
  inject: ["getSourceList", "getWordList"],
  data() {
    return {
      title: "资源库",
      formatSourceList: {},
      btnList: [
        {
          text: "搜索"
        },
        {
          text: "播放"
        }
      ]
    };
  },
  // 感觉就初始化的时候调用就够了
  created() {
    this.initSourceList();
  },
  computed: {
    ...mapState("music", ["video"]),
    sourceList() {
      return this.getSourceList();
    },
    wordList() {
      return this.getWordList();
    }
  },
  methods: {
    ...mapActions("music", ["handleChangeVideo"]),
    initSourceList() {
      // 同时应该增加文字的source 文字的source没有path
      this.formatSourceList = parseSourceList(this.sourceList, this.wordList);
    },
    saveHotDataset() {
      const hot = {
        name: "hot",
        id: v4(),
        type: "hot",
        path: require("@/assets/hot.png")
      };
      return getStringify(hot);
    },
    saveDataset(value) {
      return getStringify(value);
    },
    // 播放音乐
    handlePlayMusic(item) {
      // 操作video就可以啦
      const { path, name } = item;
      this.handleChangeVideo({ path: normalizationPath(path), name });
    },
    // 判断是否是音乐 是否可以播放
    isMusic(item) {
      if (item.text) return false;
      const { name } = item;
      const extName = path.extname(name);
      const musicList = [".mp3", ".wav"];
      return musicList.includes(extName);
    },
    // 拖拽开始
    onDragStart(e) {
      const el = e.target;
      const source = el.dataset.source;
      // 提供首次需要计算大小 其他时候不需要计算了
      e.dataTransfer.setData("isFirst", getStringify(true));
      e.dataTransfer.setData("source", source);
      e.dataTransfer.setData(
        "offset",
        getStringify({
          x: 0,
          y: 0
        })
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.source-bottom {
  height: 100%;
  .header {
    height: 28px;
  }
  .source-list {
    height: calc(100% - 28px);
    overflow-y: auto;
    .title {
      font-size: 14px;
      text-indent: 20px;
      padding: 10px 0;
    }
    .source {
      text-indent: 40px;
      margin: 10px 0;
      cursor: pointer;
    }
  }
}
</style>
