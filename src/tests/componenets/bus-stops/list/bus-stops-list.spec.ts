import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import { describe, it, expect, vi } from "vitest";
import BusStopsList from "@/components/bus-stops/list/BusStopsList.vue";
import BusStopsListItem from "@/components/bus-stops/list/BusStopsListItem.vue";
import IconComponent from "@/components/base/IconComponent.vue";
import { UniqueStopType } from "@/types/BusDataTypes";

const createMockStore = (uniqueStops: UniqueStopType[]) => {
  return createStore({
    modules: {
      loading: {
        namespaced: true,
        state: {
          loadInProgress: false,
        },
        getters: {
          getLoading: (state) => state.loadInProgress,
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
      },
    },
    state: {
      uniqueStops,
      uniqueStopsSortDirection: "asc",
    },
    getters: {
      getUniqueStops: (state) => state.uniqueStops,
      getUniqueStopsSortDirection: (state) => state.uniqueStopsSortDirection,
    },
    actions: {
      sortUniqueStops: vi.fn(),
    },
  });
};
describe("BusStopsList.vue", () => {
  let mockedStore = createMockStore([
    { stop: "A", order: 1 },
    { stop: "B", order: 2 },
    { stop: "C", order: 3 },
  ]);

  it("displays an error message when no stops are found", async () => {
    mockedStore.state.uniqueStops = [];
    const wrapper = mount(BusStopsList, {
      global: { plugins: [mockedStore] },
      props: { searchValue: "" },
    });

    expect(wrapper.find(".error__info").exists()).toBe(true);
    expect(wrapper.find(".error__info").text()).toContain(
      "No stops found, please refresh the page. If problem persists, contact us at page@admin.com."
    );
  });

  it("calls mockedStore action when sort button is clicked", async () => {
    const wrapper = mount(BusStopsList, {
      global: { plugins: [mockedStore] },
      props: { searchValue: "" },
    });

    mockedStore.dispatch = vi.fn();
    await wrapper.findComponent(IconComponent).trigger("click");

    expect(mockedStore.dispatch).toHaveBeenCalledWith("sortUniqueStops");
  });

  it("filters stops based on two words search value", async () => {
    mockedStore = createMockStore([
      { stop: "Stop A", order: 1 },
      { stop: "Stop B", order: 2 },
      { stop: "Stop C", order: 3 },
    ]);

    const wrapper = mount(BusStopsList, {
      global: { plugins: [mockedStore] },
      props: { searchValue: "Stop A" },
    });

    wrapper.vm.$nextTick();

    const filteredItems = await wrapper.findAllComponents(BusStopsListItem);
    expect(filteredItems).toHaveLength(1);
    expect(filteredItems[0].props("data").stop).toBe("Stop A");
  });

  it("filters stops based on one word search value", async () => {
    mockedStore = createMockStore([
      { stop: "Stop A", order: 1 },
      { stop: "Stop B", order: 2 },
      { stop: "Stop C", order: 3 },
    ]);

    const wrapper = mount(BusStopsList, {
      global: { plugins: [mockedStore] },
      props: { searchValue: "Stop" },
    });

    wrapper.vm.$nextTick();

    const filteredItems = await wrapper.findAllComponents(BusStopsListItem);
    expect(filteredItems).toHaveLength(3);
  });
});
