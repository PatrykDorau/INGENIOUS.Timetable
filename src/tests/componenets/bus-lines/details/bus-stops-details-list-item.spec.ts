import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import BusStopDetailsListItem from "@/components/bus-lines/details/BusStopDetailsListItem.vue";

describe("BusStopDetailsListItem.vue", () => {
  it("renders time correctly", () => {
    const wrapper = mount(BusStopDetailsListItem, {
      props: {
        time: "12:30",
        nearest: false,
      },
    });

    expect(wrapper.text()).toContain("12:30");
  });

  it('applies the "stop-details__list-item--nearest" class when nearest is true', () => {
    const wrapper = mount(BusStopDetailsListItem, {
      props: {
        time: "12:30",
        nearest: true,
      },
    });

    expect(wrapper.classes()).toContain("stop-details__list-item--nearest");
  });

  it('does not apply the "stop-details__list-item--nearest" class when nearest is false', () => {
    const wrapper = mount(BusStopDetailsListItem, {
      props: {
        time: "12:30",
        nearest: false,
      },
    });

    expect(wrapper.classes()).not.toContain("stop-details__list-item--nearest");
  });

  it("renders the nearest icon when nearest is true", () => {
    const wrapper = mount(BusStopDetailsListItem, {
      props: {
        time: "12:30",
        nearest: true,
      },
    });

    expect(wrapper.find(".list-item__nearest-icon").exists()).toBe(true);
  });

  it("does not render the nearest icon when nearest is false", () => {
    const wrapper = mount(BusStopDetailsListItem, {
      props: {
        time: "12:30",
        nearest: false,
      },
    });

    expect(wrapper.find(".list-item__nearest-icon").exists()).toBe(false);
  });
});
