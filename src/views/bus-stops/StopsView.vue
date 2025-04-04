<template>
  <div class="container__bus-stops">
    <Transition name="fade">
      <LoaderComponent v-if="loading" />
    </Transition>
    <Search @update="updateSearchValue" />
    <BusStopsList :search-value="searchValue" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Search from "@/components/bus-stops/search/SearchWidget.vue";
import BusStopsList from "@/components/bus-stops/list/BusStopsList.vue";
import { useStore } from "vuex";
import { StoreStateType } from "@/types/StoreTypes";
import LoaderComponent from "@/components/loader/LoaderComponent.vue";

const store = useStore<StoreStateType>();

const loading = computed<boolean>(() => store.getters["loading/getLoading"]);

let searchValue = ref("");

const updateSearchValue = (value: string) => {
  searchValue.value = value;
};
</script>
