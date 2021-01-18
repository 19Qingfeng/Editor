import { dialog } from "electron";
import { FilePath } from "./type";
import { Source } from "../types";
import path from "path";
import cloneDeep from "lodash/cloneDeep";

// 格式化路径 file协议
export const normalizationPath = (path: string): string => {
  return `local-resource://${path}`;
};

const openSingleFileDialog = async (
  options: any
): Promise<FilePath | undefined> => {
  const mergeOptions = Object.assign({}, options);
  const { canceled, filePaths }: any = await dialog.showOpenDialog(
    mergeOptions
  );

  if (!canceled && filePaths.length > 0) {
    const filePath = filePaths[0];
    return {
      filePath: normalizationPath(filePath), // file协议地址
      originPath: filePath // 原始路径
    };
  }
};

// 分类资源
interface SourceList {
  动画: Source[];
  文字先留着: Source[];
  音乐: Source[];
  音效: Source[];
}
export const parseSourceList = (sourceList: Source[]): SourceList => {
  const result = Object.create(null);
  const source = cloneDeep(sourceList);
  const sourceMap: any = {
    webp: "图片",
    docx: "文字先留着",
    mp3: "音乐",
    wav: "音效"
  };
  source.forEach(file => {
    const { name } = file;
    const extName = path.extname(name).replace(".", "");
    if (!Object.hasOwnProperty.call(sourceMap, extName)) return;
    if (!result[sourceMap[extName]]) {
      result[sourceMap[extName]] = [];
    }
    result[sourceMap[extName]].push(file);
  });
  return result;
};

export { openSingleFileDialog };
