<script setup>
import Header from '@/components/Header.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

/**
 * @param e {MouseEvent}
 */
function signIn(e){
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    if(!username || !password){
        alert("Failed to login, some inputs were empty.");
        return;
    }

    localStorage.setItem("username",username);
    
    router.push({
        name:"main"
    });
}

</script>

<template>
    <Header>
        <nav>
            <RouterLink to="/join">Join</RouterLink>
            <RouterLink to="/">Home</RouterLink>
        </nav>
    </Header>

    <main class="padding-block-700">
        <section class="container center vertical">
            <form action="" class="form">
                <div class="form-item">
                    <label for="username">Username</label>
                    <input type="text" name="username" id="username">
                </div>
                <div class="form-item">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password">
                </div>
            </form>
            <button class="button margin-block-500" @click="signIn">Sign In</button>
        </section>
    </main>
</template>

<style scoped>
</style>