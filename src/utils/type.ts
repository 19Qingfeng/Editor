import { PictureBook } from "../types/index";

export interface FilePath {
  originPath: string; // 本地路径 /user/xxx
  filePath: string; // file协议路径 file://+本地路径
}

export interface ExportJson {
  title: string;
  author: string;
  version: string;
  creat_date: string;
  page_list: Page[];
  [props: string]: any;
}

export interface Page {
  interrupt: boolean;
  page_index: number;
  color: string;
  sprite_list: Sprite[];
}
// 音乐只要路径 没有
// 动画元素
export interface Sprite {
  widget_id: string; // 目标ID 文本也是这个ID(画布上的资源ID)  音乐只要路径不需要ID
  type: "image" | "animation" | "text" | "hot";
  tip: string;
  file_name: string; // 相对路径
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  animations?: string; // 动画动作 暂时不理会
  first_animation?: string;
  text?: string; // 文本资源ID 对应生成JSON中的ID
  attributes?: any; // 富文本不理会
  actions: {
    auto: SpriteEvent[];
    click: SpriteEvent[];
    animaction_complete: SpriteEvent[];
  };
}

// 今天吧接口写完

// 事件对象
export interface SpriteEvent {
  type:
    | "playAnimation" // 播放动画
    | "stopAnimation" // 暂停动画
    | "sound" // 配音
    | "transform" // 变换
    | "text" // 文本
    | "readWork" // 电读
    | "bgSound" // 背景音乐
    | "effectSound"; // 播放音效
  widget_id: string; // 目标元素ID 音乐为空的
  action_id: string; // 本次操作生成的唯一标示符ID
  delay?: number;
  position?: {
    x?: number;
    y?: number;
    w?: number;
    h?: number;
  };
  work?: string; // 点读文字
  animations?: string; // 动画输入框输入的string
  playSound?: string; // 音乐播放的文件名
  text?: string; // text的内容 ？ 应该是ID 更新后的sourceId
  attributes: string; // 没用
}

export interface EditorJson extends PictureBook {
  [props: string]: any;
}
