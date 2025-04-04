import { Module } from "vuex";
import { StoreStateType } from "@/types/StoreTypes";

const loadingModule: Module<{ loadInProgress: boolean }, StoreStateType> = {
  namespaced: true,
  state: {
    loadInProgress: true,
  },
  getters: {
    getLoading: (state): boolean => state.loadInProgress,
  },
  mutations: {
    SET_LOADING(state, loading: boolean) {
      state.loadInProgress = loading;
    },
  },
  actions: {
    setLoading({ commit }, loading: boolean) {
      commit("SET_LOADING", loading);
    },
  },
};

export default loadingModule;
