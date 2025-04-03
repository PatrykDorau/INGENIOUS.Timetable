import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import { describe, it, expect, vi } from "vitest";
import BusStopsList from "@/components/bus-stops/list/BusStopsList.vue";
import BusStopsListItem from "@/components/bus-stops/list/BusStopsListItem.vue";
import IconComponent from "@/components/base/IconComponent.vue";
import { UniqueStopType } from "@/types/StoreTypes";

type TempStoreType = {
  uniqueStops: UniqueStopType[];
  uniqueStopsSortDirection: "asc" | "dsc";
  loadInProgress: boolean;
};

const createMockStore = (uniqueStops: UniqueStopType[]) => {
  return createStore<TempStoreType>({
    state: {
      uniqueStops: uniqueStops,
      uniqueStopsSortDirection: "asc",
      loadInProgress: false,
    },
    getters: {
      getUniqueStops: (state) => state.uniqueStops,
      getUniqueStopsSortDirection: (state) => state.uniqueStopsSortDirection,
      getLoading: (state) => state.loadInProgress,
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
      "No stops found, contact the page administrator"
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

  it("filters stops based on search value", async () => {
    mockedStore = createMockStore([
      { stop: "Stop A", order: 1 },
      { stop: "Stop B", order: 2 },
      { stop: "Stop C", order: 3 },
    ]);

    const wrapper = mount(BusStopsList, {
      global: { plugins: [mockedStore] },
      props: { searchValue: "Stop B" },
    });

    wrapper.vm.$nextTick();

    expect(wrapper.findAllComponents(BusStopsListItem)).toHaveLength(1);
    expect(wrapper.findComponent(BusStopsListItem).props("data").stop).toBe(
      "Stop B"
    );
  });
});
