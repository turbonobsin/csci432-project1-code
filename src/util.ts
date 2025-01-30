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
        inp.addEventListener("input",e=>{
            updateErrorMsg("");
        });
    }
}