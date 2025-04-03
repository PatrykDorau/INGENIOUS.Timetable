<template>
  <div class="container__bus-lines">
    <BusLinesList />
    <BusDetails />
  </div>
</template>

<script setup lang="ts">
import BusLinesList from "../../components/bus-lines/list/BusLinesList.vue";
import BusDetails from "../../components/bus-lines/details/BusDetails.vue";
</script>
