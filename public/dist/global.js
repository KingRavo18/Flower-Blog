import { toggleElement } from "./toggleElement_module.js";
document.addEventListener("DOMContentLoaded", () => {
    checkSession();
    fetchNavbar();
}, { once: true });
async function checkSession() {
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
async function fetchNavbar() {
    try {
        const response = await fetch("./assets/components/nav-bar.html");
        if (!response.ok) {
            throw new Error("Could not find the navigation bar.");
        }
        const data = await response.text();
        const navigation_section = document.createElement("section");
        navigation_section.innerHTML = data;
        document.body.appendChild(navigation_section);
        toggleSidebar();
        toggleLogoutPopup();
    }
    catch (error) {
        console.error(error.message);
    }
}
function toggleSidebar() {
    const { openElement, closeElement } = toggleElement("toggleable-sidebar", "show-element-flex", "none", "sidebar-disappear", "none", "none");
    document.getElementById("menu-activate-btn").addEventListener("click", () => openElement());
    document.getElementById("menu-deactivate-btn").addEventListener("click", () => closeElement());
}
function toggleLogoutPopup() {
    const { openElement, closeElement } = toggleElement("logout-window-background", "show-element-block", "show-element-flex", "popup-window-disappear", "toggleable-logout-window", "popup-window-background-disappear");
    document.getElementById("logout-list-btn").addEventListener("click", () => openElement());
    document.getElementById("logout-deny-btn").addEventListener("click", () => closeElement());
}
//# sourceMappingURL=global.js.map