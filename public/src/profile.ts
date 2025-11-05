import { toggle_element_visibility } from "./toggleElement_module.js";
import { display_message } from "./displayMessage_module.js";

document.addEventListener("DOMContentLoaded", () => {
    display_profile_page_title();
    toggle_user_profile_popup("username-change-popup", "show-username-change-popup-btn", "hide-username-change-popup-btn");
    toggle_user_profile_popup("password-change-popup", "show-password-change-popup-btn", "hide-password-change-popup-btn");
    toggle_user_profile_popup("account-deletion-popup", "show-account-deletion-popup-btn", "hide-account-deletion-popup-btn");

    (document.getElementById("username-change-form") as HTMLFormElement).addEventListener("submit", change_username);
    (document.getElementById("password-change-form") as HTMLFormElement).addEventListener("submit", change_password);
    (document.getElementById("acccount-deletion-form") as HTMLFormElement).addEventListener("submit", delete_account);
}, {once: true});

async function display_profile_page_title(): Promise<void>{
    const profile_title = document.getElementById("profile-title") as HTMLElement;
    try{
        const response = await fetch("../backend/Data_Display/display_username.php");
        if(!response.ok){
            throw new Error("Failed to retrieve username");
        }
        const data = await response.json();
        profile_title.textContent = `${data.username}'s Profile`;
    }
    catch(error){
        window.location.replace("../backend/Session_Maintanance/logout.php");
    }
}

function toggle_user_profile_popup(popup_id: string, show_popup_button_id: string, hide_popup_button_id: string): void{
    const {show_element, hide_element} = toggle_element_visibility(
        "profile-popup-background", 
        "show-element-block", 
        "hide-popup-background-anim",
        popup_id,
        "show-element-flex", 
        "hide-popup-anim"
    );
    (document.getElementById(show_popup_button_id) as HTMLElement).addEventListener("click", () => show_element());
    (document.getElementById(hide_popup_button_id) as HTMLElement).addEventListener("click", () => hide_element());
}

async function change_username(event: SubmitEvent): Promise<void>{
    event.preventDefault();
    const password_input = document.getElementById("username-change-password-input") as HTMLInputElement;
    const new_username_input = document.getElementById("username-change-new-username-input") as HTMLInputElement;
    try{
        if(password_input.value.trim() === ""){
            throw new Error("Please input your password");
        }   
        if(new_username_input.value.trim() === ""){
            throw new Error("Please input your new username");
        }   

    }
    catch(error){
        display_message("profile-popup-background", "error-message", (error as Error).message, "center-message");
    }
}

async function change_password(event: SubmitEvent): Promise<void>{
    event.preventDefault();
    const current_password_input = document.getElementById("password-change-current-password-input") as HTMLInputElement;
    const new_password_input = document.getElementById("password-change-new-password-input") as HTMLInputElement;
    try{
        if(current_password_input.value.trim() === ""){
            throw new Error("Please input your current password");
        }   
        validate_new_password(new_password_input.value);
        const response = await fetch("../backend/Update_Profile/change_password.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ current_password: current_password_input.value, new_password: new_password_input.value }),
        });
        if(!response.ok){
            throw new Error("Could not change password. Plese try again later.");
        }
        const data = await response.json();
        if(data.query_fail){
            throw new Error(data.query_fail);
        }
        display_message("profile-popup-background", "success-message", data.query_success, "center-message");
    }
    catch(error){
        display_message("profile-popup-background", "error-message", (error as Error).message, "center-message");
    }
}

function validate_new_password(password: string): void{
    if(password.trim() === ""){
        throw new Error("Please input your password");
    }
    if(password.trim() === ""){
        throw new Error("Please input a password");
    }
    if(password.length < 8){
        throw new Error("A password must be at least 8 symbols long");
    }
    if(!Boolean(password.match(/[a-z]/))){
        throw new Error("A password must contain a non-capital letter");
    }
    if(!Boolean(password.match(/[A-Z]/))){
        throw new Error("A password must contain a capital letter");
    }
    if(!Boolean(password.match(/[0-9]/))){
        throw new Error("A password must contain a number");
    }
    if(!Boolean(password.match(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/))){
        throw new Error("A password must contain a special character");
    } 
}

async function delete_account(event: SubmitEvent): Promise<void>{
    event.preventDefault();
    const username_input = document.getElementById("account-deletion-username-input") as HTMLInputElement;
    const password_input = document.getElementById("account-deletion-password-input") as HTMLInputElement;
    try{
        if(username_input.value.trim() === ""){
            throw new Error("Please input your username");
        }   
        if(password_input.value.trim() === ""){
            throw new Error("Please input your password");
        }
        const response = await fetch("../backend/Account_Termination/delete_account.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ username: username_input.value, password: password_input.value}),
        });
        if(!response.ok){
            throw new Error("Could not delete account. Plese try again later.");
        }
        const data = await response.json();
        if(data.query_fail){
            throw new Error(data.query_fail);
        }
        display_message("profile-popup-background", "success-message", data.query_success, "center-message");
        setTimeout(() => window.location.replace("../backend/Session_Maintanance/logout.php"), 1000);
    }
    catch(error){
        display_message("profile-popup-background", "error-message", (error as Error).message, "center-message");
    }
}

