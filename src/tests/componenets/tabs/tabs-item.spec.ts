import { mount } from "@vue/test-utils";
import TabItem from "@/components/tabs/TabItem.vue";
import { it, describe, expect } from "vitest";
import { createRouter, createWebHistory, RouterLink } from "vue-router";
import { routes } from "@/router/index";

describe("TabItem.vue", () => {
  const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
  });

  it("renders the correct name and applies active class when active", async () => {
    const wrapper = mount(TabItem, {
      global: {
        plugins: [router],
      },
      props: {
        data: {
          id: 1,
          name: "Stops",
          to: "/stops",
          active: true,
        },
      },
    });

    expect(wrapper.find(".tabs__button").classes()).toContain(
      "tabs__button--active"
    );

    expect(wrapper.text()).toBe("Stops");

    const routerLink = wrapper.findComponent(RouterLink);
    expect(routerLink.props().to).toBe("/stops");
  });

  it("does not apply active class when not active", async () => {
    const wrapper = mount(TabItem, {
      global: {
        plugins: [router],
      },
      props: {
        data: {
          id: 2,
          name: "Bus Lines",
          to: "/bus-lines",
          active: false,
        },
      },
    });

    expect(wrapper.find(".tabs__button").classes()).not.toContain(
      "tabs__button--active"
    );
  });
});
