import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import { createStore } from "vuex";
import BusLineDetails from "@/components/bus-lines/details/BusLineDetails.vue";
import DetailsPlaceholder from "@/components/base/DetailsPlaceholder.vue";
import BusLineDetailsListItem from "@/components/bus-lines/details/BusLineDetailsListItem.vue";
import IconComponent from "@/components/base/IconComponent.vue";
import { LineType } from "@/types/StoreTypes";

const mockStore = (activeLine?: LineType, stopsSortDir?: "dsc" | "asc") => {
  return createStore({
    getters: {
      getActiveLine: () => activeLine,
      getActiveLineStopsSortDir: () => stopsSortDir,
    },
    actions: {
      sortActiveLineStops: vi.fn(),
    },
  });
};

describe("BusLineDetails.vue", () => {
  let store;

  it("displays placeholder when no line is selected", () => {
    store = mockStore();
    const wrapper = mount(BusLineDetails, {
      global: {
        plugins: [store],
      },
    });

    expect(wrapper.findComponent(DetailsPlaceholder).exists()).toBe(true);
    expect(wrapper.text()).toContain("Please select the bus line first");
  });

  it("displays line details when a line is selected", () => {
    store = mockStore(
      {
        line: 1,
        active: true,
        stops: [
          { stop: "Stop A", time: ["12:30", "13:00"], order: 1, active: true },
          { stop: "Stop B", time: ["12:30", "13:00"], order: 1, active: false },
        ],
      },
      "asc"
    );
    const wrapper = mount(BusLineDetails, {
      global: {
        plugins: [store],
      },
    });

    expect(wrapper.text()).toContain("Bus line: 1");
    expect(wrapper.findAllComponents(BusLineDetailsListItem)).toHaveLength(2);
  });

  it("calls sort method when sort button is clicked", async () => {
    store = mockStore(
      {
        line: 1,
        active: true,
        stops: [
          { stop: "Stop A", time: ["12:30", "13:00"], order: 1, active: true },
          { stop: "Stop B", time: ["12:30", "13:00"], order: 1, active: false },
        ],
      },
      "asc"
    );

    store.dispatch = vi.fn();

    const wrapper = mount(BusLineDetails, {
      global: {
        plugins: [store],
      },
    });

    await wrapper.findComponent(IconComponent).trigger("click");
    expect(store.dispatch).toHaveBeenCalledWith("sortActiveLineStops");
  });
});
