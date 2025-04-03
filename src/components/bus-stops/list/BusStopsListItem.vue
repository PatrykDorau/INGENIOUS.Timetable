<template>
  <div class="bus-stops__list-item">
    {{ props.data.stop }}
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { UniqueStopType } from "@/types/StoreTypes";

const props = defineProps<{ data: UniqueStopType }>();
</script>
