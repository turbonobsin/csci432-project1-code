import { User } from "@/util.js";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export const useUserStore = defineStore("user",()=>{
    const firstName = ref(localStorage.getItem("user$firstName") ?? "");
    const lastName = ref(localStorage.getItem("user$lastName") ?? "");
    const userName = ref(localStorage.getItem("user$userName") ?? "");
    const email = ref(localStorage.getItem("user$email") ?? "");
    const token = ref(localStorage.getItem("user$token") ?? "");

    let refs = {firstName,lastName,userName,email,token};
    Object.keys(refs).forEach(key=>{
        watch(refs[key],(v)=>{
            localStorage[!v ? "removeItem" : "setItem"]("user$"+key,v);
        });
    });

    const wholeName = computed(()=>firstName.value + lastName.value);

    function setUser(user:User,tokenStr:string){
        firstName.value = user.firstName ?? "";
        lastName.value = user.lastName ?? "";
        userName.value = user.userName ?? "";
        email.value = user.email ?? "";
        token.value = tokenStr ?? "";
    }

    function $reset(){
        firstName.value = "";
        lastName.value = "";
        userName.value = "";
        email.value = "";
        token.value = "";
    }

    return {
        firstName,
        lastName,
        userName,
        email,
        token,
        wholeName,
        setUser,
        $reset
    };
});