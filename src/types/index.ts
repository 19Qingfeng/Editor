export interface BaseInfo {
  name: string;
  author: string;
  tag: number[];
  age: number;
  category: number;
  preview: string;
  guidance: string;
}

// 绘本存在资源
export interface Source {
  id: string;
  path: string;
  name: string;
}

// 绘本内容
export interface PictureBook {
  id: string;
  baseInfo: BaseInfo;
  cover: string; // cover本地路径
  zip: string; // zip非本地路径 无所谓
  sourceList: Source[];
  animationBookList: AnimationBook[]; // 插画信息
}

// 插画内容
export interface AnimationBook {
  id: string;
  bg: string; // 背景图
  animationList: Animation[]; // 动画元素列表
  text: []; // 文字背景
}

// 背景图内容
export interface Bg {
  id: string;
  path: string;
  name: string;
}

// 当前动画元素
export interface Animation {
  id: string;
  displayHeight: number; // 实际展示的高度 在编辑器上
  displayWidth: number; // 实际展示的宽度 在编辑器上
  width: number; // 2340*1440 下的宽度 JSON中
  height: number; // 2340*1440 下的宽高度 JSON中
  displayLeft: number;
  displayTop: number;
  left: number;
  top: number;
  originSize: {
    displayHeight: number;
    displayWidth: number;
    width: number;
    height: number;
  };
  firstAnimation: string; // 默认第一次播放的动画
  readingGuide: boolean; // 点读引导
  level: number; // 层级
  eventList: Event[]; // 动画存在事件绑定
}

// 需要更新的当前绘本中动画元素的信息
export interface UpdateAnimationInfo {
  [propName: string]: any;
  id: string;
  displayHeight?: number; // 实际展示的高度 在编辑器上
  displayWidth?: number; // 实际展示的宽度 在编辑器上
  width?: number; // 2340*1440 下的宽度 JSON中
  height?: number; // 2340*1440 下的宽高度 JSON中
  displayLeft?: number;
  displayTop?: number;
  left?: number;
  readingGuide?: boolean; // 点读引导
  top?: number;
  firstAnimation?: string;
  level?: number;
  // eventList?: Event[]; // 动画存在事件绑定
  eventList?: {
    auto: Event[];
    click: Event[];
    animactionComplete: Event[];
  };
}

// 动画元素存在绑定的事件列表
export interface Event {
  [propName: string]: any;
  id: string;
  eventType: "auto" | "click" | "animactionComplete";
  type:
    | "playAnimation" // 播放动画
    | "stopAnimation" // 暂停动画
    | "sound" // 配音
    | "transform" // 变换
    | "text" // 文本
    | "bgSound" // 背景音乐
    | "effectSound"; // 播放音效
  target?: string; // 目标动画ID
  playSound?: string; // 音频/音乐/背景的key
  delay?: number;
  position?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  level?: number;
  loop?: boolean;
  textBefore?: string;
  textAfter?: string;
}
