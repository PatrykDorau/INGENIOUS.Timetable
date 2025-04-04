<template>
  <div class="bus-stops">
    <p class="bus-stops__title">
      Bus stops
      <IconComponent @click="sort" :sort-dir="uniqueStopsSortDir" />
    </p>
    <template v-if="uniqueStops.length === 0 && !loading">
      <p class="error__info">
        No stops found, please refresh the page. If problem persists, contact us at page@admin.com.
      </p>
    </template>
    <template v-else>
      <div class="bus-stops__list" ref="scrollContainer">
        <TransitionGroup name="fade-move" appear>
          <BusStopDetailsListItem
            v-for="(stop, index) in filteredStops?.slice(
              0,
              itemsPerLoad * loadIteration
            )"
            :key="`${stop.order}-${stop.stop}`"
            :data="stop"
            :style="{
              '--delay': `${Math.min((index % itemsPerLoad) * 50, 1500)}ms`,
            }"
          />
        </TransitionGroup>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  defineProps,
  onMounted,
  onUnmounted,
  ref,
  watch,
  nextTick,
} from "vue";
import { useStore } from "vuex";
import { StoreStateType } from "@/types/StoreTypes";
import { UniqueStopType } from "@/types/BusDataTypes";
import BusStopDetailsListItem from "@/components/bus-stops/list/BusStopsListItem.vue";
import IconComponent from "@/components/base/IconComponent.vue";
import { scrollTop } from "@/services/CustomFunctions";

const props = defineProps<{ searchValue: string }>();

const store = useStore<StoreStateType>();
const uniqueStops = computed<UniqueStopType[]>(
  () => store.getters.getUniqueStops
);
const uniqueStopsSortDir = computed<"asc" | "dsc">(
  () => store.getters.getUniqueStopsSortDirection
);
const loading = computed<boolean>(() => store.getters["loading/getLoading"]);

const filteredStops = ref<UniqueStopType[]>();
const scrollContainer = ref<HTMLElement | null>(null);
const itemsPerLoad = 50;
const loadIteration = ref(1);

const handleScroll = () => {
  if (!scrollContainer.value) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value;

  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadIteration.value++;
  }
};

const sort = () => {
  if (scrollContainer.value) scrollTop(scrollContainer.value);
  store.dispatch("sortUniqueStops");
};

onMounted(async () => {
  await nextTick();
  filteredStops.value = [...uniqueStops.value];
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener("scroll", handleScroll);
  }
});

onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener("scroll", handleScroll);
  }
});

watch(uniqueStops, (newStops) => {
  if (newStops.length > 0) {
    filteredStops.value = newStops;
  }
});

watch(
  () => props.searchValue,
  (newSearchValue) => {
    if (!newSearchValue || newSearchValue.length < 2) {
      filteredStops.value = uniqueStops.value;
      loadIteration.value = 1;
    } else {
      filteredStops.value = uniqueStops.value.filter((stop: UniqueStopType) => {
        const lowerStopName = stop.stop.toLowerCase();
        const lowerSearch = newSearchValue.toLowerCase();
        const words = lowerStopName.split(" ");

        return (
          lowerStopName.startsWith(lowerSearch) ||
          words.some((word) => word.startsWith(lowerSearch))
        );
      });
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

watch(
  () => uniqueStops.value,
  () => {
    if (!props.searchValue || props.searchValue.length < 2) {
      filteredStops.value = uniqueStops.value;
      loadIteration.value = 1;
    } else {
      const searchLower = props.searchValue.toLowerCase();

      filteredStops.value = uniqueStops.value.filter((stop: UniqueStopType) => {
        const stopLower = stop.stop.toLowerCase();
        const words = stopLower.split(" ");

        return (
          stopLower.startsWith(searchLower) ||
          words.some((word) => word.startsWith(searchLower))
        );
      });
    }
  },
  { deep: true }
);
</script>
