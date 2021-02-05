<template>
  <el-drawer
    size="200px"
    title="添加交互"
    :visible.sync="drawerShow"
    :with-header="false"
    custom-class="operaction-bottom-drawer"
  >
    <div class="drawer-inner">
      <div class="add-interactive">
        <span class="label"> 选择操作: </span>
        <el-select v-model="operationType" clearable>
          <el-option
            v-for="operation in operationList"
            :key="operation.value"
            :value="operation.value"
            :label="operation.label"
          />
        </el-select>
      </div>

      <el-button type="primary" :disabled="disableBtn" @click="addInteractive">
        添加操作
      </el-button>
    </div>
    <component
      v-for="event in curAnimationEleEventList"
      :id="event.id"
      :type="event.type"
      :eventType="event.eventType"
      :is="getComponentByType(event.type)"
      :key="event.id"
    />
  </el-drawer>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import BaseOpertion from "./EventOperation/base";
import MusicOperation from "./EventOperation/music";
import PositionOperation from "./EventOperation/position";
import TextOpeartion from "./EventOperation/text";
import ReadWorkOperation from "./EventOperation/readWork";
import { AnimationEvent } from "@/utils/model";
export default {
  name: "Drawer",
  components: {
    BaseOpertion,
    MusicOperation,
    PositionOperation,
    TextOpeartion,
    ReadWorkOperation
  },
  data() {
    return {
      operationType: "",
      operationList: [
        {
          value: "playAnimation",
          label: "播放动画"
        },
        {
          value: "sound",
          label: "播放配音"
        },
        {
          value: "effectSound",
          label: "播放音效"
        },
        {
          value: "bgSound",
          label: "播放音乐"
        },
        {
          value: "transform",
          label: "更新位置"
        },
        {
          value: "stopAnimation",
          label: "停止动画"
        },
        {
          value: "text",
          label: "更新文本"
        },
        {
          value: "readWork",
          label: "点读词"
        }
      ]
    };
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    // 当前事件类型
    eventType: {
      type: String,
      required: ""
    }
  },
  computed: {
    ...mapGetters("picture", ["curAnimationEleEventList"]),
    drawerShow: {
      get() {
        return this.isShow;
      },
      set(val) {
        this.$emit("update:isShow", val);
      }
    },
    disableBtn() {
      return this.operationType === "";
    }
  },
  methods: {
    ...mapActions("picture", ["updateAnimationEvent"]),
    getComponentByType(type) {
      const moduleNameList = {
        playAnimation: "BaseOpertion",
        stopAnimation: "BaseOpertion",
        sound: "MusicOperation", // 配音
        effectSound: "MusicOperation", // 音效
        bgSound: "MusicOperation", // 背景音乐
        transform: "PositionOperation", //位置
        text: "TextOpeartion", // 文本
        readWork: "ReadWorkOperation"
      };
      return moduleNameList[type];
    },
    addInteractive() {
      const eventObj = new AnimationEvent({
        target: "",
        playSound: "",
        eventType: this.eventType,
        delay: 0,
        position: {
          x: 0,
          y: 0,
          w: 0,
          h: 0
        },
        level: 1,
        work: "",
        loop: false,
        type: this.operationType,
        textBefore: "",
        textAfter: ""
      });
      this.updateAnimationEvent(eventObj);
    }
  }
};
</script>

<style lang="scss">
.operaction-bottom-drawer {
  box-sizing: border-box;
  padding: 20px 5px;
  .drawer-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    .label {
      width: 90px;
    }
    .add-interactive {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 10px;
    }
  }
  .el-drawer__body {
    overflow: auto;
  }
}
</style>
