import { mount } from "@vue/test-utils";
import { createStore } from "vuex";
import { describe, it, expect } from "vitest";
import BusLinesList from "@/components/bus-lines/list/BusLinesList.vue";
import LoaderComponent from "@/components/loader/LoaderComponent.vue";
import BusLinesListElement from "@/components/bus-lines/list/BusLinesListItem.vue";
import { LineType } from "@/types/StoreTypes";

const mockStore = (lines?: LineType[], loading?: boolean) => {
  return createStore({
    getters: {
      getLines: () => lines,
      getLoading: () => loading,
    },
  });
};

describe("BusLinesList.vue", () => {
  it("shows loading spinner when loading is true", () => {
    const store = mockStore(
      [
        {
          line: 1,
          active: true,
          stops: [
            {
              stop: "Stop A",
              time: ["12:30", "13:00"],
              order: 1,
              active: true,
            },
            {
              stop: "Stop B",
              time: ["12:30", "13:00"],
              order: 1,
              active: false,
            },
          ],
        },
      ],
      true
    );

    const wrapper = mount(BusLinesList, {
      global: {
        plugins: [store],
      },
    });

    expect(wrapper.findComponent(LoaderComponent).exists()).toBe(true);
  });

  it("shows error message when there are no lines and not loading", () => {
    const store = mockStore([], false);

    const wrapper = mount(BusLinesList, {
      global: {
        plugins: [store],
      },
    });

    expect(wrapper.text()).toContain(
      "No lines found, contact the page administrator at page@admin.com"
    );
  });

  it("shows the list of bus lines when lines are present", async () => {
    const store = mockStore(
      [
        {
          line: 1,
          active: true,
          stops: [
            {
              stop: "Stop A",
              time: ["12:30", "13:00"],
              order: 1,
              active: true,
            },
            {
              stop: "Stop B",
              time: ["12:30", "13:00"],
              order: 1,
              active: false,
            },
          ],
        },
      ],
      true
    );

    const wrapper = mount(BusLinesList, {
      global: {
        plugins: [store],
      },
    });

    const busLines = wrapper.findAllComponents(BusLinesListElement);
    expect(busLines).toHaveLength(1);
  });

  it("does not show the loader when lines are available", async () => {
    const store = mockStore(
      [
        {
          line: 1,
          active: true,
          stops: [
            {
              stop: "Stop A",
              time: ["12:30", "13:00"],
              order: 1,
              active: true,
            },
            {
              stop: "Stop B",
              time: ["12:30", "13:00"],
              order: 1,
              active: false,
            },
          ],
        },
      ],
      false
    );

    const wrapper = mount(BusLinesList, {
      global: {
        plugins: [store],
      },
    });

    expect(wrapper.findComponent(LoaderComponent).exists()).toBe(false);
  });
});
