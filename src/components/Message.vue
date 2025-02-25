<script setup lang="ts">

let props = defineProps<{
    senderName:string,
    updatedAt:string,
    text:string
}>();

</script>

<template>
    <div class="card">
        <div class="head">
            <div class="sender-name">{{ props.senderName }}</div>
            <div class="updated-at">{{ props.updatedAt ? new Date(props.updatedAt).toLocaleString([],{dateStyle:"short",timeStyle:"short"}) : "" }}</div>
        </div>
        <div class="text">{{ props.text }}</div>
    </div>
</template>

<style scoped>

.card{
    background-color:var(--clr-neutral-200);
    border:solid 1px var(--clr-neutral-300);
    padding:var(--size-400) var(--size-300);
    margin-block:var(--size-200);
    border-radius:var(--size-100);
}
.card .head{
    font-size:var(--fs-300);
    color:var(--clr-neutral-800);
    text-transform:uppercase;
    display:flex;
    justify-content:space-between;
}
.card .text{
    margin-top:var(--size-300);
    font-size:var(--fs-600);
}

</style>