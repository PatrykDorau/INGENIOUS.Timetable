import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "base",
    redirect: "/stops",
    component: () => import("../layouts/TimetableLayout.vue"),
    children: [
      {
        path: "/stops",
        name: "stops",
        component: () => import("../views/bus-stops/StopsView.vue"),
      },
      {
        path: "/bus-lines",
        name: "lines",
        component: () => import("../views/bus-lines/LinesView.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/stops",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

export default router;
