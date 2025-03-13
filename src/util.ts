import { ref } from "vue";
import { useUserStore } from "./stores/user.js";

export declare function updateCurNavExt(elm?:HTMLElement):void;
export declare function loadNewMessages():void;

export const serverURL = "https://hap-app-api.azurewebsites.net/";

export type User = {
    _id:string;
    email:string;
    firstName:string;
    lastName:string;
    userName:string;
};
export type UserResponse = {
    token:string;
    user:User;
};
export type MessageItem = {
    text:string;
    updatedAt:string;
    messageId:string;
    senderId:string;
    senderName:string;
    receiverId:string;
    receiverName:string;
};

export function validateEmail(email:string){
    return email.match(/.+@.+\..+/);
}

export function validatePassword(password:string){
    return password.length >= 8;
}

export function updateErrorMsg(msg:string,highlights?:string[]){
    const error = document.querySelector(".error");
    if(error) error.textContent = msg;

    // clear
    let items = document.querySelectorAll(".error-highlight");
    for(const elm of items){
        elm.classList.remove("error-highlight");
    }
    
    if(highlights){
        for(const selector of highlights){
            let elm = document.querySelector(selector);
            if(elm) elm.classList.add("error-highlight");
        }
    }
}
export function initInputsForErrorHandling(){
    let inputs = document.querySelectorAll("input");
    for(const inp of inputs){
        if(inp.dataset["initinps"]) return;
        inp.dataset["initinps"] = "true";
        inp.addEventListener("input",e=>{
            updateErrorMsg("");
        });
    }
}

class LoadingRegItem{
    constructor(elm:HTMLElement){
        this.elm = elm;
        this.i = 0;
        elm.innerHTML = "&nbsp;";
        this.i_id = setInterval(()=>{
            // if(this.i == 0) elm.innerHTML = "&nbsp;";
            // else elm.textContent = ".".repeat(this.i);
            elm.textContent = ["/","-","\\","|"][this.i];
            this.i++;
            this.i %= 4;
        },120);
    }
    elm:HTMLElement;
    i:number;
    i_id:NodeJS.Timeout;
}
const loadingReg = new Map<HTMLElement,LoadingRegItem>();
export function startLoading(elm?:HTMLElement,cancelIfNoElm=false){
    if(!elm && cancelIfNoElm) return;
    if(!elm) elm = document.querySelector(".loading");
    if(!elm) return;
    let existing = loadingReg.get(elm);
    if(existing) endLoading(elm);
    loadingReg.set(elm,new LoadingRegItem(elm));
}
export function endLoading(elm?:HTMLElement,cancelIfNoElm=false){
    if(!elm && cancelIfNoElm) return;
    if(!elm) elm = document.querySelector(".loading");
    if(!elm) return;
    let item = loadingReg.get(elm);
    if(!item) return;
    item.elm.textContent = "";
    clearInterval(item.i_id);
    loadingReg.delete(elm);
}

export function wait(delay:number){
    return new Promise<void>(resolve=>{
        setTimeout(()=>{
            resolve();
        },delay);
    });
}

export function goToPath(path:string){
    let a = document.createElement("a");
    a.href = path;
    a.click();
}

export async function getUser(loadingElm?:HTMLElement){
    let token = useUserStore().token;
    if(!token) return;
    
    startLoading(loadingElm,true);
    
    let res = await fetch(serverURL+"user",{
        method:"GET",
        headers:{
            "Authorization":`Bearer ${token}`
        }
    });

    if(res.status == 200){
        let user = await res.json() as User;
        return user; 
    }
    else{
        alert(`Error ${res.status} when trying to get user information, try logging back in.`);
    }

    endLoading(loadingElm,true);
}

export const r_themestyle = ref(localStorage.getItem("themestyle"));
export function setTheme(themestyle:string,body?:HTMLElement){
    // let root = (body ?? document.body).parentElement;
    let root = (body ?? document.body);
    // let changing = root.classList.contains("changing-theme");
    // root.className = changing ? "changing-theme" : "";
    for(const name of [...root.classList]){
        if(name.startsWith("themestyle")) root.classList.remove(name);
    }
    root.classList.add("themestyle-"+themestyle);
    if(!body){
        localStorage.setItem("themestyle",themestyle);
        r_themestyle.value = themestyle;
    }
}
export function loadTheme(){
    console.log("loading theme");
    setTheme(localStorage.getItem("themestyle") ?? "light");
}
loadTheme();

// async function genBG(){
//     let can = document.createElement("canvas");
//     can.width = 128;
//     can.height = 128;
//     let ctx = can.getContext("2d");

//     ctx.fillStyle = "rgba(0,0,0,0.02)";
//     // ctx.fillRect(0,0,20,20);
//     ctx.beginPath();

//     let w = can.width*0.4;
//     ctx.translate(can.width/2,can.height/2);
//     ctx.rect(-w/2,-w/2,w,w);
//     ctx.fill();
    
//     let blob = await new Promise<Blob>(resolve=>{
//         can.toBlob(blob=>{
//             resolve(blob);
//         },"image/png");
//     });
//     if(!blob){
//         console.warn("Failed to create canvas background");
//         return;
//     }
//     let url = URL.createObjectURL(blob);
//     document.body.style.background = `url(${url})`;
// }
// document.addEventListener("DOMContentLoaded",e=>{
//     genBG();
// });

export async function switchTheme(){
    let curTheme = localStorage.getItem("themestyle");
    let newTheme = (curTheme == "dark" ? "light" : "dark");
    console.log(curTheme,newTheme);
    
    let body = document.querySelector("body:not(.body-copy)") as HTMLElement;
    
    let copy = body.cloneNode(true) as HTMLElement;
    copy.classList.add("body-copy");
    body.parentElement.insertBefore(copy,body);
    // body.insertAdjacentElement("afterend",copy);

    // setTheme(curTheme,copy);
    setTheme(newTheme,copy);
    copy.classList.add("changing-theme");
    body.classList.add("changing-theme-outer");

    // await wait(3000);
    
    // body.parentElement.classList.add("changing-theme");
    // body.classList.add("changing-theme");

    // setTheme(newTheme,body);
    
    localStorage.setItem("themestyle",newTheme);
    r_themestyle.value = newTheme;
    
    await wait(750);
    setTheme(newTheme,body);

    body.parentElement.classList.remove("changing-theme");
    body.classList.remove("changing-theme");
    copy.remove();

    await wait(500);
    body.classList.remove("changing-theme-outer");
}

// not needed for now but good to keep around
// userStore.$subscribe((mutation,state)=>{

// });