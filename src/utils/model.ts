import { Event } from "../types";
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
    this.playSound = params.playSound;
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

export { AnimationEvent };
