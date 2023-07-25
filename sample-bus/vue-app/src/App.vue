<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import axios from 'axios';
import VueSocketIO from 'vue-socket.io';
import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:5001");
const likelyBus = ref(null);
const stopRequestData = ref(null);

onMounted(() => {
    socket.on('connect', () => {
    console.log('Socket connected');
    });
    
    socket.on('connect_error', (error) => {
    console.log('Connection error', error);
    });

    socket.on('likely_bus_received', (data) => {
        console.log("My likely bus data from django", data);
        likelyBus.value = data;
    })

    socket.on('stop_request_received', (data) => {
        console.log('Received stop request', data);
        stopRequestData.value = data;
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected');
    });
});

onUnmounted(() => {
    console.log("stopping socket")
    socket.off('stop_request_received');
    socket.close();
});
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <p v-if="likelyBus">{{ likelyBus.id }}</p>
  <p v-if="stopRequestData">{{ stopRequestData.deviceName }}</p>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
