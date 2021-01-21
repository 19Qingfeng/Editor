import {
  PictureBook,
  AnimationBook,
  Bg,
  Animation,
  UpdateAnimationInfo
} from "../../types/index";
import cloneDeep from "lodash/cloneDeep";
import { store } from "../../electon-store";
import Vue from "vue";

const state = {
  pictureList: store.getPicture(), // 当前所有绘本信息
  currentPicture: {}, // 当前正在编辑的绘本信息
  /* 当前绘本的插画信息 */
  animationBook: {},
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
  // 当前画布缩放比例
  canvasScale: (state: any): number => {
    return state.scale;
  }
};

const mutations = {
  ADD_PICTURE_BOOK(state: any, payload: PictureBook) {
    state.pictureList = [...state.pictureList, payload];
    store.addPicture(state.pictureList);
  },
  SET_CURRENT_PICTURE_BOOK(state: any, payload: PictureBook) {
    state.currentPicture = cloneDeep(payload);
  },
  ADD_ANIMATION_BOOK(state: any, book: AnimationBook) {
    state.currentPicture.animationBookList.push(book);
  },
  CHANGE_ANIMATION_BOOK(state: any, id: string) {
    for (const [
      index,
      book
    ] of state.currentPicture.animationBookList.entries()) {
      if (book.id === id) {
        state.animationBook = book;
        state.animationBookIndex = index;
      }
    }
  },
  CHANGE_ANIMATION_BOOK_BG(state: any, bg: Bg) {
    Vue.set(state.animationBook, "bg", bg);
  },
  ADD_SOURCE_TO_CURRENT_BOOK(state: any, animation: Animation) {
    if (!state.animationBook.animationList) {
      Vue.set(state.animationBook, "animationList", []);
    }
    state.animationBook.animationList.push(animation);
  },
  UPDATE_ANIMATION_STYLE(state: any, payload: UpdateAnimationInfo) {
    const { id, ...update } = payload;
    const animationElement = state.animationBook.animationList.find(
      (i: Animation) => id === i.id
    );
    // 更新后的值
    Object.keys(update).forEach(key => {
      animationElement[key] = update[key];
    });
  },
  CHANGE_SCALE(state: any, scale: number) {
    state.scale = scale;
  },
  CHANGE_ANIMATION_STYLE(state: any, animationId: any) {
    const { animationList = [] } = state.animationBook;
    const curAnimation = animationList.find((i: any) => i.id === animationId);
    state.animationElement = curAnimation;
  }
};

const actions = {
  // 添加绘本
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
  // 当前绘本下添加插画
  addAnimationBook({ commit }: any, book: AnimationBook) {
    commit("ADD_ANIMATION_BOOK", book);
  },
  // 切换绘本下的插画
  changeAnimationBook({ commit }: any, id: string) {
    commit("CHANGE_ANIMATION_BOOK", id);
  },
  // 修改绘本当前页背景图
  changeAnimationBookBg({ commit }: any, bg: Bg) {
    commit("CHANGE_ANIMATION_BOOK_BG", bg);
  },
  // 添加绘本当前插画页的资源
  addSourceToCurrentBook({ commit }: any, payload: any) {
    commit("ADD_SOURCE_TO_CURRENT_BOOK", payload);
  },
  // 点击切换当前插画页的动画(事件，音乐xxx之类)
  changeAnimationStyle({ commit }: any, animationId: number) {
    commit("CHANGE_ANIMATION_STYLE", animationId);
  },
  // 更新当前插画下动画元素信息(位置，事件。。直接覆盖)
  updateAnimationStyle({ commit }: any, payload: UpdateAnimationInfo): any {
    commit("UPDATE_ANIMATION_STYLE", payload);
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
