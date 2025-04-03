import store from "@/store";
import ApiService from "@/services/ApiService";
import { describe, it, expect, beforeEach, vi, MockedFunction } from "vitest";
import { StopsResponseType } from "@/types/ApiTypes";
import { AxiosResponse } from "axios";

vi.mock("@/services/ApiService", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("Vuex Store Logic", () => {
  let apiGetMock: MockedFunction<typeof ApiService.get>;

  beforeEach(() => {
    store.replaceState({
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
    });

    apiGetMock = ApiService.get as MockedFunction<typeof ApiService.get>;
    apiGetMock.mockReset();
  });

  it("should set stops", () => {
    store.commit("SET_STOPS", [{ stop: "A", order: 1 }]);
    expect(store.state.stops).toEqual([{ stop: "A", order: 1 }]);
  });

  it("should toggle loading state", () => {
    store.commit("SET_LOADING", true);
    expect(store.state.loadInProgress).toBe(true);

    store.commit("SET_LOADING", false);
    expect(store.state.loadInProgress).toBe(false);
  });

  it("should sort unique stops correctly", () => {
    store.commit("SET_UNIQUE_STOPS", [
      { stop: "B", order: 2 },
      { stop: "A", order: 1 },
    ]);
    store.dispatch("sortUniqueStops");

    expect(store.state.uniqueStops[0].stop).toBe("A");
  });

  it("should fetch stops from API", async () => {
    const mockStops: StopsResponseType[] = [
      { stop: "A", order: 1, line: 1, time: "00:00" },
    ];
    apiGetMock.mockResolvedValue({
      data: mockStops,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    } as AxiosResponse<StopsResponseType[]>);

    await store.dispatch("fetchStops");

    expect(apiGetMock).toHaveBeenCalledWith("/stops");

    expect(store.state.stops).toEqual(mockStops);
  });

  it("should trigger a notification on API error", async () => {
    apiGetMock.mockRejectedValue(new Error("API Error"));

    await store.dispatch("fetchStops");

    expect(store.state.notification).toEqual({
      title: "Error",
      text: "Failed to load data, please refresh page. If problem persists, contact us at page@admin.com",
      type: "error",
      timer: 10000,
      active: true,
    });
  });
});
