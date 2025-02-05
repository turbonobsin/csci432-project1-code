<script setup>
import { serverURL } from '@/util';
// import { useRouter } from '../../node_modules/vue-router/dist/vue-router';
import { useRouter } from 'vue-router';

const router = useRouter();

async function deleteAccount(){
    let token = localStorage.getItem("token");
    if(!token) return;

    if(!confirm("Are you sure you want to delete your account?\n\nThis action is irreversible!")) return;

    let res = await fetch(serverURL+"user",{
        method:"DELETE",
        headers:{
            "Authorization":`Bearer ${token}`
        }
    });

    if(res.status == 200){
        console.log("> successfully deleted account");
        
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        
        router.push({
            name:"home"
        });
    }
    else{
        console.error("Failed to logout with error code: ",res.status);
        alert("Failed to logout with error code: "+res.status);
    }
}

function goToProfile(){
    router.push({name:"profile"});
}

</script>

<template>
    <div class="dropdown-cont">
        <div class="icon">group</div>
        <div class="dd-list">
            <div class="dd-item" @click="goToProfile">
                <div class="dd-icon">group</div>
                <div>Profile</div>
            </div>
            <div class="dd-item">
                <div class="dd-icon">settings</div>
                <div>Settings</div>
            </div>
            <div class="dd-item" @click="deleteAccount">
                <div class="dd-icon">delete</div>
                <div>Delete Account</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.dropdown-cont{
    display:inline-block;
    position:relative;
}
.icon{
    margin-left:var(--size-400);
    font-size:var(--fs-700);
    position:relative;
    color:var(--clr-neutral-900);
}
.icon::after{
    content:"";
    border-bottom:solid 3px currentColor;
    width:50%;
    height:4px;
    position:absolute;
    bottom:5px;
    left:50%;
    translate:-50% 0px;
    pointer-events:none;
    transition:all 0.1s cubic-bezier(0.215, 0.610, 0.055, 1);
}
.dropdown-cont:hover .icon::after{
    width:100%;
}

.dd-list{
    display:flex;
    flex-direction:column;
    position:absolute;
    min-width:200px;
    background-color:var(--clr-neutral-200);
    color:var(--clr-neutral-900);
    font-size:var(--fs-300);
    border:solid 2px var(--clr-neutral-300);
    border-radius:3px;
    top:100%;
    right:-20px;

    transition:all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    max-height:0px;
    overflow:hidden;
    border-width:0px;
    right:-20px;
    /* opacity:0.1; */

    box-shadow:0px 3px 0px rgba(0,0,0,0.05);
}
.dropdown-cont:hover .dd-list{
    max-height:300px;
    border-width:2px;
    right:-20px;
    /* opacity:1; */
}
.dd-item{
    height:40px;
    position:relative;
    display:flex;
    align-items:center;
    gap:var(--size-100);
    flex-shrink:0;
    user-select:none;
    -webkit-user-select:none;
}
.dd-item:hover{
    background-color:var(--clr-neutral-300);
}
.dd-icon{
    font-family:"Material Icons Outlined";
    aspect-ratio:1;
    height:100%;
    inset:var(--size-100);
    font-size:var(--fs-650);
    display:flex;
    justify-content:center;
    align-items:center;
}

</style>