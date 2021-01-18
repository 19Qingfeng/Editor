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
  animationList: []; // 动画元素列表
  text: []; // 文字背景
}
