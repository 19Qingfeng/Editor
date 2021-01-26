<template>
  <div class="canvas-wrapper" ref="canvasWrapper">
    <div
      ref="canvas"
      class="canvas"
      @drop="onDrop"
      @dragover="onDragOver"
      :style="{ background: bgImage }"
    >
      <template v-for="source in curAnimationBookSource">
        <div
          :key="source.id"
          :class="{ 'hover-animation': curId === source.id }"
          :style="{
            width: source.displayWidth + 'px',
            height: source.displayHeight + 'px',
            top: source.displayTop + 'px',
            left: source.displayLeft + 'px',
            zIndex: source.level,
            background: getBackgroundImage(source.path)
          }"
          draggable="true"
          @click="handleClick(source)"
          @dragstart="
            e => {
              onDragStart(e, source);
            }
          "
          class="single-source"
        >
          <template v-if="curId === source.id">
            <div class="scale add" @click.stop="onScale(source, 'add')">+</div>
            <div class="scale sub" @click.stop="onScale(source, 'sub')">-</div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import { basename, extname } from "path";
import debounce from "lodash/debounce";
import {
  getActualDisplaySize,
  getOffsetSize,
  getFormatJsonSize
} from "@/utils/size";
import {
  parseStringify,
  getStringify,
  getCanvasSize,
  getPictureSize,
  normalizationPath
} from "@/utils/index";

