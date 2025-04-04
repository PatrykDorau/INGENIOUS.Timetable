import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createStore } from "vuex";
import BusDetails from "@/components/bus-lines/details/BusStopDetails.vue";
import DetailsPlaceholder from "@/components/base/DetailsPlaceholder.vue";
import BusStopDetailsListItem from "@/components/bus-lines/details/BusStopDetailsListItem.vue";
import { LineType, StopType } from "@/types/BusDataTypes";

const mockStore = (activeLine?: LineType, activeStop?: StopType) => {
  return createStore({
    getters: {
      getActiveLine: () => activeLine,
      getActiveStop: () => activeStop,
    },
  });
};

describe("BusStopDetails.vue", () => {
  let store;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("displays placeholder when no line or stop is selected", () => {
    store = mockStore();
    const wrapper = mount(BusDetails, {
      global: {
        plugins: [store],
      },
      props: {
        sortDir: "asc",
      },
    });

    expect(wrapper.findComponent(DetailsPlaceholder).exists()).toBe(true);
    expect(wrapper.text()).toContain("Please select the bus line first");
  });

  it("displays placeholder when a line is selected but no stop", () => {
    store = mockStore({ line: 1, active: true, stops: [] });
    const wrapper = mount(BusDetails, {
      global: {
        plugins: [store],
      },
      props: {
        sortDir: "asc",
      },
    });

    expect(wrapper.text()).toContain("Please select the stop line first");
  });

  it("displays stop details when a stop is selected", () => {
    store = mockStore(
      { line: 1, active: true, stops: [] },
      { stop: "Stop A", time: ["12:30", "13:00"], order: 1, active: true }
    );
    const wrapper = mount(BusDetails, {
      global: {
        plugins: [store],
      },
      props: {
        sortDir: "asc",
      },
    });

    expect(wrapper.text()).toContain("Bus stop: Stop A");
    expect(wrapper.findAllComponents(BusStopDetailsListItem)).toHaveLength(2);
  });

  it("updates closest future time correctly", async () => {
    await vi.useFakeTimers();

    vi.setSystemTime(new Date("2023-06-01T22:31:00"));

    store = mockStore(
      {
        line: 1,
        active: true,
        stops: [
          { stop: "Stop A", time: ["11:00", "10:00"], order: 1, active: true },
        ],
      },
      { stop: "Stop A", time: ["7:35", "23:59"], order: 1, active: true }
    );
    const wrapper = mount(BusDetails, {
      global: {
        plugins: [store],
      },
      props: {
        sortDir: "asc",
      },
    });

    wrapper.vm.$nextTick();

    const activeTimeElement = wrapper.find(".stop-details__list-item--nearest");

    expect(activeTimeElement.exists()).toBe(true);
    expect(activeTimeElement.text()).toBe("23:59");
  });
});
