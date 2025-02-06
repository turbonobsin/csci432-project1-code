<script setup lang="ts">
import { ref } from 'vue';


let name = ref(localStorage.getItem("userName"));
let time = ref("evening");
let now = new Date();
let hours = now.getHours();
if(hours >= 18) time.value = "evening";
if(hours >= 12) time.value = "afternoon";
else time.value = "morning";

</script>

<template>
    <section class="container">
        <header class="sub-header">
            <div>Home</div>
        </header>
        <br>
        <h1 class="fs-secondary-heading">Good {{ time }}, {{ name }}.</h1>
    </section>
</template>

<style scoped>

.fs-secondary-heading{
    font-size:var(--fs-650);
}

</style>