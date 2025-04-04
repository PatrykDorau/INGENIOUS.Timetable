<template>
  <router-link
    class="tabs__button"
    :class="{ 'tabs__button--active': props.data.active }"
    :to="props.data.to"
  >
    {{ props.data.name }}
  </router-link>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { Tab } from "@/types/TabTypes";
import { RouterLink } from "vue-router";

const props = defineProps<{ data: Tab }>();
</script>
