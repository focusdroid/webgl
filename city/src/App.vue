<script setup>
import {onMounted} from "vue";
import { initCity } from './enter/index'
onMounted(() => {
  // 初始化三维场景
  initCity()
})
</script>

<template>
<canvas id="canvas"></canvas>
</template>

<style scoped>

</style>
