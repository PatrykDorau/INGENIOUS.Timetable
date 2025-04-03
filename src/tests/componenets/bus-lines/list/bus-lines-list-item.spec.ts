import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import BusLinesListItem from "@/components/bus-lines/list/BusLinesListItem.vue";
import { createStore } from "vuex";

const mockStore = createStore({
  actions: {
    setActiveLine: vi.fn(),
  },
});

describe("BusLinesListItem.vue", () => {
  it("renders line number correctly", () => {
    const wrapper = mount(BusLinesListItem, {
      global: {
        plugins: [mockStore],
      },
      props: {
        data: {
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
      },
    });

    expect(wrapper.text()).toContain("1");
  });

  it("adds the active class when the line is active", async () => {
    const wrapper = mount(BusLinesListItem, {
      global: {
        plugins: [mockStore],
      },
      props: {
        data: {
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
      },
    });

    expect(wrapper.find("button").classes()).toContain(
      "bus-lines__item--active"
    );
  });

  it("calls chooseLine when the button is clicked", async () => {
    const wrapper = mount(BusLinesListItem, {
      global: {
        plugins: [mockStore],
      },
      props: {
        data: {
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
      },
    });

    mockStore.dispatch = vi.fn();

    await wrapper.find("button").trigger("click");

    expect(mockStore.dispatch).toHaveBeenCalledWith("setActiveLine", 1);
  });
});
