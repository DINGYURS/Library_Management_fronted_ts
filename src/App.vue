<script setup>
import { provide } from 'vue'
import * as echarts from 'echarts'

provide('echarts', echarts)
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style scoped></style>
