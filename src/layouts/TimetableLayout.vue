<template>
  <div class="timetable">
    <h1 class="timetable__title">Timetable</h1>
    <Tabs />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <Teleport to="body">
      <ModalNotification />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useStore } from "vuex";
import { StoreStateType } from "@/types/StoreTypes";

import Tabs from "@/components/tabs/TabsWidget.vue";
import ModalNotification from "@/components/base/ModalNotification.vue";

const store = useStore<StoreStateType>();

onMounted(() => {
  store.dispatch("fetchStops");
});
</script>
