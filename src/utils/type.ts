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
  animations: string; // 动画动作 暂时不理会
  first_animation: string;
  text: ""; // 文本资源ID 对应生成JSON中的ID
  attributes: any; // 富文本不理会
  actions: {
    auto: Event[];
    click: Event[];
    animaction_complete: Event[];
  };
}

// 今天吧接口写完

// 事件对象
export interface Event {
  type: "bgSound" | "";
}

export interface EditorJson extends PictureBook {
  [props: string]: any;
}
