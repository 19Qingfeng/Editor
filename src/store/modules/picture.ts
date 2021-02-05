import {
  PictureBook,
  AnimationBook,
  Bg,
  Animation,
  UpdateAnimationInfo,
  Event
} from "../../types/index";
import cloneDeep from "lodash/cloneDeep";
import { v4 } from "uuid";
import { store } from "../../electon-store";
import Vue from "vue";
const state = {
  pictureList: store.getPicture(), // 当前所有绘本信息 首页使用
  currentPicture: {}, // 当前正在编辑的绘本信息 editor使用
  wordList: {}, //当前绘本中所有的文字资源
  /* 当前绘本的插画信息 */
  animationBook: {}, // 当前插画页
  copyAnimationBook: {}, // 复制的信息
  animationBookIndex: 0,
  widthScale: 0, // 画布宽度缩放比例
  heightScale: 0, // 画布高度缩放比例
  /* 当前绘本当前页插画正在编辑的动画元素 */
  animationElement: {}
};

const getters = {
  // 绘本内所有的资源(不包含文字 文字需要单独解析)
  sourceList: (state: any) => {
    return state.currentPicture.sourceList;
  },
  // 绘本存在的插画长度
  animationBookLength: (state: any) => {
    return state.currentPicture.animationBookList.length;
  },
  // 绘本的所有文字资源(格式化后的)
  wordSourceList: (
    state: any
  ): { id: string; name: string; type: string }[] => {
    const result: { id: string; name: string; type: string }[] = [];
    const { wordList } = state;
    Object.keys(wordList).forEach(id => {
      const text = wordList[id];
      result.push({
        id,
        type: "text",
        name: text
      });
    });
    return result;
  },
  // 获取所有插画信息
  animationBookList: (state: any) => {
    return state.currentPicture.animationBookList;
  },
  // 当前绘本正在编辑的插画
  curAnimationBook: (state: any): AnimationBook => {
    return state.animationBook;
  },
  // 当前绘本编辑插画的张数
  curAnimationBookIndex: (state: any): AnimationBook => {
    return state.animationBookIndex;
  },
  // 当前绘本下所有存在的动画资源 (不包含背景)
  curAnimationBookSource: (state: any): Animation[] | undefined => {
    return state.animationBook.animationList;
  },
  // 当前绘本下的正在编辑插画的背景
  curAnimationBookBg: (state: any): undefined | any => {
    return state.animationBook?.bg;
  },
  // 当前绘本正在编辑的插画下正在编辑的动画
  curAnimationElement: (state: any): Animation => {
    return state.animationElement;
  },
  // 当前绘本正在编辑的插画下的正在编辑的动画元素的所有Event组合的列表
  curAnimationEleEventList: (state: any): Event[] => {
    const result: Event[] = [];
    const eventObjList = state.animationElement.eventList;
    Object.keys(eventObjList).forEach(key => {
      const singeEventList = eventObjList[key];
      singeEventList.forEach((i: Event) => result.push(i));
    });
    return result;
  },
  // 当前画布宽度缩放比例
  canvasWidthScale: (state: any): number => {
    return state.widthScale;
  },
  // 当前画布高度缩放比例
  canvasHeightScale: (state: any): number => {
    return state.heightScale;
  }
};

