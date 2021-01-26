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
const parseSourceList = (sourceList: Source[]): SourceList => {
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

// JSON字符串序列化 getStringify
const getStringify = (value: any) => {
  try {
    const formatValue = JSON.stringify(value);
    return formatValue;
  } catch {
    return value;
  }
};
// JSON获取对象 parseStringify
const parseStringify = (value: any): string => {
  try {
    const formatValue = JSON.parse(value);
    return formatValue;
  } catch {
    return value;
  }
};

// 计算画布比例大小
const getCanvasSize = (width: number, height: number) => {
  let scaleHeight,
    scaleWidth = width;
  const _scale = 1440 / 2340; // 插画高比宽
  scaleHeight = scaleWidth * _scale;
  if (scaleHeight > height) {
    scaleHeight = height;
    scaleWidth = scaleWidth * (height / scaleHeight);
  }
  // 针对与2340的缩放比 最终缩放比例 这是宽度缩放比例
  const scale = 2340 / scaleWidth;
  return {
    scaleWidth,
    scaleHeight,
    scale
  };
};

/**
 * @param {String} url 图片url
 * @param {number} max 最大尺寸
 * @returns {Promise<height,width>}
 * 根据URL获取图片尺寸并且等比例缩放尺寸
 */
const getPictureSize = (url: string, max = 10000): Promise<any> => {
  const isImg = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG|webp)$/.test(url);
  if (!isImg) {
    return Promise.resolve({ width: `${max}px`, height: `${max}px` });
  }
  const img = new Image();
  img.src = url;
  const compileSize = (width: number, height: number) => {
    if (width > max || height > max) {
      // 压缩尺寸
      const scale = width > height ? width / max : height / max;
      // return { width: width / scale, height: height / scale };
      width = width / scale;
      height = height / scale;
      compileSize(width, height);
    }
    return { width, height };
  };
  return new Promise(resolve => {
    if (img.complete) {
      const { width, height } = compileSize(img.width, img.height);
      resolve({ width, height });
    } else {
      img.onload = function() {
        const { width, height } = compileSize(img.width, img.height);
        resolve({ width, height });
      };
    }
  });
};

export {
  openSingleFileDialog,
  parseSourceList,
  getStringify,
  parseStringify,
  getCanvasSize,
  getPictureSize
};
