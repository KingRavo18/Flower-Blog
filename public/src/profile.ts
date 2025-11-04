import { toggle_element_visibility } from "./toggleElement_module.js";

document.addEventListener("DOMContentLoaded", () => {
    display_profile_page_title();
    toggle_user_profile_popup("update-username-popup", "show-username-change-popup-btn", "hide-username-change-popup-btn");
    toggle_user_profile_popup("update-password-popup", "show-password-change-popup-btn", "hide-password-change-popup-btn");
    toggle_user_profile_popup("account-deletion-popup", "show-account-deletion-popup-btn", "hide-account-deletion-popup-btn");
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

async function update_username(): Promise<void>{
    try{

    }
    catch(error){
        
    }
}

async function update_password(): Promise<void>{
    try{

    }
    catch(error){
        
    }
}

