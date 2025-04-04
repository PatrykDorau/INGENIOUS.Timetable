import { createStore } from "vuex";
import ApiService from "@/services/ApiService";
import { StoreStateType } from "@/types/StoreTypes";
import { LineType, StopType, UniqueStopType } from "@/types/BusDataTypes";
import { StopsResponseType } from "@/types/ApiTypes";

import notifications from "@/store/modules/notifications";
import loading from "@/store/modules/loading";

export default createStore<StoreStateType>({
  state: {
    stops: [],
    uniqueStops: [],
    lines: [],
    activeLine: undefined,
    activeStop: undefined,
    activeLineStopsSortDirection: "dsc",
    uniqueStopsSortDirection: "dsc",
    loading: { loadInProgress: true },
    notifications: {
      notification: {
        title: "",
        text: "",
        type: "error",
        timer: 10000,
        active: false,
      },
    },
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

      state.uniqueStops = uniqueStops;
    },
    SET_STOPS(state, stops: StopsResponseType[]) {
      state.stops = stops;
    },
    SET_LINES(state, lines: LineType[]) {
      state.lines = lines;
    },
    SET_ACTIVE_LINE(state, line: LineType) {
      state.activeLine = line;
    },
    SET_ACTIVE_STOP(state, stop: StopType) {
      state.activeStop = stop;
    },
    SET_UNIQUE_STOPS_SORT_DIR(state, dir: "asc" | "dsc") {
      state.uniqueStopsSortDirection = dir;
    },
    SET_ACTIVE_LINE_STOPS_SORT_DIR(state, dir: "asc" | "dsc") {
      state.activeLineStopsSortDirection = dir;
    },
  },
  actions: {
    async fetchStops({ state, commit, dispatch }) {
      dispatch("loading/setLoading", true);
      if (state.stops.length > 0 && state.lines.length > 0) {
        dispatch("loading/setLoading", false);
        return;
      }

      try {
        const response = await ApiService.get<StopsResponseType[]>("/stops");
        const stopsData = response.data;

        commit("SET_STOPS", stopsData);

        const lines: LineType[] = [];

        commit("SET_UNIQUE_STOPS", stopsData);
        dispatch("sortUniqueStops");

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
        console.log("error");
        dispatch("notifications/fireModalMessage", {
          title: "Error",
          text: "Failed to load data, please refresh page. If problem persists, contact us at page@admin.com",
          type: "error",
          timer: 10000,
          active: true,
        });
      } finally {
        dispatch("loading/setLoading", false);
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

      console.log(state.activeLineStopsSortDirection);

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
        sortAscending ? b.order - a.order : a.order - b.order
      );

      commit("SET_UNIQUE_STOPS", uniqueStops);
      commit("SET_UNIQUE_STOPS_SORT_DIR", sortAscending ? "dsc" : "asc");
    },
  },
  modules: {
    notifications,
    loading,
  },
});
