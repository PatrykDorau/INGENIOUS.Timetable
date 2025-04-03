<template>
  <p class="line-details__placeholder-text">
    {{ props.text }}
  </p>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{ text: string }>();
</script>
