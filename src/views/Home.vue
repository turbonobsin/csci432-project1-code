<script setup>
import Header from '@/components/Header.vue';
import { RouterLink } from 'vue-router';
</script>

<template>
    <Header>
        <nav>
            <RouterLink to="/join">Join</RouterLink>
            <RouterLink to="/signin">Sign In</RouterLink>
        </nav>
    </Header>
    
    <main class="padding-block-700">
        <section class="container center vertical">
            <h1 class="fs-primary-heading">Home</h1>
            <p>Welcome</p>
        </section>
    </main>
</template>

<style scoped>
</style>