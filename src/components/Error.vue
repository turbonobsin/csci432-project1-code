<script setup lang="ts">
import { wait } from '@/util';
import { onMounted, Ref, ref, useTemplateRef, watchEffect } from 'vue';

// JS way
// const props = defineProps({
//     name:{type:String}
// });

// TS way
// const props = defineProps<{
//     name:string,
//     inp:string
// }>();

const r_message = ref("");

defineExpose({
    alert:(msg:string)=>{
        r_message.value = msg;
    },
    hookToInput:(inp:HTMLInputElement)=>{
        inp.addEventListener("input",e=>{
            r_message.value = "";
        });
    }
});

</script>

<template>
    <div v-show="r_message.length != 0">
        {{ r_message }}
    </div>
</template>

<style scoped>

div{
    color:var(--clr-error-500);
}

</style>