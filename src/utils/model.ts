import { Event } from "../types";
import { getActualDisplaySize } from "./size";
import { v4 } from "uuid";
// 动画事件构造函数
class AnimationEvent implements Event {
  id: string;
  target?: string; // 目标元素 仅针对canvas上出现的元素 比如动画的key
  playSound?: string; // 目标元素 仅针对canvas上不出现的元素 比如音乐，音频，背景之类的key
  delay?: number;
  position?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  loop?: boolean;
  level?: number;
  textBefore?: string;
  textAfter?: string;
  eventType: "auto" | "click" | "animactionComplete";
  type:
    | "playAnimation" // 播放动画
    | "stopAnimation" // 暂停动画
    | "sound" // 配音
    | "transform" // 变换
    | "text" // 文本
    | "bgSound" // 背景音乐
    | "effectSound"; // 播放音效;
  constructor(params: Event) {
    this.id = v4();
    this.target = params.target;
    this.playSound = params.playSound; // 音乐name
    this.type = params.type;
    this.eventType = params.eventType;
    // if (params.delay) {
    this.delay = params.delay;
    // }
    if (params.position) {
      this.position = params.position;
      // this.x = params.x;
      // this.y = params.y;
      // this.w = params.w;
      // this.h = params.h;
    }
    // if (params.level) {
    this.level = params.level;
    // }
    // if (params.loop) {
    this.loop = params.loop;
    // }
    // if (params.textBefore) {
    this.textBefore = params.textBefore;
    // }
    // if (params.textAfter) {
    this.textAfter = params.textAfter;
    // }
  }
}

// 文字构造函数
class TextModel {
  id: string;
  sourceId: string; // 对应生成JSON的ID
  height: number; // 1440下的高度
  width: number; // 2340下的高度
  left: number;
  top: number;
  name: string; // 文字内容
  // display系列为当前屏幕展示的
  displayHeight: number;
  displayWidth: number;
  displayTop: number;
  displayLeft: number;
  readingGuide: boolean; // 不知道文字有没有
  level: number;
  originSize: {
    displayHeight: number;
    displayWidth: number;
    width: number;
    height: number;
  };
  eventList: {
    auto: Event[];
    click: Event[];
    animactionComplete: Event[];
  };
  type: "text";
  constructor({
    id,
    name,
    displayLeft,
    displayTop,
    widthScale,
    heightScale,
    top,
    left
  }: any) {
    this.id = id;
    this.sourceId = id;
    this.height = 200; // 默认200
    this.width = 600; // 默认 600
    this.displayHeight = getActualDisplaySize(this.height, heightScale);
    this.displayWidth = getActualDisplaySize(this.width, widthScale);
    this.displayLeft = displayLeft;
    this.displayTop = displayTop;
    this.left = left; // 计算出来的 根据displayLet和scaleWidth计算
    this.top = top; // 同理
    this.name = name;
    this.readingGuide = false;
    this.level = 1;
    this.originSize = {
      displayHeight: this.displayHeight,
      displayWidth: this.displayWidth,
      height: this.height,
      width: this.width
    };
    this.type = "text";
    this.eventList = {
      auto: [],
      click: [],
      animactionComplete: []
    };
  }
}

export { AnimationEvent, TextModel };