const mutations = {
  // 初始化绘本中的插画页
  INIT_ANIMATION_BOOK(state: any) {
    const curAnimationBookList = state.currentPicture?.animationBookList;
    if (!curAnimationBookList?.length) {
      state.animationBook = {};
      state.animationBookIndex = 0;
    } else {
      const length = curAnimationBookList.length;
      state.animationBookIndex = length - 1;
      state.animationBook =
        curAnimationBookList[curAnimationBookList.length - 1];
    }
  },
  ADD_PICTURE_BOOK(state: any, payload: PictureBook) {
    state.pictureList = [...state.pictureList, payload];
    store.updatePicture(state.pictureList);
  },
  UPDATE_PICTURE_BOOK(
    state: any,
    payload: { id: string; picture: PictureBook }
  ) {
    const { id, picture } = payload;
    const index = state.pictureList.findIndex((i: PictureBook) => i.id === id);
    const updateBook = cloneDeep(picture);
    if (index !== -1) {
      // state.pictureList[index] = updateBook;
      Vue.set(state.pictureList, index, updateBook);
      store.updatePicture(state.pictureList);
    }
  },
  COPY_CURRENT_ANIMATION_BOOK(state: any) {
    const cloneBook = cloneDeep(state.animationBook);
    console.log(cloneBook, "cloneBook");
    cloneBook.id = v4();
    state.copyAnimationBook = cloneBook;
  },
  PASTE_CURRENT_ANIMATION_BOOK(state: any, pageIndex: number) {
    const book = cloneDeep(state.copyAnimationBook);
    state.animationBook = book; // 改变当前页
    Vue.set(state.currentPicture.animationBookList, pageIndex, book); // 改变整个绘本
  },
  SET_CURRENT_PICTURE_BOOK(state: any, payload: PictureBook) {
    state.currentPicture = cloneDeep(payload);
  },
  SAVE_ANIMATION_BOOK(state: any) {
    // 当前绘本所有插画
    const animationBookList: Animation[] =
      state.currentPicture.animationBookList;
    if (!animationBookList.length) return;
    // 将当前绘本所有信息保存到electron-store中去
    store.saveAnimationBookInPicture(state.currentPicture);
    // 并且更新一下所有绘本在vuex中的值
    state.pictureList = store.getPicture();
  },
  ADD_ANIMATION_BOOK(state: any, book: AnimationBook) {
    state.currentPicture.animationBookList.push(book); // 更新currentPicture中的绘本 为了当前canvas画布
    const { id } = state.currentPicture;
    store.addAnimationBookInCurPicture(id, book); // 保存eletron-store
    state.pictureList = store.getPicture(); // 强制更新vuex-pictureList 为了主页和每次不刷新重新进入
  },
  DEL_ANIMATION_BOOK(state: any, id: string) {
    const index = state.currentPicture.animationBookList.findIndex(
      (i: AnimationBook) => i.id === id
    );
    if (index === -1) return;
    const { id: pictureId } = state.currentPicture;
    // 当前绘本删除 currentPicture
    state.currentPicture.animationBookList.splice(index, 1);
    // electron中删除 然后进行处理
    store.delAnimationBookInCurPicture(pictureId, index);
    // 更新仓库
    state.pictureList = store.getPicture(); // 当前所有绘本信息 首页使用
    const reduceLength = state.currentPicture.animationBookList.length;
    // 判断是否是当前插画页 删除当前正在编辑页
    if (id === state.animationBook.id) {
      if (reduceLength === 0) {
        // 清空
        state.animationBook = {};
        state.animationBookIndex = 0;
      } else {
        state.animationBook =
          state.currentPicture.animationBookList[reduceLength - 1];
        state.animationBookIndex = reduceLength - 1;
      }
      state.animationElement = {};
    } else {
      // 删除的不是正在编辑的
      state.animationBookIndex = state.currentPicture.animationBookList.findIndex(
        (i: AnimationBook) => i.id === state.animationBook.id
      );
    }
  },
  CHANGE_ANIMATION_BOOK(state: any, id: string) {
    for (const [
      index,
      book
    ] of state.currentPicture.animationBookList.entries()) {
      if (book.id === id) {
        // 引用类型的赋值
        state.animationBook = book;
        state.animationBookIndex = index;
      }
    }
  },
  CHANGE_ANIMATION_BOOK_BG(state: any, bg: Bg | undefined) {
    if (!bg?.path) {
      bg = undefined;
    }
    Vue.set(state.animationBook, "bg", bg);
  },
  DELETE_SOURCE_TO_CURRENT_BOOK(state: any, animation: Animation) {
    // 找到id 直接splice变异方法进行删除就OK了
    const { id } = animation;
    const index = state.animationBook.animationList.findIndex(
      (i: Animation) => i.id === id
    );
    if (index !== -1) {
      state.animationBook.animationList.splice(index, 1);
    }
  },
  ADD_SOURCE_TO_CURRENT_BOOK(state: any, animation: Animation) {
    if (!state.animationBook.animationList) {
      Vue.set(state.animationBook, "animationList", []);
    }
    state.animationBook.animationList.push(animation);
  },
  //
  UPDATE_ANIMATION_STYLE(state: any, payload: UpdateAnimationInfo) {
    const { id, ...update } = payload;
    const animationElementIndex = state.animationBook.animationList.findIndex(
      (i: Animation) => id === i.id
    );
    const animationElement =
      state.animationBook.animationList[animationElementIndex];
    // 更新后的值
    Object.keys(update).forEach(key => {
      animationElement[key] = update[key];
    });
    Vue.set(
      state.animationBook.animationList,
      animationElementIndex,
      animationElement
    );
  },
  CHANGE_SCALE(state: any, { widthScale, heightScale }: any) {
    state.widthScale = widthScale;
    state.heightScale = heightScale;
  },
  UPDATE_ANIMATION_SIZE(state: any) {
    /* eslint-disable */
    const {
      widthScale,
      heightScale,
      animationBook: { animationList = [] },
    } = state;
    // 获取当前插画页所有动画资源
    if (animationList.length === 0) return;
    // 更新位置/大小信息 仅仅对于画布中出现的动画做了处理 没有处理图片
    const updateAnimationBook = animationList.map((i: Animation) => {
      return {
        ...i,
        displayHeight: i.height / heightScale,
        displayLeft: i.left / widthScale,
        displayTop: i.top / heightScale,
        displayWidth: i.width / widthScale,
      };
    });
    Vue.set(state.animationBook, "animationList", updateAnimationBook);
  },
  CLEAR_ANIMATION_STYLE() {
    state.animationElement = {};
  },
  CHANGE_ANIMATION_STYLE(state: any, animationId: any) {
    const { animationList = [] } = state.animationBook;
    const curAnimation = animationList.find((i: any) => i.id === animationId);
    state.animationElement = curAnimation;
  },
  UPDATE_ANIMATION_EVENT(state: any, payload: Event) {
    const { eventList = {} } = state.animationElement;
    const copyEventList = cloneDeep(eventList);
    const { id, eventType, ...updateInfo } = payload; // evnetType表示当前事件类型
    // 当前eventType下的字段
    const currentEventTypeList = copyEventList[eventType];
    const index = currentEventTypeList.findIndex((i: Event) => i.id === id);
    // 新建操作逻辑
    if (index === -1) {
      currentEventTypeList.push(payload);
      Vue.set(state.animationElement, "eventList", copyEventList);
      return;
    }
    // 更新操作逻辑
    const updateEvent = currentEventTypeList[index];
    Object.keys(updateInfo).forEach((key) => {
      updateEvent[key] = updateInfo[key];
    });
    Vue.set(state.animationElement, "eventList", copyEventList);
  },
  // 删除当前动画的操作
  DELETE_ANIMATION_EVENT(
    state: any,
    payload: { id: string; type: "auto" | "click" | "animactionComplete" }
  ) {
    const { id, type } = payload;
    const eventList = state.animationElement.eventList[type];
    const index = eventList.findIndex((i: Event) => i.id === id);
    if (index !== -1) {
      eventList.splice(index, 1);
    }
  },
};

