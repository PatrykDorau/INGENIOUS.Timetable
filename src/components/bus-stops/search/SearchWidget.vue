<template>
  <div class="search__widget">
    <input
      @focus="changeText('Search', 'focus')"
      @blur="changeText('Search...', 'blur')"
      v-model="searchValue"
      id="search-input"
      class="widget__input"
      type="text"
      autocomplete="off"
      placeholder=""
      @input="search"
    />
    <label class="widget__label" for="search-input">{{ labelText }}</label>
    <img
      class="widget__icon"
      src="@/assets/img/icons/search.png"
      alt="search icon"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from "vue";

let labelText = ref("Search...");
let searchValue = ref("");

const emit = defineEmits<{
  (event: "update", value: string): void;
}>();

const changeText = (text: string, type: "focus" | "blur") => {
  if (type === "blur" && searchValue.value === "") {
    labelText.value = text;
  } else if (type === "focus") {
    labelText.value = text;
  }
};

const search = () => {
  emit("update", searchValue.value);
};
</script>
