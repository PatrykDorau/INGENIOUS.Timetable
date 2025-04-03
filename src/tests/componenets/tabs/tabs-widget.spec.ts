import { mount } from "@vue/test-utils";
import Tabs from "@/components/tabs/TabsWidget.vue";
import TabItem from "@/components/tabs/TabItem.vue";
import { it, describe, expect, beforeEach, vi } from "vitest";
import { createRouter, createWebHistory, Router } from "vue-router";
import { routes } from "@/router/index";

describe("Tabs.vue", () => {
  let router: Router;

  beforeEach(() => {
    window.scrollTo = vi.fn();

    router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes,
    });
  });

  it("renders correctly with the correct active tab based on the route", async () => {
    const wrapper = mount(Tabs, {
      global: {
        plugins: [router],
      },
    });

    await router.push("/stops");
    await router.isReady();

    let tabs = wrapper.findAllComponents(TabItem);
    expect(tabs[0].props().data.active).toBe(false);
    expect(tabs[1].props().data.active).toBe(true);

    await router.push("/bus-lines");
    await router.isReady();

    tabs = wrapper.findAllComponents(TabItem);
    expect(tabs[0].props().data.active).toBe(true);
    expect(tabs[1].props().data.active).toBe(false);
  });

  it("renders the correct number of tabs", async () => {
    const wrapper = mount(Tabs, {
      global: {
        plugins: [router],
      },
    });

    const tabs = wrapper.findAllComponents(TabItem);
    expect(tabs).toHaveLength(2);
  });
});
