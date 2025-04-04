<template>
  <button
    class="bus-lines__item"
    :class="{ 'bus-lines__item--active': props.data.active }"
    @click="chooseLine"
  >
    {{ props.data.line }}
  </button>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { StoreStateType } from "@/types/StoreTypes";
import { LineType } from "@/types/BusDataTypes";
import { useStore } from "vuex";

const props = defineProps<{ data: LineType }>();

const store = useStore<StoreStateType>();

const chooseLine = () => {
  store.dispatch("setActiveLine", props.data.line);
};
</script>
