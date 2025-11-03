import { toggleElement } from "./toggleElement_module.js";

document.addEventListener("DOMContentLoaded", () => {
    displayProfilePageTitle();
}, {once: true});

async function displayProfilePageTitle(): Promise<void>{
    const profile_title = document.getElementById("profile-title") as HTMLElement;
    try{
        const response = await fetch("../backend/Data_Display/display_username.php");
        if(!response.ok){
            throw new Error("Failed to retrieve username");
        }
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
