import { toggleElement } from "./toggleElement_module.js";
document.addEventListener("DOMContentLoaded", () => {
    displayProfilePageTitle();
}, { once: true });
async function displayProfilePageTitle() {
    const profile_title = document.getElementById("profile-title");
    try {
        const response = await fetch("../backend/Data_Display/display_username.php");
        if (!response.ok) {
            throw new Error("Failed to retrieve username");
        }
    }
    catch (error) {
        window.location.replace("../backend/Session_Maintanance/logout.php");
    }
}
async function updateUsername() {
    try {
    }
    catch (error) {
    }
}
async function updatePassword() {
    try {
    }
    catch (error) {
    }
}
//# sourceMappingURL=profile.js.map