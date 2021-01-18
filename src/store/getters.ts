const getters = {
  currentPictureBookId: (state: any) => {
    return state.picture.currentPicture?.id;
  }
};

export default getters;
