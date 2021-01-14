import compressing from "compressing";
import fs, { mkdirSync } from "fs";
import { dirname, basename, join } from "path";

// 解压zip包  获得zip包的绝对路径 进行解压
const unZip = (path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const dir = dirname(path);
    const name = basename(path, ".zip");
    const stream = fs.createReadStream(path);
    const output = join(dir, name);
    mkdirSync(output);
    compressing.zip
      .uncompress(stream, output)
      .then(() => {
        resolve(output);
      })
      .catch(() => {
        reject();
      });
  });
};

export { unZip };
