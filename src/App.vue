<template>
  <div id="app-root">
    <NavBar />
    <router-view />
    <StatsModal />
    <AboutModal />
    <HowToPlayModal />
  </div>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import StatsModal from './components/StatsModal.vue'
import AboutModal from './components/AboutModal.vue'
import HowToPlayModal from './components/HowToPlayModal.vue'
</script>
