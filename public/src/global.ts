import { toggleElement } from "./toggleElement_module.js";

document.addEventListener("DOMContentLoaded", () => {
    checkSession();
    fetchNavbar();
}, {once: true});

async function checkSession(): Promise<void>{
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

async function fetchNavbar(): Promise<void>{
    try{
        const response = await fetch("./assets/components/nav-bar.html");
        if(!response.ok){
            throw new Error("Could not find the navigation bar.");
        }
        const data = await response.text();
        const navigation_section = document.createElement("section");
        navigation_section.innerHTML = data;
        document.body.appendChild(navigation_section);
        toggleSidebar();
        toggleLogoutPopup();
    }
    catch(error){
        console.error((error as Error).message);
    }
}
function toggleSidebar(): void{
    const {openElement, closeElement} = toggleElement("toggleable-sidebar", "show-element-flex", "none", "sidebar-disappear", "none", "none");
    (document.getElementById("menu-activate-btn") as HTMLElement).addEventListener("click", () => openElement());
    (document.getElementById("menu-deactivate-btn") as HTMLElement).addEventListener("click", () => closeElement());
}
function toggleLogoutPopup(): void{
    const {openElement, closeElement} = toggleElement(
        "logout-window-background", 
        "show-element-block", 
        "show-element-flex", 
        "popup-window-disappear", 
        "toggleable-logout-window",
        "popup-window-background-disappear"
    );
    (document.getElementById("logout-list-btn") as HTMLElement).addEventListener("click", () => openElement());
    (document.getElementById("logout-deny-btn") as HTMLElement).addEventListener("click", () => closeElement());
}

