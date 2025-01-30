<script setup lang="ts">
import Header from '@/components/Header.vue';
import { useRouter } from 'vue-router';

import { initInputsForErrorHandling, serverURL, updateErrorMsg, UserResponse, validateEmail, validatePassword } from '@/util';


const router = useRouter();

async function signIn(e:MouseEvent){
    let email = document.querySelector<HTMLInputElement>("#email").value;
    let password = document.querySelector<HTMLInputElement>("#password").value;
    if(!email || !password){
        updateErrorMsg("Please fill out all required fields.");
        return;
    }

    if(!validateEmail(email)){
        updateErrorMsg("Please enter a valid email address",["#email"]);
        return;
    }

    let res = await fetch(serverURL+"user/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            email,
            password
        })
    });
    if(res.status == 200){
        let data = await res.json() as UserResponse;
        console.log("signin data: ",data);
        localStorage.setItem("token",data.token);
        localStorage.setItem("userName",data.user.userName);

        router.push({
            name:"main"
        });
    }
    else if(res.status == 400){
        console.warn("error logging in: 400");
        updateErrorMsg("Incorrect email or password");
        return;
    }
    else{
        updateErrorMsg(`Error ${res.status} error occured while logging in, please try again later`);
        return;
    }
}

document.addEventListener("DOMContentLoaded",e=>{
    initInputsForErrorHandling();
});

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
                    <label for="username">Email</label>
                    <input type="text" name="email" id="email">
                </div>
                <div class="form-item">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password">
                </div>
            </form>
            <div class="error"></div>
            <button class="button margin-block-500" @click="signIn">Sign In</button>
        </section>
    </main>
</template>

<style scoped>
</style>