import { StopsResponseType } from "@/types/ApiTypes";
import { AxiosResponse } from "axios";
import { beforeEach, describe, it, expect, vi, MockedFunction } from "vitest";
import ApiService from "@/services/ApiService";
import store from "@/store/index";

vi.mock("@/services/ApiService", () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock("@/store/modules/notifications", () => ({
  default: {
    fireModalMessage: vi.fn(),
  },
}));

vi.mock("@/store/modules/loading", () => ({
  default: {
    setLoading: vi.fn(),
  },
}));

describe("Vuex Store", () => {
  let apiGetMock: MockedFunction<typeof ApiService.get>;

  beforeEach(() => {
    apiGetMock = ApiService.get as MockedFunction<typeof ApiService.get>;
    apiGetMock.mockReset();
  });

  describe("getters", () => {
    it("should return the correct stops", () => {
      const stops = [{ stop: "Stop 1", order: 1, line: 100, time: "10:00" }];
      store.state.stops = stops;
      expect(store.getters.getStops).toEqual(stops);
    });

    it("should return the correct uniqueStops", () => {
      const uniqueStops = [{ stop: "Stop 1", order: 1 }];
      store.state.uniqueStops = uniqueStops;
      expect(store.getters.getUniqueStops).toEqual(uniqueStops);
    });
  });

  describe("mutations", () => {
    it("SET_UNIQUE_STOPS should set uniqueStops correctly", () => {
      const stopsData = [
        { stop: "Stop 1", order: 2 },
        { stop: "Stop 2", order: 1 },
        { stop: "Stop 2", order: 1 },
      ];
      store.commit("SET_UNIQUE_STOPS", stopsData);
      expect(store.state.uniqueStops).toEqual([
        { stop: "Stop 1", order: 2 },
        { stop: "Stop 2", order: 1 },
      ]);
    });

    it("SET_STOPS should set stops correctly", () => {
      const stopsData = [{ stop: "Stop 1", order: 1 }];
      store.commit("SET_STOPS", stopsData);
      expect(store.state.stops).toEqual(stopsData);
    });
  });

  describe("actions", () => {
    it("fetchStops should fetch data and update store", async () => {
      const stopsData = [
        { stop: "Stop 1", line: 1, order: 1, time: "10:00" },
        { stop: "Stop 2", line: 1, order: 2, time: "10:30" },
      ];
      apiGetMock.mockResolvedValue({
        data: stopsData,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {},
      } as AxiosResponse<StopsResponseType[]>);

      await store.dispatch("fetchStops");

      expect(apiGetMock).toHaveBeenCalledWith("/stops");
      expect(store.state.stops).toEqual(stopsData);
      expect(store.state.uniqueStops.length).toBe(2);
      expect(store.state.lines.length).toBe(1);
    });

    it("setActiveLine should update the active line", () => {
      const lineNumber = 1;
      const lineData = { line: 1, active: false, stops: [] };
      store.state.lines = [lineData];
      store.dispatch("setActiveLine", lineNumber);

      expect(store.state.activeLine).toEqual(lineData);
      expect(store.state.lines[0].active).toBe(true);
    });

    it("sortActiveLineStops should sort the stops in ascending order", () => {
      const activeLine = {
        line: 1,
        active: false,
        stops: [
          { stop: "Stop 2", order: 2, time: ["10:30"], active: false },
          { stop: "Stop 1", order: 1, time: ["10:00"], active: false },
        ],
      };
      store.state.activeLine = activeLine;
      store.state.activeLineStopsSortDirection = "dsc";

      store.dispatch("sortActiveLineStops");

      expect(store.state.activeLine.stops).toEqual([
        { stop: "Stop 1", order: 1, time: ["10:00"], active: false },
        { stop: "Stop 2", order: 2, time: ["10:30"], active: false },
      ]);
      expect(store.state.activeLineStopsSortDirection).toBe("asc");
    });

    it("sortUniqueStops should sort the unique stops correctly", () => {
      const uniqueStops = [
        { stop: "Stop 2", order: 2 },
        { stop: "Stop 1", order: 1 },
      ];
      store.state.uniqueStops = uniqueStops;
      store.state.uniqueStopsSortDirection = "dsc";

      store.dispatch("sortUniqueStops");

      expect(store.state.uniqueStops).toEqual([
        { stop: "Stop 1", order: 1 },
        { stop: "Stop 2", order: 2 },
      ]);
      expect(store.state.uniqueStopsSortDirection).toBe("asc");
    });
  });
});
