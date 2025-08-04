<template>
    <div>
       我是首页
    </div>
</template>

<script setup lang="ts" name="Home">
import { computed, reactive } from 'vue';
const props = defineProps({});
const currentMusician = reactive({
    url: '',
});

</script>

<style lang="scss" scoped>
</style>