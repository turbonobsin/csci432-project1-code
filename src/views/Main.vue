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

    <!-- <main class="padding-block-700"> -->

    <!-- I like the smaller left column but he said to do 1/3 page width columns so it's commented out for now -->
    <main class="three-col" style="grid-template-columns:350px 1fr 1fr;">
    <!-- <main class="three-col"> -->
        <!-- <section class="three-col"> -->
            <!-- <h1 class="fs-primary-heading">Welcome {{ name }}!</h1> -->

            <div class=""><RouterView name="leftView"></RouterView></div>
            <div class="router-view-anim"><RouterView name="centerView"></RouterView></div>
            <div class="router-view-anim"><RouterView name="rightView"></RouterView></div>
        <!-- </section> -->
    </main>
</template>

<style scoped>
</style>