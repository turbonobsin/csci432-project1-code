<script setup lang="ts">
import Error from '@/components/Error.vue';
import { endLoading, getUser, MessageItem, serverURL, startLoading, User, UserResponse, wait } from '@/util';
import { onMounted, ref, useTemplateRef } from "vue";
import { useRouter } from 'vue-router';
import Message from '@/components/Message.vue';

const props = defineProps<{
    userId:string
}>();

const error = useTemplateRef("error");
const loading = useTemplateRef("loading");

let r_message = ref("");
let r_messages = ref<MessageItem[]>([]);
let message = useTemplateRef("message");
let r_loaded = ref(false);
let r_newMsgCount = ref(0);

async function loadMessages(before?:string,after?:string,atStart=false){
    // r_messages.value = [];
    // r_loaded.value = false;

    if(performance.now()-lastUpdate < 100) return;
    
    lastUpdate = performance.now();
    
    let token = localStorage.getItem("token");
    if(!token){
        error.value.alert("Please login.");
        return;
    }

    // startLoading(loading.value);

    let url = new URL(serverURL+"messages/"+props.userId);
    if(before) url.searchParams.set("before",before);
    if(after) url.searchParams.set("after",after);
    url.searchParams.set("limit","15");

    let res = await fetch(url.href,{
        method:"GET",
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

    // await wait(50);

    if(res.status == 200){
        let data = await res.json() as MessageItem[];
        // data.reverse();

        if(atStart){
            r_messages.value.splice(0,0,...data);
        }
        else{
            r_messages.value.push(...data);
        }

        // r_messages.value = data;
        // if(data[0]) for(let i = 0; i < 10; i++) r_messages.value.push(JSON.parse(JSON.stringify(data[0]))); // DEBUG
        r_loaded.value = true;
    }
    else{
        error.value.alert("Error getting private messages with code: "+res.status);
        r_messages.value = [];
    }

    // endLoading(loading.value);
}

function getAfterTime(){
    return r_messages.value.length ? r_messages.value[0].updatedAt : new Date().toISOString();
}
async function loadNewMessages(){
    await loadMessages(undefined,getAfterTime(),true);
    r_newMsgCount.value = 0;
}

async function postMessage(){
    let token = localStorage.getItem("token");
    if(!token){
        error.value.alert("Please login.");
        return;
    }

    startLoading(loading.value);

    let url = new URL(serverURL+"message/"+props.userId);

    let res = await fetch(url.href,{
        method:"POST",
        headers:{
            Authorization:`Bearer ${token}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            text:r_message.value
        })
    });

    if(res.status == 201){
        let data = await res.json() as MessageItem;
        if(!data.senderName){
            data.senderName = localStorage.getItem("firstName")+" "+localStorage.getItem("lastName");
        }
        r_messages.value.splice(0,0,data);

        await wait(10);
        message.value.value = "";
    }
    else{
        error.value.alert("Error posting new private message with code: "+res.status);
    }

    endLoading(loading.value);
}

async function checkForNewMessages(){    
    let token = localStorage.getItem("token");
    if(!token){
        return;
    }

    let after = getAfterTime();
    let url = serverURL+`messages/${props.userId}/count?after=${after}`;

    let res = await fetch(url,{
        method:"GET",
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

    if(res.status == 200){
        let count = await res.json();
        r_newMsgCount.value = count.total;
    }
    else{
        error.value.alert("Error occurred while trying to check for new messages, code: "+res.status);
    }
}

// @ts-ignore
window.message = message;

const messageCont = useTemplateRef("message-cont");
let lastUpdate = -99999;
let isAtTop = true;

onMounted(()=>{
    loadMessages();

    let cont = messageCont.value.parentElement.parentElement.parentElement;
    cont?.addEventListener("scroll",e=>{
        let top = cont.scrollTop;
        let bottom = top+cont.offsetHeight;
        let tol = 100;
        isAtTop = false;

        if(bottom > cont.scrollHeight-tol){
            // load older messages
            loadMessages(r_messages.value.length ? r_messages.value[r_messages.value.length-1].updatedAt : undefined);
        }
        else if(top < cont.scrollHeight+tol){
            isAtTop = true;
        }
    });

    setInterval(async ()=>{
        if(!isAtTop) return;

        await checkForNewMessages();
    },5000);
});

function getSenderName(m:MessageItem){
    if(m.senderId != props.userId) return "You";
    return m.senderName;
}
function isMe(m:MessageItem){
    return (m.senderId != props.userId);
}

// @ts-ignore
window.reloadPrivateMessages = async function(){
    r_messages.value = [];
    r_loaded.value = false;
    
    await wait(20);
    await loadMessages();
};

</script>

<template>
    <section class="container">
        <header class="sub-header">
            <div>Private chat with <span class="receiver-name">{{ $route.query.name }}</span></div>
        </header>

        <main>
            <br>
            <div class="input-wrapper chat-input">
                <div class="input-cont accent2 fullw">
                    <input autocomplete="off" v-model="r_message" class="accent2 fullw" type="text" ref="message" name="message" id="i-message" placeholder="Type a message here..." @keydown.enter="postMessage">
                </div>
                <button :disabled="r_message.length == 0" class="icon" @click="postMessage">send</button>
            </div>
            <br>

            <div class="loading" ref="loading" style="height:30px"></div>
            <Error ref="error"></Error>

            <div class="m-list" ref="message-cont" v-show="r_loaded">
                <div class="new-message-count" :has-new-messages="r_newMsgCount != 0"><button class="icon b-load-new" @click="loadNewMessages()">{{ r_newMsgCount != 0 ? "notifications_active" : "notifications" }}</button>{{ r_newMsgCount }} new message{{ r_newMsgCount == 1 ? "" : "s" }}.</div>
                <Message v-for="m in r_messages" class="m-item" :is-me="isMe(m)" :sender-name="getSenderName(m)" :updated-at="m.updatedAt" :text="m.text"></Message>
                <div v-if="r_messages.length == 0" class="no-messages">
                    No messages yet.
                </div>
            </div>

            <!-- <div class="input-wrapper chat-input">
                <div class="input-cont accent2 fullw">
                    <input autocomplete="off" v-model="r_message" class="accent2 fullw" type="text" ref="message" name="message" id="i-message" placeholder="Type a message here..." @keydown.enter="postMessage">
                </div>
                <button :disabled="r_message.length == 0" class="icon" @click="postMessage">send</button>
            </div> -->
        </main>
    </section>
</template>

<style scoped>

.m-list{
    display:flex;
    flex-direction:column;
    margin-top:var(--size-200);
    margin-bottom:var(--size-800);
}
.m-item{
    padding:var(--size-300);
    border-radius:var(--size-100);
    border:solid 1px var(--clr-neutral-300);
    background-color:var(--clr-neutral-200);
}
.m-item[is-me=true] :deep(.sender-name){
    color:var(--clr-accent-400);
}
.no-messages{
    font-size:var(--fs-400);
}
/* .chat-input{
    position:sticky;
    left:0px;
    bottom:var(--size-400);
    background-color:var(--clr-neutral-100);
    padding:var(--size-300);
    border-radius:var(--size-100);
    margin:var(--size-100);
} */
/* .container{
    height:100%;
    position:relative;
} */
.receiver-name{
    color:var(--clr-accent-400);
}

.new-message-count{
    margin-block:var(--size-400);
    display:flex;
    align-items:center;
    gap:var(--size-300);
    --c:var(--clr-accent-500);
    color:var(--c);
}
.b-load-new{
    cursor:pointer;
    color:var(--c);
}
.new-message-count[has-new-messages=true]{
    --c:var(--clr-error-500);
}

</style>