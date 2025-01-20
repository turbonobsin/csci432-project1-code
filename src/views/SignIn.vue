<script setup>
import Header from '@/components/Header.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

/**
 * @param e {MouseEvent}
 */
function signIn(e){
    router.push({
        name:"main"
    });
}

</script>

<template>
    <Header>
        <nav>
            <RouterLink to="/">Home</RouterLink>
        </nav>
    </Header>

    <main class="padding-block-700">
        <section class="container center">
            <button class="button" @click="signIn">Sign In</button>
        </section>
    </main>
</template>

<style scoped>
</style>