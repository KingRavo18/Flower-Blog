import { toggle_element_visibility } from "./toggleElement_module.js";

document.addEventListener("DOMContentLoaded", () => {
    displayProfilePageTitle();
    toggleDeleteAccountPopup();
}, {once: true});

async function displayProfilePageTitle(): Promise<void>{
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

async function updateUsername(): Promise<void>{
    try{

    }
    catch(error){
        
    }
}

async function updatePassword(): Promise<void>{
    try{

    }
    catch(error){
        
    }
}

function toggleUpdateUsernamePopup(): void{

}
function toggleUpdatePasswordPopup(): void{
    
}
function toggleDeleteAccountPopup(): void{
    const {show_element, hide_element} = toggle_element_visibility(
        "profile-popup-background-container", 
        "show-element-block", 
        "hide-popup-background-anim",
        "delete-account-popup",
        "show-element-flex", 
        "hide-popup-anim"
    );
    (document.getElementById("account-deletion-popup-btn") as HTMLElement).addEventListener("click", () => show_element());
    (document.getElementById("close-account-deletion-popup-btn") as HTMLElement).addEventListener("click", () => hide_element());
}