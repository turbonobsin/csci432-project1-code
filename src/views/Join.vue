<script setup lang="ts">
import Header from '@/components/Header.vue';
import { useRouter } from 'vue-router';

const serverURL = "https://hap-app-api.azurewebsites.net/";

const router = useRouter();

function updateErrorMsg(msg:string,highlights?:string[]){
    const error = document.querySelector(".error");
    if(error) error.textContent = msg;

    // clear
    let items = document.querySelectorAll(".error-highlight");
    for(const elm of items){
        elm.classList.remove("error-highlight");
    }
    
    if(highlights){
        for(const selector of highlights){
            let elm = document.querySelector(selector);
            if(elm) elm.classList.add("error-highlight");
        }
    }
}
function init(){
    /**@type {HTMLInputElement[]} */
    let inputs = document.querySelectorAll("input");
    for(const inp of inputs){
        inp.addEventListener("input",e=>{
            updateErrorMsg("");
        });
    }
}

async function join(){
    let fields = [...document.querySelector(".form").querySelectorAll("input")];
    if(fields.some(v=>!v.value)){
        // alert("Failed to join, some inputs were empty.");
        updateErrorMsg("Please fill out all required fields.");
        return;
    }

    function getValue(id:string){
        return document.querySelector<HTMLInputElement>(id).value;
    }
    let firstName = getValue("#first_name");
    let lastName = getValue("#last_name");
    let email = getValue("#email");
    let userName = getValue("#username");
    let password = getValue("#password");
    let confirmPassword = getValue("#confirm_password");

    if(email.match(/.+@.+\..+/)){
        updateErrorMsg("Please enter a valid email address");
        return;
    }
    if(password.length < 8){
        updateErrorMsg("Password must be at least 8 characters");
        return;
    }
    if(password != confirmPassword){
        updateErrorMsg("Passwords do not match",["#password","#confirm_password"]);
        return;
    }

    let res = await fetch(serverURL+"user",{
        method:"POST",
        headers:{
            "Context-Type":"application/json"
        },
        body:JSON.stringify({
            email,
            userName,
            password,
            firstName,
            lastName
        })
    });
    if(res.status == 201){

    }
    else if(res.status == 400){
        let data = await res.json() as {token:string};
        // localStorage.setItem("token",data.)
    }

    // localStorage.setItem("username",username);

    alert("success");
    return;
    
}

document.addEventListener("DOMContentLoaded",e=>{
    init();
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
            <div class="error"></div>
            <button class="button margin-block-500" @click="join">Join</button>
        </section>
    </main>
</template>

<style scoped>
</style>