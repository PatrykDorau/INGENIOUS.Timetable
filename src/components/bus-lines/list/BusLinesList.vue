<template>
  <div class="bus-lines">
    <Transition name="fade">
      <LoaderComponent v-if="loading" />
    </Transition>
    <p class="bus-lines__title">Select bus line</p>
    <template v-if="lines?.length <= 0 && !loading">
      <p class="error__info">
        No lines found, please refresh the page. If problem persists, contact us at page@admin.com.
      </p>
    </template>
    <template v-else>
      <div class="bus-lines__list">
        <TransitionGroup name="fade">
          <BusLinesListItem
            v-for="line in lines"
            :key="line.line"
            :data="line"
          />
        </TransitionGroup>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { LineType } from "@/types/BusDataTypes";
import { StoreStateType } from "@/types/StoreTypes";
import BusLinesListItem from "./BusLinesListItem.vue";
import LoaderComponent from "@/components/loader/LoaderComponent.vue";

const store = useStore<StoreStateType>();
const lines = computed<LineType[]>(() => store.getters.getLines);
const loading = computed<boolean>(() => store.getters["loading/getLoading"]);
</script>
