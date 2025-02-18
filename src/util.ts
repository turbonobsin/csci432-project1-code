import { ref } from "vue";

export declare function updateCurNavExt(elm?:HTMLElement):void;
export declare function loadNewMessages():void;

export const serverURL = "https://hap-app-api.azurewebsites.net/";

export type User = {
    email:string;
    firstName:string;
    lastName:string;
    userName:string;
};
export type UserResponse = {
    token:string;
    user:User;
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
    let token = localStorage.getItem("token");
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
export function setTheme(themestyle:string){
    let root = document.body.parentElement;
    root.className = "";
    root.classList.add("themestyle-"+themestyle);
    localStorage.setItem("themestyle",themestyle);
    r_themestyle.value = themestyle;
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