export default {
  computed: {
    ...mapState("picture", ["animationBook"]),
    ...mapGetters("picture", [
      "animationBookList",
      "curAnimationBook",
      "canvasScale",
      "curAnimationBookBg",
      "curAnimationBookSource",
      "curAnimationEleEventList"
    ])
  },
  watch: {
    "curAnimationBook.bg": {
      handler(bg) {
        if (!bg) this.bgImage = "";
      }
    }
  },
  data() {
    return {
      curId: "", // 当前Id
      canvas: null,
      canvasLeft: 0,
      canvasTop: 0,
      bgImage: "",
      sourList: [] // 应该是vuex中 先占位
    };
  },
  methods: {
    ...mapActions("picture", [
      "changeScale",
      "addSourceToCurrentBook",
      "changeAnimationBookBg",
      "changeAnimationStyle",
      "updateAnimationStyle"
    ]),
    getBackgroundImage(path) {
      if (!path) return "";
      return `url(${normalizationPath(path)}) center / 100% 100%`;
    },
    onDragStart(e, source) {
      const { offsetX, offsetY } = e;
      // 缩放开始
      e.dataTransfer.setData("isFirst", getStringify(false));
      e.dataTransfer.setData("source", getStringify(source));
      // 偏移量计算
      e.dataTransfer.setData(
        "offset",
        getStringify({
          x: offsetX,
          y: offsetY
        })
      );
    },
    // 缩放
    onScale(source, type, coefficient = 0.01) {
      const symbolType = type === "add" ? 1 : -1;
      const {
        id,
        displayHeight,
        displayWidth,
        height,
        width,
        originSize: {
          displayHeight: originDH,
          displayWidth: orginDW,
          height: originH,
          width: orginW
        }
      } = source;
      const scaleDisplayHeight = originDH * coefficient;
      const scaleDisplayWidth = orginDW * coefficient;
      const scaleHeight = originH * coefficient;
      const scaleWidth = orginW * coefficient;
      // 等比例进行缩放
      const update = {
        id,
        displayHeight: displayHeight + symbolType * scaleDisplayHeight,
        displayWidth: displayWidth + symbolType * scaleDisplayWidth,
        height: height + symbolType * scaleHeight,
        width: width + symbolType * scaleWidth
      };
      this.updateAnimationStyle(update);
    },
    onDragOver(e) {
      e.preventDefault();
    },
    onDrop(e) {
      const source = parseStringify(e.dataTransfer.getData("source"));
      const isFirst = parseStringify(e.dataTransfer.getData("isFirst"));
      const { x, y } = parseStringify(e.dataTransfer.getData("offset"));
      const { name } = source;
      const sourceName = basename(name);
      const extName = extname(name);
      const isPng = extName.indexOf("webp") !== -1;
      const isBg = sourceName.indexOf("_bg") !== -1;
      if (isBg) {
        this.hanldeBgPng(source);
      } else if (!isBg && isPng) {
        this.hanldeNotBgPng(e, source, isFirst, x, y);
      }
    },
    // 处理非背景图
    hanldeNotBgPng(e, source, isFirst, ...offset) {
      console.log(offset, "offset");
      if (isFirst) {
        this._handleFirstAnimation(e, source, offset);
      } else {
        this._handleNotFirstAnimation(e, source, offset);
      }
    },

    handleClick(source) {
      const { id } = source;
      this.changeAnimationStyle(id);
      // 高亮当前动画
      this.curId = id;
    },
    // 计算画布中实际的偏移量和在2340和1440映射偏移量
    getOffset(e, { offsetX, offsetY }) {
      // 画布中实际偏移量 针对左上角
      const displayLeft = e.clientX - this.canvasLeft - offsetX; //  - displayWidth / 2;
      const displayTop = e.clientY - this.canvasTop - offsetY; // - displayHeight / 2;
      // 映射在2340和1440的偏移量
      const top = getFormatJsonSize(displayTop, this.canvasScale);
      const left = getFormatJsonSize(displayLeft, this.canvasScale);
      return {
        displayLeft,
        displayTop,
        top,
        left
      };
    },
    // 处理非第一次元素拖拽（画布内的元素拖动）
    _handleNotFirstAnimation(e, source, offset) {
      const { id } = source;
      const [offsetX, offsetY] = offset;
      // 计算相对于canvas画布的实际显示偏移位置 左上角
      const { displayLeft, displayTop, top, left } = this.getOffset(e, {
        offsetX,
        offsetY
      });
      this.updateAnimationStyle({
        id,
        displayLeft,
        displayTop,
        top,
        left
      });
    },
    // 处理第一次元素拖放 需要额外格式化尺寸(画布元素外拖拽进来)
    _handleFirstAnimation(e, { id, name, path }, offset) {
      const [offsetX, offsetY] = offset;
      getPictureSize(normalizationPath(path)).then(({ height, width }) => {
        console.log(height, "height");
        console.log(width, "width");
        const displayHeight = getActualDisplaySize(height, this.canvasScale);
        const displayWidth = getActualDisplaySize(width, this.canvasScale);
        // 计算相对于canvas画布的实际显示偏移位置 左上角
        const { displayLeft, displayTop, top, left } = this.getOffset(e, {
          offsetX,
          offsetY
        });
        const source = {
          id,
          height,
          name,
          width,
          left,
          top,
          path,
          displayHeight,
          displayWidth,
          displayTop,
          displayLeft,
          readingGuide: false,
          level: 1,
          firstAnimation: "", // 只有flr有 等待处理
          originSize: {
            displayHeight,
            displayWidth,
            width,
            height
          },
          // eventList: [] // 初始化动画事件是空 修改初始化的EventList 是Object而非Array
          eventList: {
            auto: [],
            click: [],
            animactionComplete: []
          }
        };
        this.addSourceToCurrentBook(source);
      });
    },
    // 处理背景图
    hanldeBgPng({ id, name, path }) {
      this.bgImage = this.getBackgroundImage(path);
      // 绘本当前页添加资源
      this.changeAnimationBookBg({
        id,
        name,
        path
      });
    },

    // 初始化画布大小
    initCanvasSize() {
      const el = this.$refs["canvasWrapper"];
      const canvas = this.$refs["canvas"];
      // 当前元素尺寸
      const { offsetWidth, offsetHeight } = el;
      // 按照比例缩放
      const { scaleWidth, scaleHeight, scale } = getCanvasSize(
        offsetWidth,
        offsetHeight
      );
      this.changeScale(scale);
      console.log(scale, "scale");
      console.log("针对2340*1440尺寸下的最终映射比例", scale);
      canvas.style.height = `${scaleHeight}px`;
      canvas.style.width = `${scaleWidth}px`;
      this.$nextTick(() => {
        const { x, y } = getOffsetSize(this.canvas);
        this.canvasLeft = x;
        this.canvasTop = y;
      });
    },

    // 窗口缩放事件
    scaleEvent: debounce(function() {
      // 重新初始化画布大小
      this.initCanvasSize();
      // 缩放比计算有问题
    }, 200),

    // 监听大小缩放事件
    initScaleEvent() {
      window.addEventListener("resize", this.scaleEvent);
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.scaleEvent);
  },
  created() {
    const { path } = this.curAnimationBookBg;
    this.bgImage = this.getBackgroundImage(path);
  },
  mounted() {
    this.canvas = this.$refs["canvas"];
    this.initCanvasSize();
    this.initScaleEvent();
    // initCanvasSize
  }
};
</script>

<style lang="scss" scoped>
.canvas-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .canvas {
    position: relative;
    overflow: hidden;
    background: red;
    margin: 0px;
    height: 100%;
    width: 100%;
    .hover-animation {
      outline: 1px solid red;
    }
    .single-source {
      position: absolute;
      .scale {
        width: 25px;
        height: 25px;
        display: flex;
        justify-content: center;
        // align-items: center;
        line-height: 24px;
        font-size: 20px;
        position: absolute;
        top: 0;
        color: #409eff;
        border-radius: 50%;
      }
      .add {
        right: 35px;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.6);
      }
      .sub {
        right: 5px;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.6);
      }
    }
  }
}
</style>
