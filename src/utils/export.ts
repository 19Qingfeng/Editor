/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable-next-line @typescript-eslint/camelcase */
import { AnimationBook } from "@/types";
import { PageList, EditorJson, ExportJson } from "./type";

// 获得每一页组成的
const formatPageList = (pageList: AnimationBook[]): Page:Page => {
  
};

// 外层格式化
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
