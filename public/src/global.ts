import { toggle_element_visibility } from "./toggleElement_module.js";

document.addEventListener("DOMContentLoaded", () => {
    check_session();
    const page_navigation = new PageNavigation;
    page_navigation.init();
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

class PageNavigation{
    async init(): Promise<void>{
        await this.#load_navbar();
    }

    async #load_navbar(): Promise<void>{
        try{
            const response = await fetch("./assets/components/nav-bar.html");
            if(!response.ok){
                throw new Error("Could not find the navigation bar.");
            }
            const data = await response.text();
            const navigation_section = document.createElement("section");
            navigation_section.innerHTML = data;
            document.body.appendChild(navigation_section);
            this.#toggle_sidebar_visibility();
            this.#toggle_logout_popup_visibility();
        }
        catch(error){
            console.error((error as Error).message);
        }
    }

    #toggle_sidebar_visibility(): void{
        const {show_element, hide_element} = toggle_element_visibility("toggleable-sidebar", "show-element-flex", "sidebar-disappear", "none", "none", "none");
        (document.getElementById("show-sidebar-btn") as HTMLElement).addEventListener("click", () => show_element());
        (document.getElementById("hide-sidebar-btn") as HTMLElement).addEventListener("click", () => hide_element());
    }

    #toggle_logout_popup_visibility(): void{
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
}
