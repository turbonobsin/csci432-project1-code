<script setup lang="ts">
import { endLoading, serverURL, startLoading, User, UserResponse, wait } from '@/util';
import { onMounted, ref } from "vue";

let r_userName = ref("");
let r_firstName = ref("");
let r_lastName = ref("");
let r_email = ref("");
let r_showInfo = ref(false);

async function getUserInfo(){
    let token = localStorage.getItem("token");
    if(!token) return;
    
    startLoading();
    
    // let res = await fetch(serverURL+"user",{
    //     method:"GET",
    //     headers:{
    //         "Authorization":`Bearer ${token}`
    //     }
    // });

    // await wait(500);

    let res = {
        status:200,
        json:async ()=>{
            return {
                userName:"claebcode",
                firstName:"Caleb",
                lastName:"Early",
                email:"bobemail@gmail.com"
            } as User;
        }
    };

    if(res.status == 200){
        let user = await res.json() as User;

        r_userName.value = user.userName;
        r_firstName.value = user.firstName;
        r_lastName.value = user.lastName;
        r_email.value = user.email;
        r_showInfo.value = true;        
    }
    else{
        alert(`Error ${res.status} when trying to get user information, try logging back in.`);
    }

    endLoading();
}

onMounted(()=>{
    getUserInfo();
});

</script>

<template>
    <section class="container">
        <header class="sub-header">
            <div>Profile</div>
        </header>

        <main>
            <div class="loading"></div>
            <div :class="['info-list',!r_showInfo?'hide':'','vertical']">
                <div class="info-group">
                    <div class="info-item fullw accent">
                        <h3>First Name</h3>
                        <p class="strong">{{ r_firstName }}</p>
                    </div>
                    <div class="info-item fullw accent accent2">
                        <h3>Last Name</h3>
                        <p class="strong">{{ r_lastName }}</p>
                    </div>
                </div>
                <div class="info-item">
                    <h3>Username</h3>
                    <p>{{ r_userName }}</p>
                </div>
                <div class="info-item">
                    <h3>Email</h3>
                    <p>{{ r_email }}</p>
                </div>
                <br><br><br>
                <RouterLink to="/profile/settings" class="goto-link">
                    <div class="icon">east</div>
                    <div>More Settings</div>
                </RouterLink>
            </div>
        </main>
    </section>
</template>

<style scoped>



</style>