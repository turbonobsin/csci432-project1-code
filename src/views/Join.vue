<script setup lang="ts">
import Header from '@/components/Header.vue';
import { useRouter } from 'vue-router';
import { ref, onMounted } from "vue";

import { endLoading, initInputsForErrorHandling, serverURL, startLoading, updateErrorMsg, UserResponse, validateEmail, validatePassword, wait } from '@/util';

const router = useRouter();

let r_firstName = ref("");
let r_lastName = ref("");
let r_email = ref("");
let r_username = ref("");
let r_password = ref("");
let r_confirmPassword = ref("");

function getValue(id:string){
    return document.querySelector<HTMLInputElement>(id).value;
}

async function join(){    
    updateErrorMsg("");
    
    let fields = [...document.querySelector(".form").querySelectorAll("input")];
    if(fields.some(v=>!v.value)){
        updateErrorMsg("Please fill out all required fields.");
        return;
    }

    let firstName = r_firstName.value; // getValue("#first_name");
    let lastName = r_lastName.value; // getValue("#last_name");
    let email = r_email.value; // getValue("#email");
    let userName = r_username.value; // getValue("#username");
    let password = r_password.value; // getValue("#password");
    let confirmPassword = r_confirmPassword.value; //getValue("#confirm_password");

    if(!validateEmail(email)){
        updateErrorMsg("Please enter a valid email address",["#email"]);
        return;
    }
    if(!validatePassword(password)){
        updateErrorMsg("Password must be at least 8 characters",["#password"]);
        return;
    }
    if(password != confirmPassword){
        updateErrorMsg("Passwords do not match",["#password","#confirm_password"]);
        return;
    }

    startLoading(document.querySelector(".loading"));
    
    let res = await fetch(serverURL+"user",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            email,
            userName,
            password,
            firstName,
            lastName
        })
    });
    await wait(500); // extra waiting xD

    endLoading();

    if(res.status == 201){
        let data = await res.json() as UserResponse;
        console.log("join data: ",data);
        localStorage.setItem("token",data.token);
        localStorage.setItem("userName",data.user.userName);

        router.push({
            name:"main"
        });

        endLoading();
        return;
    }

    await wait(500); // extra waiting xD
    endLoading();
    
    if(res.status == 400){
        console.warn("error: ",await res.json());
        updateErrorMsg(res.statusText);
        return;
    }
    else{
        updateErrorMsg(`Error ${res.status} error occured while creating an account, please try again later`);
        return;
    }
}

onMounted(()=>{
    initInputsForErrorHandling();
});
</script>

<template>
    <Header>
        <nav>
            <RouterLink to="/signin">Sign In</RouterLink>
            <RouterLink to="/">Home</RouterLink>
        </nav>
    </Header>

    <main class="padding-block-700">
        <section class="container center vertical">
            <form action="" class="form">
                <div class="form-item">
                    <label for="first_name">First Name</label>
                    <input v-model="r_firstName" type="text" name="first_name" id="first_name">
                </div>
                <div class="form-item">
                    <label for="last_name">Last Name</label>
                    <input v-model="r_lastName" type="text" name="last_name" id="last_name">
                </div>
                <div class="form-item">
                    <label for="email">Email</label>
                    <input v-model="r_email" type="email" name="email" id="email">
                </div>
                <div class="form-item">
                    <label for="username">Username</label>
                    <input v-model="r_username" type="text" name="username" id="username">
                </div>
                <div class="form-item">
                    <label for="password">Password</label>
                    <input v-model="r_password" type="password" name="password" id="password">
                </div>
                <div class="form-item">
                    <label for="confirm_password">Confirm Password</label>
                    <input v-model="r_confirmPassword" type="password" name="confirm_password" id="confirm_password">
                </div>
            </form>
            <div class="loading"></div>
            <div class="error"></div>
            <button class="button margin-block-500" @click="join">Join</button>
        </section>
    </main>
</template>

<style scoped>
</style>