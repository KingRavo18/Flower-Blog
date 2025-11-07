import { toggle_element_visibility } from "./toggleElement_module.js";
document.addEventListener("DOMContentLoaded", () => {
    const session_check = new Session_Check;
    session_check.init();
    const page_navigation = new Page_Navigation;
    page_navigation.init();
}, { once: true });
class Session_Check {
    async init() {
        await this.#check_session();
    }
    async #check_session() {
        try {
            const response = await fetch("../backend/Session_Maintanance/check_session.php");
            if (!response.ok) {
                throw new Error("Could not find the session check.");
            }
            const data = await response.json();
            if (data.session_validation === "Failed") {
                throw new Error("Session validation failed.");
            }
        }
        catch (error) {
            window.location.replace("../backend/Session_Maintanance/logout.php");
        }
    }
}
class Page_Navigation {
    async init() {
        await this.#load_navbar();
    }
    async #load_navbar() {
        try {
            const response = await fetch("./assets/components/nav-bar.html");
            if (!response.ok) {
                throw new Error("Could not find the navigation bar.");
            }
            const data = await response.text();
            const navigation_section = document.createElement("section");
            navigation_section.innerHTML = data;
            document.body.appendChild(navigation_section);
            this.#toggle_sidebar_visibility();
            this.#toggle_logout_popup_visibility();
        }
        catch (error) {
            console.error(error.message);
        }
    }
    #toggle_sidebar_visibility() {
        const { show_element, hide_element } = toggle_element_visibility("toggleable-sidebar", "show-element-flex", "sidebar-disappear", "none", "none", "none");
        document.getElementById("show-sidebar-btn").addEventListener("click", () => show_element());
        document.getElementById("hide-sidebar-btn").addEventListener("click", () => hide_element());
    }
    #toggle_logout_popup_visibility() {
        const { show_element, hide_element } = toggle_element_visibility("logout-popup-background", "show-element-block", "hide-popup-background-anim", "logout-popup", "show-element-flex", "hide-popup-anim");
        document.getElementById("show-logout-popup-btn").addEventListener("click", () => show_element());
        document.getElementById("hide-logout-popup-btn").addEventListener("click", () => hide_element());
    }
}
//# sourceMappingURL=global.js.map