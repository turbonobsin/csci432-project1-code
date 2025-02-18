<script setup lang="ts">
import { serverURL } from '@/util';
import { onMounted, ref, registerRuntimeCompiler, useTemplateRef } from 'vue';
import Message from '@/components/Message.vue';

type Msg = {
    senderName:string;
    updatedAt:string;
    text:string;
};

const messages = ref<Msg[]>([]);
const r_newMsgCount = ref(0);

async function loadMessages(before?:string,after?:string,atStart=false){
    if(performance.now()-lastUpdate < 100) return;
    
    lastUpdate = performance.now();
    
    let token = localStorage.getItem("token");
    if(!token){
        return;
    }

    let url = serverURL+"messages?limit=15";
    if(before){
        url += "&before="+before;
    }
    if(after){
        url += "&after="+after;
    }

    let res = await fetch(url,{
        method:"GET",
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
    
    if(res.status == 200){
        let data = await res.json() as Msg[];
        // process/cleanup
        for(const item of data){
            if(!item.senderName){
                item.senderName = "[Deleted User]";
                console.warn("found deleted user",item);
            }
        }
        if(atStart){
            messages.value.splice(0,0,...data);
        }
        else{
            messages.value.push(...data);
        }
    }
    else{
        alert("Error occurred while trying to load messages, code: "+res.status);
    }
}

function getAfterTime(){
    return messages.value.length ? messages.value[0].updatedAt : new Date().toISOString();
}

async function checkForNewMessages(){    
    let token = localStorage.getItem("token");
    if(!token){
        return;
    }

    let after = getAfterTime();
    let url = serverURL+`messages/count?after=${after}`;

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
        alert("Error occurred while trying to check for new messages, code: "+res.status);
    }
}

async function loadNewMessages(){
    await loadMessages(undefined,getAfterTime(),true);
    r_newMsgCount.value = 0;
}

// @ts-ignore
window.loadNewMessages = loadNewMessages;

const messageCont = useTemplateRef("message-cont");

let lastUpdate = -99999;
let isAtTop = true;

onMounted(()=>{
    loadMessages();

    let cont = messageCont.value.parentElement.parentElement;
    cont?.addEventListener("scroll",e=>{
        let top = cont.scrollTop;
        let bottom = top+cont.offsetHeight;
        let tol = 100;
        isAtTop = false;

        if(bottom > cont.scrollHeight-tol){
            // load older messages
            loadMessages(messages.value.length ? messages.value[messages.value.length-1].updatedAt : undefined);
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

</script>

<template>
    <section class="container main-cont">
        <header class="sub-header">
            <div>Messages</div>
        </header>

        <div ref="message-cont" class="messages">
            <div class="new-message-count" :has-new-messages="r_newMsgCount != 0"><button class="icon b-load-new" @click="loadNewMessages()">{{ r_newMsgCount != 0 ? "notifications_active" : "notifications" }}</button>{{ r_newMsgCount }} new message{{ r_newMsgCount == 1 ? "" : "s" }}.</div>
            <div v-for="item in messages">
                <Message :sender-name="item.senderName" :updated-at="item.updatedAt" :text="item.text"></Message>
            </div>
        </div>
    </section>
</template>

<style scoped>

.messages{
    margin-top:var(--size-800);
}
.main-cont{
    margin-bottom:var(--size-800);
}
.new-message-count{
    margin-block:var(--size-400);
    display:flex;
    align-items:center;
    gap:var(--size-300);
    --c:var(--clr-accent-500);
    color:var(--c);
    /* color:var(--clr-accent2-500); */
    /* color:var(--clr-error-500); */

    /* transition:all 0.2s ease-out; */
}
.b-load-new{
    cursor:pointer;
    color:var(--c);
    /* transition:all 0.2s ease-out; */
}
/* .new-message-count[has-new-messages=true]{
    --c:var(--clr-error-500);
} */

</style>