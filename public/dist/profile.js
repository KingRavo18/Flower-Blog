import { toggle_element_visibility } from "./toggleElement_module.js";
document.addEventListener("DOMContentLoaded", () => {
    display_profile_page_title();
    toggle_user_profile_popup("username-change-popup", "show-username-change-popup-btn", "hide-username-change-popup-btn");
    toggle_user_profile_popup("password-change-popup", "show-password-change-popup-btn", "hide-password-change-popup-btn");
    toggle_user_profile_popup("account-deletion-popup", "show-account-deletion-popup-btn", "hide-account-deletion-popup-btn");
    document.getElementById("username-change-form").addEventListener("submit", change_username);
    document.getElementById("password-change-form").addEventListener("submit", change_password);
    document.getElementById("acccount-deletion-form").addEventListener("submit", delete_account);
}, { once: true });
async function display_profile_page_title() {
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
function toggle_user_profile_popup(popup_id, show_popup_button_id, hide_popup_button_id) {
    const { show_element, hide_element } = toggle_element_visibility("profile-popup-background", "show-element-block", "hide-popup-background-anim", popup_id, "show-element-flex", "hide-popup-anim");
    document.getElementById(show_popup_button_id).addEventListener("click", () => show_element());
    document.getElementById(hide_popup_button_id).addEventListener("click", () => hide_element());
}
async function change_username(event) {
    event.preventDefault();
    try {
    }
    catch (error) {
    }
}
async function change_password(event) {
    event.preventDefault();
    try {
    }
    catch (error) {
    }
}
async function delete_account(event) {
    event.preventDefault();
    try {
    }
    catch (error) {
    }
}
//# sourceMappingURL=profile.js.map