<template>
  <div class="tabs d-flex">
    <TabItem v-for="tab in tabs" :key="tab.id" :data="tab" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Tab } from "@/types/TabTypes";
import TabItem from "./TabItem.vue";

import { useRoute } from "vue-router";

const route = useRoute();

const tabs = ref<Tab[]>([
  {
    id: 1,
    name: "Bus lines",
    to: "/lines",
    active: route.path == "/lines",
  },
  {
    id: 2,
    name: "Stops",
    to: "/stops",
    active: route.path == "/stops",
  },
]);

watch(
  route,
  (nR) => {
    tabs?.value?.forEach((tab) => {
      tab.active = tab.to === nR.path;
    });
  },
  {
    immediate: true,
  }
);
</script>
