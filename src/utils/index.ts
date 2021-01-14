import { dialog } from "electron";
// import { normalize } from "path";

// 格式化路径 file协议
const normalizationPath = (path: string): string => {
  return `local-resource://${path}`
};

interface FilePath {
  originPath: string; // 本地路径 /user/xxx
  filePath: string; // file协议路径 file://+本地路径
}

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
      originPath: filePath, // 原始路径
    };
  }
};

export { openSingleFileDialog };
