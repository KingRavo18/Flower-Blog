import { toggle_element_visibility } from "./toggleElement_module.js";

document.addEventListener("DOMContentLoaded", () => {
    check_session();
    fetch_navbar();
}, {once: true});

async function check_session(): Promise<void>{
    try{
        const response = await fetch("../backend/Session_Maintanance/check_session.php");
        if(!response.ok){
            throw new Error("Could not find the session check.");
        }
        const data = await response.json();
        if(data.session_validation === "Failed"){
            throw new Error("Session validation failed.");
        }
    }
    catch(error){
        window.location.replace("../backend/Session_Maintanance/logout.php");
    }
}

async function fetch_navbar(): Promise<void>{
    try{
        const response = await fetch("./assets/components/nav-bar.html");
        if(!response.ok){
            throw new Error("Could not find the navigation bar.");
        }
        const data = await response.text();
        const navigation_section = document.createElement("section");
        navigation_section.innerHTML = data;
        document.body.appendChild(navigation_section);
        toggle_sidebar_visibility();
        toggle_logout_popup_visibility();
    }
    catch(error){
        console.error((error as Error).message);
    }
}

function toggle_sidebar_visibility(): void{
    const {show_element, hide_element} = toggle_element_visibility("toggleable-sidebar", "show-element-flex", "sidebar-disappear", "none", "none", "none");
    (document.getElementById("show-sidebar-btn") as HTMLElement).addEventListener("click", () => show_element());
    (document.getElementById("hide-sidebar-btn") as HTMLElement).addEventListener("click", () => hide_element());
}

function toggle_logout_popup_visibility(): void{
    const {show_element, hide_element} = toggle_element_visibility(
        "logout-popup-background", 
        "show-element-block", 
        "hide-popup-background-anim",
        "logout-popup",
        "show-element-flex",
        "hide-popup-anim"
    );
    (document.getElementById("show-logout-popup-btn") as HTMLElement).addEventListener("click", () => show_element());
    (document.getElementById("hide-logout-popup-btn") as HTMLElement).addEventListener("click", () => hide_element());
}

