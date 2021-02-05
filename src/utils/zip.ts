import AdmZip from "adm-zip";
import { dirname, basename, join } from "path";
import { v4 as uuidv4 } from "uuid";
import { Source } from "../types/index";
import fs from "fs";

const unZipByAd = (path: string): string => {
  const dir = dirname(path);
  const name = basename(path, ".zip");
  const zip = new AdmZip(path);
  zip.extractAllTo(dir);
  const result = join(dir, name);
  return result; // 解压后文件路径
};

const getAllSourcePath = async (path: string): Promise<Source[]> => {
  const sourceDirPath = unZipByAd(path);
  // 读取文件夹中的所有文件数据
  debugger;
  const originSourceList = await fs.promises.readdir(sourceDirPath);
  // 取得file协议路径 以及对应的文件名
  const filterSource = originSourceList.filter(i => /^(?!\.)/.test(i));
  const sourceList = filterSource.map(name => {
    return {
      id: uuidv4(),
      path: join(sourceDirPath, name),
      name
    };
  });
  console.log(sourceList, "sourceList");
  return sourceList;
};

export { getAllSourcePath, unZipByAd };