const actions = {
  // 关闭当前页时清空所有vuex的数据
  clearVuex() {
    state.animationElement = {};
    state.widthScale = 0;
    state.heightScale = 0;
    state.animationBookIndex = 0;
    state.animationBook = {};
    state.currentPicture = {};
  },
  // 删除整个绘本
  delPictureBook({ state }: any, id: string) {
    const index = state.pictureList.findIndex((i: PictureBook) => {
      return i.id === id;
    });
    if (index !== -1) {
      state.pictureList.splice(index, 1);
      store.updatePicture(state.pictureList);
    }
  },
  // 初始化绘本 当前页
  initAnimationBook({ commit }: any) {
    commit("INIT_ANIMATION_BOOK");
    // 初始化
  },
  // 添加绘本
  addPictureBook({ commit }: any, pictureBook: PictureBook): void {
    commit("ADD_PICTURE_BOOK", cloneDeep(pictureBook));
  },
  // 修改绘本基础信息
  updatePictureBook({ commit }: any, { id, picture }: any): void {
    commit("UPDATE_PICTURE_BOOK", { id, picture });
  },
  // 复制当前页
  copyCurAnimationBook({ commit }: any) {
    commit("COPY_CURRENT_ANIMATION_BOOK");
  },
  // 粘贴当前页
  pasteCurAnimationBook({ commit }: any, pageIndex: number) {
    commit("PASTE_CURRENT_ANIMATION_BOOK", pageIndex);
  },
  // 更新当前正在修改的绘本
  setCurrentEditPictureBook({ commit, state }: any, id: string): void {
    const currentPicture = state.pictureList.find(
      (book: PictureBook) => book.id === id
    );
    // 根据ID解析出来后 取到当前绘本内word文件目录 然后读对应json 然后进行处理
    commit("SET_CURRENT_PICTURE_BOOK", currentPicture);

    const wordList = currentPicture.wordList["Zh-ch"];
    if (wordList) {
      state.wordList = wordList;
    }
  },
  // 保存当前插画页进入当前绘本并且推入electron-store
  saveAnimationBook({ commit }: any) {
    commit("SAVE_ANIMATION_BOOK");
  },
  // 当前绘本下添加插画
  addAnimationBook({ commit }: any, book: AnimationBook) {
    commit("ADD_ANIMATION_BOOK", book);
  },
  // 删除当前绘本下的插画页
  delAnimationBook({ commit }: any, id: string) {
    commit("DEL_ANIMATION_BOOK", id);
  },
  // 切换绘本下的插画
  changeAnimationBook({ commit }: any, id: string) {
    commit("CHANGE_ANIMATION_BOOK", id);
  },
  // 修改绘本当前页背景图
  changeAnimationBookBg({ commit }: any, bg: Bg | undefined) {
    commit("CHANGE_ANIMATION_BOOK_BG", bg);
  },
  // 添加绘本当前插画页的资源
  addSourceToCurrentBook({ commit }: any, payload: any) {
    commit("ADD_SOURCE_TO_CURRENT_BOOK", payload);
  },
  // 删除绘本当前页的资源
  deleteSourceToCurrentBook({ commit }: any, payload: any) {
    commit("DELETE_SOURCE_TO_CURRENT_BOOK", payload);
  },
  // 清空当前选择的动画
  clearAnimationStyle({ commit }: any) {
    commit("CLEAR_ANIMATION_STYLE");
  },
  // 点击切换当前插画页的动画(事件，音乐xxx之类)
  changeAnimationStyle({ commit }: any, animationId: number) {
    commit("CHANGE_ANIMATION_STYLE", animationId);
  },
  // 更新当前插画下动画元素信息(位置，事件。。直接覆盖)
  updateAnimationStyle({ commit }: any, payload: UpdateAnimationInfo): any {
    commit("UPDATE_ANIMATION_STYLE", payload);
  },
  // 为当前插画下的动画元素增加事件/修改事件
  updateAnimationEvent({ commit }: any, payload: Event) {
    commit("UPDATE_ANIMATION_EVENT", payload);
  },
  delAnimationEvent(
    { commit }: any,
    payload: { id: string; type: "auto" | "click" | "animactionComplete" }
  ) {
    commit("DELETE_ANIMATION_EVENT", payload);
  },
  // 绘本canvas缩放比例
  changeScale({ commit }: any, { widthScale, heightScale }: any) {
    commit("CHANGE_SCALE", { widthScale, heightScale });
  },
  // 当前插画中所有元素的比例进行处理(当窗口改变时 动画元素宽高/位移需要按比例刷新)
  updateAnimationSize({ commit }: any) {
    commit("UPDATE_ANIMATION_SIZE");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
