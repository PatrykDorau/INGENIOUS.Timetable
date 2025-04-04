<template>
  <div class="bus-details__item line-details" :class="{ active: activeStop }">
    <template v-if="!activeLine && !activeStop">
      <DetailsPlaceholder text="Please select the bus line first" />
    </template>
    <template v-else-if="activeLine && !activeStop">
      <DetailsPlaceholder text="Please select the stop line first" />
    </template>
    <TransitionGroup name="fade">
      <template v-if="activeStop && activeStop">
        <p class="line-details__line">Bus stop: {{ activeStop?.stop }}</p>
        <div class="line-details__list-title">Time</div>
        <div class="line-details__list" ref="listContainer">
          <TransitionGroup
            name="fade-move"
            appear
            @after-enter="handleAnimationEnd"
          >
            <BusStopDetailsListItem
              v-for="(time, index) in activeStop?.time"
              :key="time + index"
              :time="time"
              :nearest="time === closestFutureTime"
            />
          </TransitionGroup>
        </div>
      </template>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  watchEffect,
  onMounted,
  onUnmounted,
  nextTick,
} from "vue";
import { useStore } from "vuex";
import { StoreStateType } from "@/types/StoreTypes";
import { StopType } from "@/types/BusDataTypes";
import BusStopDetailsListItem from "./BusStopDetailsListItem.vue";
import DetailsPlaceholder from "@/components/base/DetailsPlaceholder.vue";

const listContainer = ref<HTMLElement | null>(null);
const closestFutureTime = ref<string | null>(null);
let intervalId: ReturnType<typeof setInterval> | null = null;

const store = useStore<StoreStateType>();

const activeLine = computed<StopType | undefined>(
  () => store.getters.getActiveLine
);
const activeStop = computed<StopType | undefined>(
  () => store.getters.getActiveStop
);

const updateClosestFutureTime = () => {
  if (
    !activeStop.value ||
    !activeStop.value?.time ||
    activeStop.value.time.length === 0
  ) {
    closestFutureTime.value = null;
    return;
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const futureTimes = activeStop.value.time
    .map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const timeInMinutes = hours * 60 + minutes;
      return { time, minutes: timeInMinutes };
    })
    .filter(({ minutes }) => minutes > currentMinutes);

  if (futureTimes.length === 0) {
    closestFutureTime.value = null;
    return;
  }

  closestFutureTime.value = futureTimes.sort(
    (a, b) => a.minutes - b.minutes
  )[0].time;
};

const scrollToNearestTime = async () => {
  await nextTick();
  const nearestTimeElement = document.querySelector(
    ".stop-details__list-item--nearest"
  );
  if (nearestTimeElement) {
    nearestTimeElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

const handleAnimationEnd = () => {
  scrollToNearestTime();
};

watchEffect(() => {
  updateClosestFutureTime();
});

onMounted(() => {
  intervalId = setInterval(updateClosestFutureTime, 60000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>
