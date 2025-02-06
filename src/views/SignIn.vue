<script setup lang="ts">
import Header from '@/components/Header.vue';
import { useRouter } from 'vue-router';
import { ref, onMounted } from "vue";

import { endLoading, goToPath, initInputsForErrorHandling, serverURL, startLoading, updateErrorMsg, UserResponse, validateEmail, validatePassword, wait } from '@/util';
import { isNavigationFailure } from 'vue-router';
import { NavigationFailureType } from 'vue-router';

const router = useRouter();

let r_email = ref("");
let r_password = ref("");

async function signIn(e:MouseEvent){
    updateErrorMsg("");
    
    let email = r_email.value; // document.querySelector<HTMLInputElement>("#email").value;
    let password = r_password.value; // document.querySelector<HTMLInputElement>("#password").value;
    if(!email || !password){
        updateErrorMsg("Please fill out all required fields.");
        return;
    }

    if(!validateEmail(email)){
        updateErrorMsg("Please enter a valid email address",["#email"]);
        return;
    }

    startLoading();

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
        localStorage.setItem("firstName",data.user.firstName);
        localStorage.setItem("lastName",data.user.lastName);
        localStorage.setItem("email",data.user.email);

        router.push({ name: 'main' }).catch(failure => {
        if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
            console.error('Navigation failed because we are already at the target location');
        }
        });
        // router.push({
        //     name:"main"
        // });
        // goToPath("/main");

        endLoading();
        return;
    }

    await wait(500); // extra waiting xD
    endLoading();
    
    if(res.status == 400){
        console.warn("error logging in: 400");
        updateErrorMsg("Incorrect email or password");
    }
    else{
        updateErrorMsg(`Error ${res.status} error occured while logging in, please try again later`);
    }
}

onMounted(()=>{
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
                    <input v-model="r_email" type="text" name="email" id="email">
                </div>
                <div class="form-item">
                    <label for="password">Password</label>
                    <input v-model="r_password" type="password" name="password" id="password">
                </div>
            </form>
            <div class="loading"></div>
            <div class="error"></div>
            <button class="button margin-block-500" @click="signIn">Sign In</button>
        </section>
    </main>
</template>

<style scoped>
</style>