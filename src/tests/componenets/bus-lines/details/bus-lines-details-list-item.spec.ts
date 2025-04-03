import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import { createStore } from "vuex";
import BusLineDetailsListItem from "@/components/bus-lines/details/BusLineDetailsListItem.vue";

const mockStore = () => {
  return createStore({
    actions: {
      setActiveStop: vi.fn(),
    },
  });
};

describe("BusLineDetailsListItem.vue", () => {
  it("renders the stop name correctly", () => {
    const store = mockStore();
    const wrapper = mount(BusLineDetailsListItem, {
      global: {
        plugins: [store],
      },
      props: {
        data: {
          stop: "Stop A",
          time: ["10:00", "23:30"],
          order: 1,
          active: true,
        },
      },
    });

    expect(wrapper.text()).toBe("Stop A");
  });

  it("applies 'active' class when stop is active", () => {
    const store = mockStore();
    const wrapper = mount(BusLineDetailsListItem, {
      global: {
        plugins: [store],
      },
      props: {
        data: {
          stop: "Stop A",
          time: ["10:00", "23:30"],
          order: 1,
          active: true,
        },
      },
    });

    expect(wrapper.classes()).toContain("active");
  });

  it("dispatches 'setActiveStop' when clicked", async () => {
    const store = mockStore();
    const wrapper = mount(BusLineDetailsListItem, {
      global: {
        plugins: [store],
      },
      props: {
        data: {
          stop: "Stop A",
          time: ["10:00", "23:30"],
          order: 1,
          active: true,
        },
      },
    });

    store.dispatch = vi.fn();

    await wrapper.trigger("click");

    expect(store.dispatch).toHaveBeenCalledWith("setActiveStop", {
      stop: "Stop A",
      time: ["10:00", "23:30"],
      order: 1,
      active: true,
    });
  });
});
