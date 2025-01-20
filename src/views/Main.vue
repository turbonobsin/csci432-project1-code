<script setup>
import Header from '@/components/Header.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

/**
 * @param e {MouseEvent}
 */
function signOut(e){
    router.push({
        name:"home"
    });
}

const name = localStorage.getItem("username") ?? "(not logged in)";

</script>

<template>
    <Header>
        <nav>
            <a @click="signOut">Sign Out</a>
        </nav>
    </Header>

    <main class="padding-block-700">
        <section class="container center">
            <h1 class="fs-primary-heading">Welcome {{ name }}!</h1>
        </section>
    </main>
</template>

<style scoped>
</style>