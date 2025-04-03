<template>
  <img
    class="sort-icon"
    :class="{ dsc: props.sortDir === 'dsc' }"
    src="@/assets/img/icons/arrow-bottom-rec.png"
    alt="bus line sort icon"
  />
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{ sortDir: "dsc" | "asc" }>();
</script>
