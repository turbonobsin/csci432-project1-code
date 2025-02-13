<script setup lang="ts">
import { serverURL, wait } from '@/util';
import { onMounted, ref, useTemplateRef, watch } from 'vue';
import Error from '@/components/Error.vue';
import Loading from '@/components/Loading.vue';

let name = ref(localStorage.getItem("userName"));
let time = ref("evening");
let now = new Date();
let hours = now.getHours();
if(hours >= 18) time.value = "evening";
else if(hours >= 12) time.value = "afternoon";
else time.value = "morning";

// messages
let r_message = ref("");
let message = useTemplateRef("message");

let error = useTemplateRef("error");
let loading = useTemplateRef("loading");

async function sendMessage(){
    error.value.alert("");
    
    if(r_message.value.length == 0) return;
    r_message.value = r_message.value.trim();
    if(r_message.value.length == 0){
        error.value.alert("Message can't be empty!");
        return;
    }

    if(r_message.value.length > 280){
        error.value.alert("Message too long! Max length is 280.");
        return;
    }
    
    let token = localStorage.getItem("token");
    if(!token){
        return;
    }

    loading.value.start();
    
    let res = await fetch(serverURL+"message",{
        method:"POST",
        headers:{
            "Authorization":`Bearer ${token}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            text:r_message.value
        })
    });

    // for testing...
    // let res = {
    //     status:500
    // };

    loading.value.end();

    if(res.status == 201){
        console.log("Message post success");
        r_message.value = "";
    }
    else if(res.status == 401){
        console.warn("Failed to post message: please login");
        error.value.alert("Please login to post a message.");
    }
    else{
        console.warn("An error occurred while trying to post the message, code: "+res.status);
        error.value.alert("An error occurred while trying to post the message, code "+res.status+".");
    }
}

onMounted(()=>{
    error.value.hookToInput(message.value);
});

</script>

<template>
    <section class="container">
        <header class="sub-header">
            <div>Home</div>
        </header>
        <br>
        <h1 class="fs-secondary-heading">Good {{ time }}, {{ name }}.</h1>

        <div class="margin-block-700">
            <header class="sub-header">
                <div>Messages</div>
            </header>
            <div class="input-wrapper">
                <!-- <button class="icon">chat</button> -->
                <div class="input-cont accent2 fullw">
                    <input autocomplete="off" v-model="r_message" ref="message" class="accent2 fullw" type="text" name="message" id="i-message" placeholder="Type a message here..." @keydown.enter="sendMessage">
                </div>
                <button :disabled="r_message.length == 0" class="icon b-send-message" @click="sendMessage">send</button>
            </div>
            <Loading ref="loading" class="margin-block-500"></Loading>
            <Error ref="error" class="margin-block-500"></Error>
        </div>
    </section>
</template>

<style scoped>

.fs-secondary-heading{
    font-size:var(--fs-650);
}

</style>