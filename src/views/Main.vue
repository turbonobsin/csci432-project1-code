<script setup lang="ts">
import Dropdown from '@/components/Dropdown.vue';
import Header from '@/components/Header.vue';
import { useUserStore } from '@/stores/user';
import { serverURL, updateErrorMsg, wait } from '@/util';
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();

const userStore = useUserStore();

async function signOut(e:MouseEvent){
    let token = userStore.token;

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
        userStore.$reset(); // only reset if successful
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

// const name = localStorage.getItem("userName") ?? "(not logged in)";
const route = useRoute();

watch(route,(v,oldV)=>{
    // @ts-ignore
    if("updateCurNavExt" in window) updateCurNavExt();
});

async function goToHome(){
    router.push({name:"main"});
    await wait(100);
    // @ts-ignore
    // if("updateCurNavExt" in window) updateCurNavExt();
}

onMounted(()=>{
    setTimeout(()=>{
        
    });
});

</script>

<template>
    <Header>
        <nav class="center">
            <a @click="goToHome">Home</a>
            <a @click="signOut">Sign Out</a>
            <Dropdown></Dropdown>
        </nav>
    </Header>

    <!-- <main class="padding-block-700"> -->

    <!-- I like the smaller left column but he said to do 1/3 page width columns so it's commented out for now -->
    <main class="three-col main-grid" style="grid-template-columns:350px 1fr 1fr;">
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

.main-grid{
    height:calc(100% - 80px);
}
.main-grid > div{
    background-color:var(--clr-neutral-100);
}

</style>