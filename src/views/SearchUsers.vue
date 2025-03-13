<script setup lang="ts">
import Error from '@/components/Error.vue';
import Message from '@/components/Message.vue';
import { useUserStore } from '@/stores/user';
import { endLoading, getUser, serverURL, startLoading, User, UserResponse, wait } from '@/util';
import { onMounted, ref, useTemplateRef } from "vue";
import { useRouter } from 'vue-router';

const userStore = useUserStore();

const error = useTemplateRef("error");

let r_users = ref<User[]>([]);
let r_query = ref("");
let r_hasSearched = ref(false);
let r_page = ref(0);
let r_limit = ref(10);
// let r_searchBy = ref("userName");
let r_sortBy = ref("asc");

let query = useTemplateRef("query");

async function getUsers(e?:Event){
    await wait(1);
    
    r_hasSearched.value = false;
    if(e instanceof KeyboardEvent){
        r_page.value = 0;
    }
    
    let token = userStore.token;
    if(!token){
        error.value.alert("Please login.");
        return;
    }

    startLoading();

    let url = new URL(serverURL+"users");
    // url.searchParams.set("search",`userName:${r_query.value}|firstName:${r_query.value}|lastName:${r_query.value}`);
    // url.searchParams.set("search",`${r_searchBy.value}:${r_query.value}`);
    url.searchParams.set("search",`userName|firstName|lastName:${r_query.value}`);
    url.searchParams.set("sortBy",`userName:${r_sortBy.value}`);
    url.searchParams.set("limit",`${r_limit.value}`);
    url.searchParams.set("skip",`${r_limit.value * r_page.value}`);

    let res = await fetch(url.href,{
        method:"GET",
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

    await wait(200);

    if(res.status == 200){
        let data = await res.json() as User[];
        r_users.value = data;
        r_hasSearched.value = true;
    }
    else{
        error.value.alert("Error getting users with code: "+res.status);
        r_users.value = [];
    }

    endLoading();
}

function goToPage(i:number){
    r_page.value = i;
    
    r_users.value = [];
    r_hasSearched.value = false;

    getUsers();
}
function goToNextPage(){
    if(!canGoNext()) return;
    goToPage(r_page.value+1);
}
function goToPreviousPage(){
    if(!canGoPrevious()) return;
    goToPage(r_page.value-1);
}
function canGoPrevious(){
    if(!r_users.value.length) return false;
    return r_page.value > 0;
}
function canGoNext(){
    if(!r_users.value.length) return false;
    if(r_users.value.length < r_limit.value) return false;
    return true;
}

onMounted(()=>{
    
});

function beforeClick(to:string){
    // router.push({
    //     path:to,
    //     force:true
    // });

    // @ts-ignore
    if("reloadPrivateMessages" in window) window.reloadPrivateMessages();
}

function toggleSortBy(){
    r_sortBy.value = (r_sortBy.value == "asc" ? "desc" : "asc");

    getUsers();
}

</script>

<template>
    <section class="container">
        <header class="sub-header">
            <div>Search Users</div>
        </header>

        <main>
            <div class="loading" style="height:30px"></div>
            <Error ref="error"></Error>
            <br>

            <div class="input-wrapper">
                <!-- <button class="icon">chat</button> -->
                <div class="input-cont accent2 fullw">
                    <input autocomplete="off" v-model="r_query" class="accent2 fullw" type="text" ref="query" name="query" id="i-query" placeholder="Search for a user..." @keydown.enter="getUsers">
                </div>
                <button class="icon" @click="getUsers">send</button>
            </div>

            <br>
            <div class="page-cont">
                <div class="page-cont-head">
                    <div class="l-page">Page {{ r_page+1 }}</div>
                    <button class="icon" :disabled="!canGoPrevious()" @click="goToPreviousPage">chevron_left</button>
                    <button class="icon" :disabled="!canGoNext()" @click="goToNextPage">chevron_right</button>
                    <div style="margin-left:auto" class="page-cont-head">
                        <label for="s-limit" class="l-limit">Per Page</label>
                        <select name="s-limit" id="s-limit" v-model="r_limit" @input="getUsers">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div style="margin-left:var(--size-400)" class="page-cont-head">
                        <label for="s-sortBy" class="l-sort">Sort</label>
                        <button class="icon s-sortBy darker" name="s-sortBy" @click="toggleSortBy">{{ r_sortBy == "asc" ? "keyboard_double_arrow_down" : "keyboard_double_arrow_up" }}</button>
                        <!-- <label for="s-sortBy" class="l-sort">Sort</label>
                        <select name="s-sortBy" id="s-sortBy" ref="sort" class="material-icons-outlined" v-model="r_sortBy" @input="getUsers">
                            <option value="asc" class="material-icons-outlined">Ascending</option>
                            <option value="desc" class="material-icons-outlined">Descending</option>
                        </select> -->
                    </div>
                </div>
                <br>
                <!-- <div class="page-cont-head space-between">
                    <div>
                        <label for="s-query" class="l-query">Search By</label>
                        <select name="s-query" id="s-query" v-model="r_searchBy" @input="getUsers">
                            <option value="userName">Username</option>
                            <option value="firstName">First Name</option>
                            <option value="lastName">Last Name</option>
                        </select>
                    </div>
                    <div>
                        <label for="s-sortBy" class="l-sort">Sort</label>
                        <select name="s-sortBy" id="s-sortBy" ref="sort" v-model="r_sortBy" @input="getUsers">
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                </div> -->
            </div>

            <div class="users-list" v-show="r_hasSearched">
                <RouterLink v-for="user in r_users" class="user-item" :to="`/user/${user._id}?name=${user.userName}`" @click="beforeClick(`/user/${user._id}?name=${user.userName}`)">
                    <Message :sender-name="user.userName" :text="user.firstName+' '+user.lastName" updated-at=""></Message>
                </RouterLink>
                <div v-if="r_users.length == 0" class="no-users">
                    No users found.
                </div>

                <div class="page-cont-head page-cont-bottom" v-if="r_users.length">
                    <div class="l-page">Page {{ r_page+1 }}</div>
                    <button class="icon" :disabled="!canGoPrevious()" @click="goToPreviousPage">chevron_left</button>
                    <button class="icon" :disabled="!canGoNext()" @click="goToNextPage">chevron_right</button>
                </div>
            </div>
        </main>
    </section>
</template>

<style scoped>

.users-list{
    display:flex;
    flex-direction:column;
    margin-block:var(--size-800);
}
/* .user-item{
    padding:var(--size-300);
    border-radius:var(--size-100);
    border:solid 1px var(--clr-neutral-300);
    background-color:var(--clr-neutral-200);
} */
.user-item:hover{
    text-decoration:underline;
    cursor:pointer;
}
.no-users{
    font-size:var(--fs-400);
}
.page-cont-head{
    display:flex;
    align-items:center;
    gap:var(--size-100);
}
.l-page{
    margin-right:var(--size-300);
}
.page-cont label{
    margin-right:var(--size-200);
    font-size:var(--size-300);
}
.page-cont-bottom{
    margin-top:var(--size-600);
}

</style>