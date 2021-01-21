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
  eventList: []; // 动画存在事件绑定
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
  top?: number;
  eventList?: []; // 动画存在事件绑定
}
