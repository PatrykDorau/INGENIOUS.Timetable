<template>
  <button
    class="line-details__list-item"
    :class="{ active: props.data.active }"
    @click="setActiveStop(props.data)"
  >
    {{ props.data.stop }}
  </button>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { useStore } from "vuex";
import { StoreStateType, StopType } from "@/types/StoreTypes";

const store = useStore<StoreStateType>();

const setActiveStop = (stop: StopType) => {
  store.dispatch("setActiveStop", stop);
};

const props = defineProps<{ data: StopType }>();
</script>
