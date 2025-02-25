<script setup lang="ts">
import { serverURL, User, UserResponse } from '@/util';
import { onMounted, Ref, ref } from "vue";

let r_navTop = ref(10);
let r_hideMarker = ref(true);
function updateCurNav(elm?:HTMLElement){
    if(!elm){
        checkPath();
        return;
    }

    r_navTop.value = elm.offsetTop+elm.offsetHeight/2;
    let selected = document.querySelectorAll("[selected]");
    for(const item of selected){
        item.removeAttribute("selected");
    }
    elm.setAttribute("selected","true");

    r_hideMarker.value = false;
}

// @ts-ignore
window.updateCurNavExt = updateCurNav;

function checkPath(){
    let path = location.href;
    let links = document.querySelectorAll<HTMLAnchorElement>(".link");
    for(const link of links){
        link.addEventListener("click",e=>{
            updateCurNav(link);
        });
        if(path.startsWith(link.href)){
            updateCurNav(link);
        }
    }
}

onMounted(()=>{
    checkPath();
});

</script>

<template>
    <section class="container">
        <header class="sub-header">
            <div>Navigation</div>
        </header>

        <main>
            <div class="quick-nav-list gap2 flex vertical">
                <div :class="['marker',r_hideMarker?'hide':'']" :style="{ top:r_navTop+'px' }"></div>
                <RouterLink class="link" to="/main">
                    <div class="flex align-center gap4">
                        <div class="icon">home</div>
                        <div>Home</div>
                    </div>
                </RouterLink>
                <RouterLink class="link" to="/user">
                    <div class="flex align-center gap4">
                        <div class="icon">search</div>
                        <div>Search</div>
                    </div>
                </RouterLink>
                <RouterLink class="link" to="/profile">
                    <div class="flex align-center gap4">
                        <div class="icon">group</div>
                        <div>Profile</div>
                    </div>
                </RouterLink>
            </div>
        </main>
    </section>
</template>

<style scoped>

.quick-nav-list{
    margin-left:var(--size-400);
    position:relative;
}
.link{
    text-decoration:none;
    color:var(--clr-neutral-900);
    user-select:none;
    -webkit-user-select:none;
    padding:0px var(--size-200);

    transition:background-color 0.1s ease-out;
}
.link[selected]{
    background-color:var(--clr-neutral-200);
    border-radius:var(--size-100);
}
.quick-nav-list .marker{
    position:absolute;
    left:calc(-1 * var(--size-400));
    width:var(--size-100);
    height:20px;
    background-color:royalblue;
    border-radius:10px;
    translate:0px -50%;

    transition:top 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

</style>