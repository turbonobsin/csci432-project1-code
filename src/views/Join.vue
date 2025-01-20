<script setup>
import Header from '@/components/Header.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function join(){
    /**@type {HTMLInputElement[]} */
    let fields = [...document.querySelector(".form").querySelectorAll("input")];
    if(fields.some(v=>!v.value)){
        alert("Failed to join, some inputs were empty.");
        return;
    }

    let username = document.querySelector("#username").value;

    localStorage.setItem("username",username);
    
    router.push({
        name:"main"
    });
}
</script>

<template>
    <Header>
        <nav>
            <RouterLink to="/signin">Sign In</RouterLink>
        </nav>
    </Header>

    <main class="padding-block-700">
        <section class="container center vertical">
            <form action="" class="form">
                <div class="form-item">
                    <label for="first_name">First Name</label>
                    <input type="text" name="first_name" id="first_name">
                </div>
                <div class="form-item">
                    <label for="last_name">Last Name</label>
                    <input type="text" name="last_name" id="last_name">
                </div>
                <div class="form-item">
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email">
                </div>
                <div class="form-item">
                    <label for="username">Username</label>
                    <input type="text" name="username" id="username">
                </div>
                <div class="form-item">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password">
                </div>
                <div class="form-item">
                    <label for="confirm_password">Confirm Password</label>
                    <input type="password" name="confirm_password" id="confirm_password">
                </div>
            </form>
            <button class="button margin-block-500" @click="join">Join</button>
        </section>
    </main>
</template>

<style scoped>
</style>