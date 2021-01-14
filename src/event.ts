import { ipcMain } from "electron";
import { openSingleFileDialog } from "./utils";

const electronEvent = (app: any): void => {
  ipcMain.on("on-upload-cover-img", async event => {
    const res = await openSingleFileDialog({
      filters: [{ name: "png", extensions: ["png"] }],
      properties: ["openFile", "multiSelections"]
    });
    if (res) {
      event.sender.send("on-upload-cover-success", res);
    }
  });

  ipcMain.on("on-upload-zip", async event => {
    const res = await openSingleFileDialog({
      filters: [{ name: "png", extensions: ["zip"] }],
      properties: ["openFile", "multiSelections"]
    });
    if (res) {
      event.sender.send("on-upload-zip-success", res);
    }
  });
};

export default electronEvent;
