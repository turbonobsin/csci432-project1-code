<script setup lang="ts">
import Dropdown from '@/components/Dropdown.vue';
import Header from '@/components/Header.vue';
import { serverURL, updateErrorMsg } from '@/util';
import { useRouter } from 'vue-router';

const router = useRouter();

async function signOut(e:MouseEvent){
    localStorage.removeItem("userName");

    let token = localStorage.getItem("token");
    if(!token){
        router.push({
            name:"home"
        });
        return;
    }

    let res = await fetch(serverURL+"user/logout",{
        method:"POST",
        headers:{
            "Authorization":`Bearer ${token}`
        }
    });

    if(res.status == 200){
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        router.push({
            name:"home"
        });
    }
    else{
        console.warn("error while logging out: "+res.status);
        updateErrorMsg(`Error ${res.status} occured while logging out, please try again later`);
        return;
    }
}

const name = localStorage.getItem("userName") ?? "(not logged in)";

</script>

<template>
    <Header>
        <nav class="center">
            <a @click="signOut">Sign Out</a>
            <Dropdown></Dropdown>
        </nav>
    </Header>

    <div class="error"></div>

    <main class="padding-block-700">
        <section class="container center">
            <h1 class="fs-primary-heading">Welcome {{ name }}!</h1>
        </section>
    </main>
</template>

<style scoped>
</style>