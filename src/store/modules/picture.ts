import {
  PictureBook,
  AnimationBook,
  Bg,
  Animation,
  UpdateAnimationInfo,
  Event
} from "../../types/index";
import cloneDeep from "lodash/cloneDeep";
import { store } from "../../electon-store";
import Vue from "vue";
const state = {
  pictureList: store.getPicture(), // 当前所有绘本信息 首页使用
  currentPicture: {}, // 当前正在编辑的绘本信息 editor使用
  /* 当前绘本的插画信息 */
  animationBook: {}, // 当前插画页
  animationBookIndex: 0,
  scale: 0, // 画布缩放比例
  /* 当前绘本当前页插画正在编辑的动画元素 */
  animationElement: {}
};

const getters = {
  sourceList: (state: any) => {
    return state.currentPicture.sourceList;
  },
  // 绘本存在的插画长度
  animationBookLength: (state: any) => {
    return state.currentPicture.animationBookList.length;
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
  // 当前画布缩放比例
  canvasScale: (state: any): number => {
    return state.scale;
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
    store.addPicture(state.pictureList);
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
    // console.log(state.currentPicture, "state.当前绘本");
    // 将当前插画页保存到electron-store中
    // console.log(state.animationBook, "当前插画");
    // console.log(state.currentPicture, "当前绘本");
  },
  ADD_ANIMATION_BOOK(state: any, book: AnimationBook) {
    state.currentPicture.animationBookList.push(book);
    const { id } = state.currentPicture;
    store.addAnimationBookInCurPicture(id, book);
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
    if (bg?.path) {
      bg = undefined;
      // {
      //   id: v4(),
      //   name: "",
      //   path: ""
      // };
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
  CHANGE_SCALE(state: any, scale: number) {
    state.scale = scale;
  },
  CHANGE_ANIMATION_STYLE(state: any, animationId: any) {
    const { animationList = [] } = state.animationBook;
    const curAnimation = animationList.find((i: any) => i.id === animationId);
    state.animationElement = curAnimation;
  },
  UPDATE_ANIMATION_EVENT(state: any, payload: Event) {
    const { eventList = {} } = state.animationElement;
    const copyEventList = cloneDeep(eventList);
    const { id, eventType, ...updateInfo } = payload;
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
    Object.keys(updateInfo).forEach(key => {
      updateEvent[key] = updateInfo[key];
    });
    Vue.set(state.animationElement, "eventList", copyEventList);
  }
};

const actions = {
  // 关闭当前页时清空所有vuex的数据
  clearVuex() {
    state.animationElement = {};
    state.scale = 0;
    state.animationBookIndex = 0;
    state.animationBook = {};
    state.currentPicture = {};
  },
  // 初始化绘本 当前页
  initAnimationBook({ commit }: any) {
    commit("INIT_ANIMATION_BOOK");
    // 初始化
  }, // 添加绘本
  addPictureBook({ commit }: any, pictureBook: PictureBook): void {
    commit("ADD_PICTURE_BOOK", cloneDeep(pictureBook));
  },
  // 更新当前正在修改的绘本
  setCurrentEditPictureBook({ commit, state }: any, id: string): void {
    const currentPicture = state.pictureList.find(
      (book: PictureBook) => book.id === id
    );
    commit("SET_CURRENT_PICTURE_BOOK", currentPicture);
  },
  // 保存当前插画页进入当前绘本并且推入electron-store
  saveAnimationBook({ commit }: any) {
    commit("SAVE_ANIMATION_BOOK");
  },
  // 当前绘本下添加插画
  addAnimationBook({ commit }: any, book: AnimationBook) {
    commit("ADD_ANIMATION_BOOK", book);
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
    // nothing
    commit("UPDATE_ANIMATION_EVENT", payload);
  },
  // 绘本canvas缩放比例
  changeScale({ commit }: any, scale: number) {
    commit("CHANGE_SCALE", scale);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
