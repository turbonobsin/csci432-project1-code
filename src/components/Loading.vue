<script setup lang="ts">
import { endLoading, startLoading, wait } from '@/util';
import { ref, useTemplateRef } from 'vue';

const r_isLoading = ref(false);
const loading = useTemplateRef("loading");

defineExpose({
    start:()=>{
        r_isLoading.value = true;
        startLoading(loading.value);
    },
    end:()=>{
        r_isLoading.value = false;
        endLoading(loading.value);
    }
});

</script>

<template>
    <div ref="loading" v-show="r_isLoading"></div>
</template>

<style scoped>
</style>