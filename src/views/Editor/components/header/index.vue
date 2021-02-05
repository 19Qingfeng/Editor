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

      <section class="music-warpper" v-show="videoName !== ''">
        <div class="name">{{ videoName }}</div>
        <div class="progress">
          <el-progress
            :text-inside="true"
            :stroke-width="12"
            :percentage="speedProcess"
            status="success"
            size="mini"
          ></el-progress>
        </div>
        <div
          class="stop-music iconfont icon-tingzhi"
          @click="handleStopMusic"
        ></div>
      </section>
    </div>

    <animation-list v-if="isShow" :is-show.sync="isShow" />
  </div>
</template>

<script>
import { saveJsonToFile } from "@/utils/excel";
import { mapActions, mapGetters, mapState } from "vuex";
import { formatOuterObj } from "../../../../utils/export";
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
    ...mapGetters("picture", [
      "curAnimationElement",
      "curAnimationBookIndex",
      "animationBookList"
    ]),
    ...mapGetters("music", ["speedProcess"]),
    ...mapState("picture", ["currentPicture", "copyAnimationBook"]),
    ...mapState("music", [
      "video",
      "videoDuration",
      "videoCurrentTime",
      "videoName"
    ]),
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
            this.saveAnimationBook();
            this.$message.success({
              showClose: true,
              message: "保存成功"
            });
          }
        },
        {
          text: "复制",
          on: () => {
            // 复制的话 直接将这一张的内容复制一下 id要不要重复
            this.copyCurAnimationBook();
            this.$message.success({
              showClose: true,
              message: "复制成功"
            });
          }
        },
        {
          text: "粘贴",
          on: () => {
            // 粘贴当前页数
            this.$confirm("此操作会丢失当前页信息，确定继续吗?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              if (!this.animationBookList.length || !this.copyAnimationBook.id)
                return;
              this.pasteCurAnimationBook(this.curAnimationBookIndex);
              this.$message.success({
                showClose: true,
                message: "粘贴成功"
              });
            });
          }
        },
        {
          text: "顶层",
          on: () => {
            // this.handleChangePage(0);
            this.handleChangeAnimationLevel(2000);
          }
        },
        {
          text: "底层",
          on: () => {
            // this.handleChangePage(this.animationBookList.length - 1);
            this.handleChangeAnimationLevel(1);
          }
        },
        {
          text: "导出",
          on: () => {
            this.saveAnimationBook();
            this.exportPicture();
            this.$message.success("导出成功");
          }
        },
        {
          text: "返回",
          on: () => {
            this.handleOnBace();
          }
        }
      ];
    }
  },
  methods: {
    ...mapActions("picture", [
      "saveAnimationBook",
      "changeAnimationBook",
      "copyCurAnimationBook",
      "pasteCurAnimationBook",
      "updateAnimationStyle"
    ]),
    ...mapActions("music", ["hanldeStopMusic"]),
    // 打开绘本中的插画弹窗
    openPictureList() {
      this.isShow = true;
    },
    handleOnBace() {
      // 先进行处理返回
      this.$confirm("此操作会丢失未保存信息，确定继续吗?", "提示", {
        confirmButtonText: "强行退出",
        cancelButtonText: "保存后退出",
        type: "warning"
      })
        .catch(() => {
          this.saveAnimationBook();
        })
        .finally(() => {
          this.$router.push({
            name: "Home"
          });
        });
    },
    // 停止音乐
    handleStopMusic() {
      this.hanldeStopMusic();
    },
    // 层级
    handleChangeAnimationLevel(level) {
      if (!this.curAnimationElement.id) return;
      const { id } = this.curAnimationElement;
      this.updateAnimationStyle({
        id,
        level
      });
    },
    // 切换页数
    handleChangePage(index) {
      const page = this.animationBookList[index];
      const pageId = page.id;
      if (!pageId) {
        return;
      }
      this.changeAnimationBook(pageId);
      this.$message.success({
        message: "切换成功",
        showClose: true
      });
    },
    // 导出绘本
    exportPicture() {
      const result = formatOuterObj(this.currentPicture);
      // 获得资源存放路径 然后根据路径打包
      const saveDirPath = this.currentPicture.sourceList.find(i => {
        return i.path;
      }).path;
      saveJsonToFile(saveDirPath, result, "result.json");
    }
  }
};
</script>

<style lang="scss" scoped>
.editor-top {
  height: 100%;
  box-sizing: border-box;
  padding-left: 20px;
  position: relative;
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
  .music-warpper {
    display: flex;
    position: absolute;
    right: 20px;
    width: 300px;
    align-items: center;
    .name {
      margin-right: 10px;
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .progress {
      flex: 1;
    }
    .stop-music {
      color: #000;
      font-weight: 600;
      margin-left: 6px;
    }
  }
  background: $bg-primary;
}
</style>
