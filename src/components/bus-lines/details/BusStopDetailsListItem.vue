<template>
  <div
    class="stop-details__list-item"
    :class="{ 'stop-details__list-item--nearest': props.nearest }"
  >
    <i v-if="props.nearest" class="list-item__nearest-icon"></i>
    {{ props.time }}
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{ time: string; nearest: boolean }>();
</script>
