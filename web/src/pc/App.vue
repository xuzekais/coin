<template>
    <router-view />
</template>

<script setup lang="ts" name="App">
import { reactive } from "vue";
const app = reactive({});

</script>

<style lang="scss">
#app {
    width: 100%;
    height: 100%;
    font-family: 'Century Gothic';
}
body {
    margin: 0;
}
</style>