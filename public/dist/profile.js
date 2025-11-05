import { toggle_element_visibility } from "./toggleElement_module.js";
import { display_message } from "./displayMessage_module.js";
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
    const username_input = document.getElementById("account-deletion-username-input");
    const password_input = document.getElementById("account-deletion-password-input");
    try {
        validate_input(username_input.value, "Please input your username");
        validate_input(password_input.value, "Please input your password");
        const response = await fetch("", {});
        if (!response.ok) {
            throw new Error("Could not delete account. Plese try again later.");
        }
        const data = await response.json();
        setTimeout(() => window.location.replace("../backend/Session_Maintanance/logout.php"), 1000);
    }
    catch (error) {
        display_message("profile-popup-background", "error-message", error.message, "center-message");
    }
}
function validate_input(input_value, response_message) {
    if (input_value.trim() === "") {
        throw new Error(response_message);
    }
}
//# sourceMappingURL=profile.js.map