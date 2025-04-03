<template>
  <div class="container__bus-details">
    <BusLineDetails />
    <BusStopDetails />
  </div>
</template>

<script setup lang="ts">
import BusLineDetails from "@/components/bus-lines/details/BusLineDetails.vue";
import BusStopDetails from "@/components/bus-lines/details/BusStopDetails.vue";
</script>
