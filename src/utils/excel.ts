import { Source } from "../types/index";
import { v4 } from "uuid";
import xlsx from "node-xlsx";
import { dirname, join } from "path";
import fs from "fs";

const saveJsonToFile = (
  path: string,
  result: any,
  name = `string.json`
): { output: string; data: any } => {
  // 保存文件
  const dir = dirname(path);
  // const baseName = basename(path,'.xlsx');
  const output = join(dir, name);
  const resultString = JSON.stringify(result);
  fs.writeFileSync(output, resultString, "utf-8");
  return { output, data: result };
};

const formatJson = (path: string, list: any): any => {
  const data = list[0].data;
  // 除了第一行
  const result = Object.create(null);
  const title = data.shift();
  for (const i of title) {
    result[i] = {};
  }
  // 格式化数据格式 处理数据模型
  data.forEach((outer: (string | null)[]) => {
    const id = v4();
    outer.forEach((inner: string | null, index: number) => {
      const key = title[index];
      result[key][id] = inner;
    });
  });
  return saveJsonToFile(path, result);
};
const parseExceltoJson = (
  source: Source | undefined
): { output: string; data: any } => {
  if (!source) return { output: "", data: {} };
  const { path } = source;
  const list = xlsx.parse(path);
  return formatJson(path, list);
};

export { parseExceltoJson, saveJsonToFile };
