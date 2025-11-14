import { toggle_element_visibility } from "../Modules/element_toggle.js";
import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";
document.addEventListener("DOMContentLoaded", () => {
    check_session();
    load_page_heading();
}, { once: true });
function check_session() {
    new Session_Check().init();
}
class Session_Check {
    init() {
        this.#check_session();
    }
    async #check_session() {
        try {
            const data = await fetch_data("../backend/Session_Maintanance/check_session.php", {}, "Could not find the session check.");
        }
        catch (error) {
            window.location.replace("../backend/Session_Maintanance/logout.php");
        }
    }
}
function load_page_heading() {
    new Page_Heading().init();
}
class Page_Heading {
    init() {
        this.#load_navbar();
    }
    async #load_navbar() {
        try {
            const response = await fetch("./assets/components/nav-bar.html");
            if (!response.ok) {
                throw new Error("Could not find the header.");
            }
            const data = await response.text();
            const navigation_section = document.createElement("section");
            navigation_section.innerHTML = data;
            document.body.appendChild(navigation_section);
            this.#toggle_sidebar_visibility();
            this.#toggle_logout_popup_visibility();
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
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