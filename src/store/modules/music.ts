const videoElement: HTMLVideoElement = document.createElement("video");

const loadedMusic = (src: string): Promise<HTMLVideoElement> => {
  videoElement.src = src;
  return new Promise((resolve, reject) => {
    videoElement.oncanplay = () => {
      resolve(videoElement);
    };
  });
};

const state = {
  /* 当前正在播放的音乐 */
  video: document.createElement("video"),
  videoName: "",
  videoDuration: 0,
  videoCurrentTime: 0
};

const getters = {
  speedProcess: (state: any) => {
    if (state.videoDuration === 0) return 0;
    return Math.floor((state.videoCurrentTime / state.videoDuration) * 100);
  }
};

const mutations = {
  STOP_MUSIC(state: any) {
    console.log(state.video, "videovideo");
    if (state.video?.src) {
      state.video.pause();
      state.videoName = "";
      state.videoDuration = 0;
      state.videoCurrentTime = 0;
    }
  },
  CHANGE_VIDEO(state: any, payload: any) {
    const { video, name } = payload;
    state.video = video;
    state.videoDuration = video.duration;
    state.videoName = name;
    state.video.play();
  },
  CHANGE_CURRENT_TIME(state: any, time: number) {
    state.videoCurrentTime = time;
  }
};

const actions = {
  hanldeStopMusic({ commit }: any) {
    commit("STOP_MUSIC");
  },
  async handleChangeVideo({ commit }: any, { path, name }: any) {
    const video = await loadedMusic(path);
    video.ontimeupdate = () => {
      // console.log("变化了", video.currentTime);
      commit("CHANGE_CURRENT_TIME", video.currentTime);
    };
    commit("CHANGE_VIDEO", {
      video,
      name
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
