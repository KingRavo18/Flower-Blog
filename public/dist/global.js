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
        document.body.innerHTML = data;
        const { openSidebar, closeSidebar } = toggleSidebar();
        document.getElementById("menu-activate-btn").addEventListener("click", () => openSidebar());
        document.getElementById("menu-deactivate-btn").addEventListener("click", () => closeSidebar());
    }
    catch (error) {
        console.error(error.message);
    }
}
function toggleSidebar() {
    const sidebar = document.getElementById("toggleable-sidebar");
    function openSidebar() {
        sidebar.classList.remove("hide-sidebar");
    }
    function closeSidebar() {
        sidebar.classList.add("sidebar-disappear");
        sidebar.addEventListener("animationend", () => {
            sidebar.classList.remove("sidebar-disappear");
            sidebar.classList.add("hide-sidebar");
        }, { once: true });
    }
    return { openSidebar, closeSidebar };
}
export {};
//# sourceMappingURL=global.js.map