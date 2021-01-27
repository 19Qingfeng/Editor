<script>
import { mapActions, mapGetters } from "vuex";
import path from "path";
import cloneDeep from "lodash/cloneDeep";
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    eventType: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    // 获取当前所有的动画元素 自己选吧
    ...mapGetters("picture", [
      "curAnimationBookSource",
      "sourceList", // 所有资源
      "curAnimationEleEventList"
    ]),
    // 当前操作的事件对象
    curEvent() {
      return this.curAnimationEleEventList.find(i => i.id === this.id);
    },
    // 所有音乐/音频文件
    musicSourceList() {
      return this.sourceList.filter(i => {
        return [".mp3", ".wav"].includes(path.extname(i.name));
      });
    },
    // 目标元素
    curTarget: {
      get() {
        return this.curEvent.target;
      },
      set(val) {
        this.updateAnimationEvent({
          id: this.id,
          eventType: this.eventType,
          target: val
        });
      }
    },
    // 音乐/音频/背景音乐
    curPlaySound: {
      get() {
        return this.curEvent.playSound;
      },
      set(val) {
        this.updateAnimationEvent({
          id: this.id,
          playSound: val,
          eventType: this.eventType
        });
      }
    },
    // 延迟
    curDelay: {
      get() {
        return this.curEvent.delay;
      },
      set(val) {
        this.updateAnimationEvent({
          id: this.id,
          eventType: this.eventType,
          delay: val
        });
      }
    },
    // 位置X
    curX: {
      get() {
        return this.curEvent.position.x;
      },
      set(val) {
        this.upDatePosition("x", val);
      }
    },
    // 位置Y
    curY: {
      get() {
        return this.curEvent.position.y;
      },
      set(val) {
        this.upDatePosition("y", val);
      }
    },
    curW: {
      get() {
        return this.curEvent.position.w;
      },
      set(val) {
        this.upDatePosition("w", val);
      }
    },
    curH: {
      get() {
        return this.curEvent.position.h;
      },
      set(val) {
        this.upDatePosition("h", val);
      }
    },
    // 是否循环
    curLoop: {
      get() {
        return this.curEvent.loop;
      },
      set(val) {
        this.updateAnimationEvent({
          id: this.id,
          eventType: this.eventType,
          loop: val
        });
      }
    },
    // 层级
    curLevel: {
      get() {
        return this.curEvent.level;
      },
      set(val) {
        this.updateAnimationEvent({
          id: this.id,
          eventType: this.eventType,
          level: val
        });
      }
    },
    // 文字之前
    curTextBefore: {
      get() {
        return this.curEvent.textBefore;
      },
      set(val) {
        // nothing
      }
    },
    // 文字之后
    curTextAfter: {
      get() {
        return this.curEvent.curTextAfter;
      },
      set(val) {
        // nothing
      }
    }
  },
  methods: {
    ...mapActions("picture", ["updateAnimationEvent"]),
    parseEventType(type) {
      const typeList = {
        auto: "自动",
        click: "点击",
        animactionComplete: "动画完成"
      };
      return typeList[type];
    },
    upDatePosition(key, val) {
      const clonePosition = cloneDeep(this.curEvent.position);
      clonePosition[key] = val;
      this.updateAnimationEvent({
        id: this.id,
        eventType: this.eventType,
        position: clonePosition
      });
    },
    getTypeName(type) {
      const typeList = {
        playAnimation: "播放动画",
        sound: "播放配音",
        effectSound: "播放音效",
        bgSound: "播放音乐",
        transform: "更新位置",
        stopAnimation: "停止动画",
        text: "更新文本"
      };
      return typeList[type];
    },
    hanldeDelete() {
      const id = this.id;
      console.log(`从vuex中删除对应${id}就可以了`);
    }
  }
};
</script>
