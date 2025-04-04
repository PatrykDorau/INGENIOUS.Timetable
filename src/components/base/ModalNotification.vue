<template>
  <Transition name="slide-down" appear>
    <div
      v-if="notificationData && notificationData.active"
      class="notification__modal"
    >
      <div v-if="notificationData.type" class="modal__icon">
        <img :src="icons[notificationData.type]" alt="" srcset="" />
      </div>
      <p class="modal__title">{{ notificationData.title }}</p>
      <p class="modal__text">{{ notificationData.text }}</p>
      <div class="modal__timer">
        <span class="modal__timer-inner"></span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { NotificationType } from "@/types/ModalTypes";

const store = useStore();

const notificationData = computed<NotificationType>(
  () => store.getters["notifications/getNotificationData"]
);

watch(
  () => notificationData.value,
  () => {
    if (notificationData.value.active) {
      setTimeout(() => {
        // store.dispatch("fireModalMessage", {
        store.dispatch("notifications/fireModalMessage", {
          title: "",
          text: "",
          type: "error",
          timer: 10000,
          active: false,
        });
      }, notificationData.value.timer);
    }
  }
);

const icons = {
  error: require("@/assets/img/icons/error.png"),
  info: require("@/assets/img/icons/info.png"),
  success: require("@/assets/img/icons/success.png"),
};
</script>
