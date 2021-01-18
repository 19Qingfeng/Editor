import { PictureBook, AnimationBook } from "../../types/index";
import cloneDeep from "lodash/cloneDeep";
import { store } from "../../electon-store";

const state = {
  pictureList: store.getPicture(), // 当前所有绘本信息
  currentPicture: {}, // 当前正在编辑的绘本信息
  /* 当前绘本的插画信息 */
  animationBook: {},
  animationBookIndex: 0
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
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
