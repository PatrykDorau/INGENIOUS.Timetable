<template>
  <div class="bus-stops">
    <p class="bus-stops__title">
      Bus stops
      <IconComponent @click="sort" :sort-dir="uniqueStopsSortDir" />
    </p>
    <template v-if="uniqueStops.length === 0 && !loading">
      <p class="error__info">
        No stops found, contact the page administrator at page@admin.com
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
              '--delay': `${Math.min((index % itemsPerLoad) * 50, 2000)}ms`,
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
import { StoreStateType, UniqueStopType } from "@/types/StoreTypes";
import BusStopDetailsListItem from "@/components/bus-stops/list/BusStopsListItem.vue";
import IconComponent from "@/components/base/IconComponent.vue";
import { scrollTop } from "@/services/CustomFunctions";

const props = defineProps<{ searchValue: string }>();

const store = useStore<StoreStateType>();
const uniqueStops = computed(() => store.getters.getUniqueStops);
const uniqueStopsSortDir = computed(
  () => store.getters.getUniqueStopsSortDirection
);
const loading = computed(() => store.getters.getLoading);

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
      filteredStops.value = uniqueStops.value.filter((stop: UniqueStopType) =>
        stop.stop.toLowerCase().startsWith(newSearchValue.toLowerCase())
      );
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
    filteredStops.value = uniqueStops.value.filter((stop: UniqueStopType) =>
      props.searchValue && props.searchValue.length >= 2
        ? stop.stop.toLowerCase().startsWith(props.searchValue.toLowerCase())
        : true
    );
  },
  { deep: true }
);
</script>
