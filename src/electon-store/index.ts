import Store from "electron-store";
import { PictureBook } from "../types/index";
interface EsProps {
  name: string;
}

const name = "cys";

class EStore extends Store {
  pictureList: PictureBook[];
  constructor(props: EsProps) {
    super(props);
    this.pictureList = this.getPicture() || []; // 绘本列表
  }

  // 保存绘本
  savePicture(): EStore {
    this.set(name, this.pictureList);
    return this;
  }

  // 获取所有绘本
  getPicture(): PictureBook[] | [] {
    return (this.get(name) as PictureBook[]) || [];
  }

  // 添加绘本
  addPicture(pictureList: PictureBook[]) {
    this.pictureList = pictureList;
    return this.savePicture();
  }
}

const store: EStore = new EStore({
  name
});

export { store };
