<template>
  <div class="bus-details__item line-details" :class="{ active: activeLine }">
    <template v-if="!activeLine">
      <DetailsPlaceholder text="Please select the bus line first" />
    </template>
    <template v-else>
      <p class="line-details__line">Bus line: {{ activeLine.line }}</p>
      <div class="line-details__list-title">
        Bus stops
        <IconComponent @click="sort" :sort-dir="stopsSortDir" />
      </div>
      <div class="line-details__list" ref="listContainer">
        <TransitionGroup name="fade-move" appear>
          <BusLineDetailsListItem
            v-for="(stop, index) in activeLine.stops"
            :key="stop.order * Number(stop.time[0].split(':').join(''))"
            :data="stop"
            :style="{
              '--delay': `${Math.min(2000, Math.max(300, index * 100))}ms`,
            }"
          />
        </TransitionGroup>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { StoreStateType, LineType } from "@/types/StoreTypes";
import BusLineDetailsListItem from "@/components/bus-lines/details/BusLineDetailsListItem.vue";
import { scrollTop } from "@/services/CustomFunctions";
import DetailsPlaceholder from "@/components/base/DetailsPlaceholder.vue";
import IconComponent from "@/components/base/IconComponent.vue";

const store = useStore<StoreStateType>();

const activeLine = computed<LineType | undefined>(
  () => store.getters.getActiveLine
);

const stopsSortDir = computed(() => store.getters.getActiveLineStopsSortDir);

const listContainer = ref<HTMLElement | null>(null);

watch(
  () => activeLine.value,
  () => {
    if (listContainer.value) scrollTop(listContainer.value);
  }
);

const sort = () => {
  if (listContainer.value) scrollTop(listContainer.value);
  store.dispatch("sortActiveLineStops");
};
</script>
