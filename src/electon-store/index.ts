import Store from "electron-store";
import { PictureBook, AnimationBook } from "../types/index";
interface EsProps {
  name: string;
}

const name = "cys1";

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

  // 给当前正在编辑的绘本 增加 插画页
  addAnimationBookInCurPicture(id: string, book: AnimationBook) {
    const result = this.pictureList.find(i => i.id === id);
    result?.animationBookList.push(book);
    this.savePicture();
  }

  // 保存当前绘本的所有插画页进入electron-store中去 - 更新当前绘本
  saveAnimationBookInPicture(picture: PictureBook) {
    // 其实主要更新 animationBookList
    // const animationBookList = picture.animationBookList // 所有插画
    this.pictureList.forEach(i => {
      if (i.id === picture.id) {
        i.animationBookList = picture.animationBookList;
      }
    });
    this.savePicture();
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
