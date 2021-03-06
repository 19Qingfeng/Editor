import { dialog } from "electron";
import { FilePath } from "./type";
import { Source } from "../types";
import path from "path";
import cloneDeep from "lodash/cloneDeep";

// 格式化路径 file协议
export const normalizationPath = (path: string): string => {
  return `local-resource://${path}`;
};

// 根据文件名判断是动画还是图片
export const decisionAnimation = (name: string): string => {
  if (name.indexOf("_flr") !== -1) {
    return "animation";
  }
  return "image";
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

export function parseTime(time: any, cFormat: any) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const timeStr: any = format.replace(
    /{([ymdhisa])+}/g,
    (result: any, key: any) => {
      const value = (formatObj as any)[key];
      // Note: getDay() returns 0 on Sunday
      if (key === "a") {
        return ["日", "一", "二", "三", "四", "五", "六"][value];
      }
      return value.toString().padStart(2, "0");
    }
  );
  return timeStr;
}

// 分类资源
interface SourceList {
  动画: Source[];
  文字先留着: Source[];
  音乐: Source[];
  音效: Source[];
}

interface Word {
  type: "text";
  name: string;
  id: string;
}

// 这个函数耗时太长了 2.03ms waring
const parseSourceList = (
  sourceList: Source[],
  wordList: Word[]
): SourceList => {
  const result = Object.create(null);
  const source = cloneDeep(sourceList);
  // 后缀名判断 第二优先级
  const sourceMap: any = {
    webp: "图片",
    mp3: "音乐",
    wav: "音效"
  };
  // 第一优先级 文件名判断
  const firstLevelSource: any = {
    _bg: "背景",
    _flr: "动画"
  };
  // 添加了所有的图片和音乐以及音效
  source.forEach(file => {
    const { name } = file;
    // 第一优先级判断 根据名称判断
    for (const key of Object.keys(firstLevelSource)) {
      if (name.indexOf(key) !== -1) {
        // 存在
        !result[firstLevelSource[key]] && (result[firstLevelSource[key]] = []);
        result[firstLevelSource[key]].push(file);
        return;
      }
    }
    // // 判断是否是动画
    // if (name.indexOf("_flr") !== -1) {
    //   if (!result["动画"]) result["动画"] = [];
    //   result["动画"].push(file);
    //   return;
    // }
    // 等待确定了各系列命名这里 重新整理 之前写的逻辑全部在做添加
    // 添加背景
    // if (name.indexOf("_bg") !== -1) {
    //   if (!result["背景"]) result["背景"] = [];
    //   result["背景"].push(file);
    //   return;
    // }

    // 书写第二优先级 根据后缀判断
    const extName = path.extname(name).replace(".", "");
    if (!Object.hasOwnProperty.call(sourceMap, extName)) return;
    if (!result[sourceMap[extName]]) {
      result[sourceMap[extName]] = [];
    }
    result[sourceMap[extName]].push(file);
  });
  // 文字是额外解析的 所以文字额外添加
  wordList.forEach((word: Word) => {
    if (!result["文字"]) result["文字"] = [];
    result["文字"].push(word);
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
  // 针对与2340的缩放比 最终缩放比例
  const widthScale = 2340 / scaleWidth; // 宽度缩放比例
  const heightScale = 1440 / scaleHeight; // 高度缩放比例
  return {
    scaleWidth,
    scaleHeight,
    widthScale,
    heightScale
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
