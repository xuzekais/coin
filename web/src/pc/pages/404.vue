<template>
    <div class="w-full h-full vh-center">
        你好，404
    </div>
</template>
<script lang="ts" setup name="404">
import { useRouter } from "vue-router";

const router = useRouter();
function goHome() {
    router.replace('/');
}
</script>
<style lang="scss">
</style>