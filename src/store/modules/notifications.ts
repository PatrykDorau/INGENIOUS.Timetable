import { Module } from "vuex";
import { StoreStateType, NotificationType } from "@/types/StoreTypes";

const notificationsModule: Module<
  { notification: NotificationType },
  StoreStateType
> = {
  namespaced: true,
  state: {
    notification: {
      title: "",
      text: "",
      type: "error",
      timer: 10000,
      active: false,
    },
  },
  getters: {
    getNotificationData: (state) => state.notification,
  },
  mutations: {
    MANAGE_NOTIFICATION(state, data: NotificationType) {
      state.notification = data;
    },
  },
  actions: {
    fireModalMessage({ commit }, data: NotificationType) {
      commit("MANAGE_NOTIFICATION", data);
    },
  },
};

export default notificationsModule;
