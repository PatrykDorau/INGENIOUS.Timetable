import { createStore } from "vuex";
import ApiService from "@/services/ApiService";
import {
  StoreStateType,
  LineType,
  StopType,
  UniqueStopType,
  NotificationType,
} from "../types/StoreTypes";
import { StopsResponseType } from "../types/ApiTypes";

export default createStore<StoreStateType>({
  state: {
    stops: [],
    uniqueStops: [],
    lines: [],
    notification: {
      title: "",
      text: "",
      type: "error",
      timer: 10000,
      active: false,
    },
    loadInProgress: true,
    activeLine: undefined,
    activeStop: undefined,
    activeLineStopsSortDirection: "asc",
    uniqueStopsSortDirection: "dsc",
  },
  getters: {
    getStops: (state): StopsResponseType[] => state.stops,
    getUniqueStops: (state): UniqueStopType[] => state.uniqueStops,
    getLines: (state): LineType[] => state.lines,
    getActiveLine: (state): LineType | undefined => state.activeLine,
    getActiveStop: (state): StopType | undefined => state.activeStop,
    getActiveLineStopsSortDir: (state): "asc" | "dsc" =>
      state.activeLineStopsSortDirection,
    getUniqueStopsSortDirection: (state): "asc" | "dsc" =>
      state.uniqueStopsSortDirection,
    getLoading: (state): boolean => state.loadInProgress,
    getNotificationData: (state): NotificationType => state.notification,
  },
  mutations: {
    SET_UNIQUE_STOPS(state, data: StopsResponseType[]) {
      const uniqueStops = Array.from(
        new Map(
          data.map((stop) => [
            stop.stop,
            { stop: stop.stop, order: stop.order },
          ])
        ).values()
      );

      uniqueStops.sort((a, b) => a.order - b.order);

      state.uniqueStops = uniqueStops;
    },
    SET_STOPS(state, stops: StopsResponseType[]) {
      state.stops = stops;
    },
    SET_LINES(state, lines: LineType[]) {
      state.lines = lines;
    },
    SET_LOADING(state, loading: boolean) {
      state.loadInProgress = loading;
    },
    SET_ACTIVE_LINE(state, line: LineType) {
      state.activeLine = line;
    },
    SET_ACTIVE_STOP(state, stop: StopType) {
      state.activeStop = stop;
    },
    MANAGE_NOTIFICATION(state, data: NotificationType) {
      state.notification = data;
    },
    SET_UNIQUE_STOPS_SORT_DIR(state, dir: "asc" | "dsc") {
      state.uniqueStopsSortDirection = dir;
    },
    SET_ACTIVE_LINE_STOPS_SORT_DIR(state, dir: "asc" | "dsc") {
      state.activeLineStopsSortDirection = dir;
    },
  },
  actions: {
    fireModalMessage({ commit }, data: NotificationType) {
      commit("MANAGE_NOTIFICATION", data);
    },

    async fetchStops({ state, commit, dispatch }) {
      commit("SET_LOADING", true);
      if (state.stops.length > 0 && state.lines.length > 0) {
        commit("SET_LOADING", false);
        return;
      }

      try {
        const response = await ApiService.get("/stops");
        const stopsData = response.data;

        commit("SET_STOPS", stopsData);

        const lines: LineType[] = [];

        commit("SET_UNIQUE_STOPS", response.data);

        stopsData.forEach((stop) => {
          const line = lines.find((li) => li.line === stop.line);
          if (line) {
            const stp = line.stops.find((st) => st.stop === stop.stop);
            if (stp) {
              stp.time.push(stop.time);
            } else {
              line.stops.push({
                stop: stop.stop,
                active: false,
                time: [stop.time],
                order: stop.order,
              });
            }
          } else {
            lines.push({
              line: stop.line,
              active: false,
              stops: [
                {
                  stop: stop.stop,
                  active: false,
                  time: [stop.time],
                  order: stop.order,
                },
              ],
            });
          }
        });

        lines.sort((a, b) => a.line - b.line);

        lines.forEach((line) => {
          line.stops.sort((a, b) => a.order - b.order);

          line.stops.forEach((stop) => {
            stop.time.sort(
              (a, b) =>
                Number(a.split(":").join("")) - Number(b.split(":").join(""))
            );
          });
        });

        commit("SET_LINES", lines);
      } catch (error) {
        dispatch("fireModalMessage", {
          title: "Error",
          text: "Failed to load data, please refresh page. If problem persists, contact us at page@admin.com",
          type: "error",
          timer: 10000,
          active: true,
        });
      } finally {
        commit("SET_LOADING", false);
      }
    },

    setActiveLine({ state, commit }, lineNumber: number) {
      state.lines.forEach((line) => (line.active = false));
      const foundLine = state.lines.find((line) => line.line === lineNumber);

      if (foundLine) {
        foundLine.active = true;
        commit("SET_ACTIVE_LINE", foundLine);
        commit("SET_ACTIVE_LINE_STOPS_SORT_DIR", "asc");
      }
    },

    setActiveStop({ state, commit }, stop: StopType) {
      if (!stop || !state.activeLine) return;
      state.lines.forEach((li) => {
        li.stops.forEach((st) => {
          st.active = false;
        });
      });

      const foundStop = state.activeLine.stops.find(
        (st) => st.stop === stop.stop
      );

      if (!foundStop) return;

      foundStop.active = true;
      commit("SET_ACTIVE_STOP", stop);
    },

    sortActiveLineStops({ state, commit }) {
      if (!state.activeLine) return;

      const activeLine = { ...state.activeLine };
      const sortAscending = state.activeLineStopsSortDirection === "asc";

      activeLine.stops = [...activeLine.stops].sort((a, b) =>
        sortAscending ? b.order - a.order : a.order - b.order
      );

      commit("SET_ACTIVE_LINE", activeLine);
      commit("SET_ACTIVE_LINE_STOPS_SORT_DIR", sortAscending ? "dsc" : "asc");
    },

    sortUniqueStops({ state, commit }) {
      if (!state.uniqueStops || state.uniqueStops.length === 0) return;

      const sortAscending = state.uniqueStopsSortDirection === "asc";

      const uniqueStops = [...state.uniqueStops].sort((a, b) =>
        sortAscending ? a.order - b.order : b.order - a.order
      );

      commit("SET_UNIQUE_STOPS", uniqueStops);
      commit("SET_UNIQUE_STOPS_SORT_DIR", sortAscending ? "dsc" : "asc");
    },
  },
  modules: {},
});
