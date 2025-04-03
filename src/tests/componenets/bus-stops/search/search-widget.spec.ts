import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";

import SearchWidget from "@/components/bus-stops/search/SearchWidget.vue";

describe("SearchWidget.vue", () => {
  it("renders correctly and updates placeholder on focus/blur", async () => {
    const wrapper = mount(SearchWidget);

    const input = wrapper.find("input");

    expect(wrapper.find(".widget__label").text()).toBe("Search...");

    await input.trigger("focus");
    expect(wrapper.find(".widget__label").text()).toBe("Search");

    await input.trigger("blur");
    expect(wrapper.find(".widget__label").text()).toBe("Search...");
  });

  it("emits the correct search value on input", async () => {
    const wrapper = mount(SearchWidget);

    const input = wrapper.find("input");

    await input.setValue("Test search");

    await input.trigger("input");

    expect(wrapper.emitted().update).toBeTruthy();
    expect(wrapper.emitted().update[0]).toEqual(["Test search"]);
  });

  it("does not update label text on blur if the input has value", async () => {
    const wrapper = mount(SearchWidget);

    const input = wrapper.find("input");

    await input.setValue("Hello");
    await input.trigger("focus");
    expect(wrapper.find(".widget__label").text()).toBe("Search");

    await input.trigger("blur");
    expect(wrapper.find(".widget__label").text()).toBe("Search");
  });
});
