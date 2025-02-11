<script setup lang="ts">
import Modal from '@/components/Modal.vue';
import { endLoading, getUser, serverURL, startLoading, User, UserResponse, wait } from '@/util';
import { onMounted, ref, useTemplateRef } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();

let r_userName = ref("");
let r_firstName = ref("");
let r_lastName = ref("");
let r_email = ref("");
let r_showInfo = ref(false);

async function getUserInfo(){
    let token = localStorage.getItem("token");
    if(!token) return;
    
    startLoading();
    
    let res = await fetch(serverURL+"user",{
        method:"GET",
        headers:{
            "Authorization":`Bearer ${token}`
        }
    });

    // await wait(500);

    // let res = {
    //     status:200,
    //     json:async ()=>{
    //         return {
    //             userName:"claebcode",
    //             firstName:"Caleb",
    //             lastName:"Early",
    //             email:"bobemail@gmail.com"
    //         } as User;
    //     }
    // };

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

async function editProfile(){
    let data = await getUser();
    if(!data) return; // failed to get user data

    m_email.value = data.email;
    m_firstName.value = data.firstName;
    m_lastName.value = data.lastName;
    m_userName.value = data.userName;
    m_password.value = "";
    
    editModal.value.open();
    // firstModelInp.value.focus();
}

let editModal = useTemplateRef("edit-modal");
let m_email = ref("");
let m_firstName = ref("");
let m_lastName = ref("");
let m_userName = ref("");
let m_password = ref("");

let firstModelInp = useTemplateRef("firstModalInp");

function resetEditModalVars(){
    m_email.value = "";
}
function cancelEdit(){
    resetEditModalVars();
    editModal.value.close();
}
async function saveEdit(){
    // alert("saved");

    let token = localStorage.getItem("token");
    if(!token){
        alert("Failed to save, not logged in");
        return;
    }

    let data = {
        email:m_email.value||undefined,
        firstName:m_firstName.value||undefined,
        lastName:m_lastName.value||undefined,
        userName:m_userName.value||undefined,
        password:m_password.value||undefined,
    };
    console.log("data to edit",data);

    let res = await fetch(serverURL+"user",{
        method:"PATCH",
        headers:{
            "Authorization":`Bearer ${token}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    });

    if(res.status == 200){
        console.log("edit profile success");
    }
    else{
        alert("There was an error saving account changes, error code: "+res.status);
        return;
    }

    resetEditModalVars();
    editModal.value.close();

    await getUserInfo();
}

onMounted(()=>{
    getUserInfo();
});

</script>

<template>
    <section class="container">
        <header class="sub-header">
            <div>Profile</div>
            <div class="right-icon-cont">
                <button class="b-edit-profile icon" @click="editProfile">edit</button>
            </div>
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

    <Modal ref="edit-modal" @keydown.enter="saveEdit">
        <template #header>
            <h1 class="primary-heading">Edit Profile</h1>
        </template>
        <template #main>
            <form action="" class="form">
                <div class="form-item">
                    <label for="first_name">First Name</label>
                    <input v-model="m_firstName" ref="firstModalInp" type="text" name="first_name" id="first_name">
                </div>
                <div class="form-item">
                    <label for="last_name">Last Name</label>
                    <input v-model="m_lastName" type="text" name="last_name" id="last_name">
                </div>
                <div class="form-item">
                    <label for="email">Email</label>
                    <input v-model="m_email" type="email" name="email" id="email">
                </div>
                <div class="form-item">
                    <label for="username">Username</label>
                    <input v-model="m_userName" type="text" name="username" id="username">
                </div>
                <div class="form-item">
                    <label for="password">Password</label>
                    <input v-model="m_password" type="password" name="password" id="password">
                </div>
            </form>
        </template>
        <template #footer>
            <button @click.stop="cancelEdit" class="btn icon-btn">
                <div class="icon">cancel</div>
                <div>Cancel</div>
            </button>
            <button @click.stop="saveEdit" class="btn b-save accent2 icon-btn">
                <div class="icon">save</div>
                <div>Save</div>
            </button>
        </template>
    </Modal>
</template>

<style scoped>


</style>