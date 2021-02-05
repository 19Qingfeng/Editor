/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable-next-line @typescript-eslint/camelcase */
import { AnimationBook, Animation, Event } from "@/types";
import { Page, Sprite, EditorJson, ExportJson, SpriteEvent } from "./type";

// 涉及最终坐标使用这个来试试 x -210  y -180
// 格式化每一个动画中的动画插画内容
const formatEvent = (eventList: Event[]): SpriteEvent[] => {
  return eventList.map((event: Event) => {
    return {
      type: event.type,
      widget_id: event.target || event.textBefore!,
      action_id: event.id,
      word: event.work,
      delay: event.delay,
      position: {
        x: event.position?.x && event.position?.x - 210,
        y: event.position?.y && event.position?.y - 180,
        w: event.position?.w,
        h: event.position?.h
      },
      animations: event.animationName,
      playSound: event.playSound, // 音乐对应的name
      text: event.textAfter,
      attributes: "" // 无用
    };
  });
};

// 格式化每一页中插画中的动画列表
const formatSpriteList = (list: Animation[], bg: any): Sprite[] => {
  let fuseAnimationList = list;
  // 整合背景图进入bg
  if (bg && bg.id) {
    const bgAnimation = {
      id: bg.id,
      type: bg.type,
      name: bg.name,
      tip: "",
      level: -1,
      file_name: "", // bg相对路径
      left: -210,
      top: -180,
      width: 2340,
      height: 1440,
      eventList: {
        auto: [], // this.formatEvent()
        click: [],
        animactionComplete: []
      }
    };
    fuseAnimationList = [
      bgAnimation,
      ...list.sort((a, b) => b.level - a.level) // 根据层级排序
    ];
  }
  return fuseAnimationList.map((animation: Animation) => {
    return {
      widget_id: animation.id,
      type: animation.type, // 先占位 到时候得加字段 我这边 根据name区分一下  根据后缀区分一下
      tip: "", // 暂时无用
      file_name: animation.name, // 相对路径 得加字段 如果是文字 那么就处理成一起 非文字就打包到一起
      position: {
        x: animation.left - 210,
        y: animation.top - 180,
        w: animation.width,
        h: animation.height
      },
      animations: "", // 动画填的字段 字段需要 不理会值
      first_animation: animation.firstAnimation,
      text: animation.sourceId,
      attributes: "", // 富文本不管他
      actions: {
        auto: formatEvent(animation.eventList.auto),
        click: formatEvent(animation.eventList.click),
        animaction_complete: formatEvent(animation.eventList.animactionComplete)
      }
    };
  });
};

// 格式化每一页插画
const formatPageList = (pageList: AnimationBook[]): Page[] => {
  return pageList.map((page: AnimationBook, index: number) => {
    return {
      interrupt: true, // 无用
      page_index: index, // 索引
      color: "#fff", // 背景色
      sprite_list: formatSpriteList(page.animationList, page.bg) // 动画元素列表
    };
  });
};

// 外层格式化 获得当前绘本信息
const formatOuterObj = (editorJson: EditorJson): ExportJson => {
  const parseJsonObj: ExportJson = Object.create(null);
  // animationBookList插画信息
  const { baseInfo, animationBookList } = editorJson;
  const mapList = {
    title: "name",
    author: "author",
    version: "1.0",
    creat_date: "",
    page_list: formatPageList(animationBookList)
  };
  Object.keys(mapList).forEach(key => {
    if (Object.hasOwnProperty.call(baseInfo, key)) {
      parseJsonObj[key] = baseInfo[key];
    } else {
      parseJsonObj[key] = (mapList as any)[key];
    }
  });
  return parseJsonObj;
};

export { formatOuterObj };
