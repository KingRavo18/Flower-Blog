import { toggle_element_visibility } from "./toggleElement_module.js";
document.addEventListener("DOMContentLoaded", () => {
    displayProfilePageTitle();
    toggleDeleteAccountPopup();
}, { once: true });
async function displayProfilePageTitle() {
    const profile_title = document.getElementById("profile-title");
    try {
        const response = await fetch("../backend/Data_Display/display_username.php");
        if (!response.ok) {
            throw new Error("Failed to retrieve username");
        }
        const data = await response.json();
        profile_title.textContent = `${data.username}'s Profile`;
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
function toggleUpdateUsernamePopup() {
}
function toggleUpdatePasswordPopup() {
}
function toggleDeleteAccountPopup() {
    const { show_element, hide_element } = toggle_element_visibility("profile-popup-background-container", "show-element-block", "hide-popup-background-anim", "delete-account-popup", "show-element-flex", "hide-popup-anim");
    document.getElementById("account-deletion-popup-btn").addEventListener("click", () => show_element());
    document.getElementById("close-account-deletion-popup-btn").addEventListener("click", () => hide_element());
}
//# sourceMappingURL=profile.js.map