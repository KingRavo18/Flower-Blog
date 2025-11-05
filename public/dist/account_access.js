import { display_message } from "./displayMessage_module.js";
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("registration-form").addEventListener("submit", register_user);
    document.getElementById("sign-in-form").addEventListener("submit", sign_in_user);
    document.getElementById("change-form-trigger-signin").addEventListener("click", () => change_form("signin_container", "registration_container", "change-form-trigger-register", "right-form-appear-animation", "right-form-disappear-animation", "left-form-appear-animation"));
    document.getElementById("change-form-trigger-register").addEventListener("click", () => change_form("registration_container", "signin_container", "change-form-trigger-signin", "left-form-appear-animation", "left-form-disappear-animation", "right-form-appear-animation"));
    document.getElementById("signin-password-visibility").addEventListener("click", () => toggle_password_visibility("signin-password-visibility", "sign-in-password"));
    document.getElementById("register-password-visibility").addEventListener("click", () => toggle_password_visibility("register-password-visibility", "register-password"));
}, { once: true });
async function register_user(event) {
    event.preventDefault();
    const usernameInput = document.getElementById("register-username");
    const passwordInput = document.getElementById("register-password");
    try {
        validate_input(usernameInput.value, passwordInput.value);
        const response = await fetch("../backend/Account_Access/register_user.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ username: usernameInput.value, password: passwordInput.value }),
        });
        if (!response.ok) {
            throw new Error("Could not register. Plese try again later.");
        }
        const data = await response.json();
        if (data.query_fail) {
            throw new Error(data.query_fail);
        }
        usernameInput.value = "";
        passwordInput.value = "";
        display_message("registration_container", "success-message", data.query_success, "left-message");
    }
    catch (error) {
        display_message("registration_container", "error-message", error.message, "left-message");
    }
}
async function sign_in_user(event) {
    event.preventDefault();
    const username_input = document.getElementById("sign-in-username");
    const password_input = document.getElementById("sign-in-password");
    try {
        validate_input(username_input.value, password_input.value);
        const response = await fetch("../backend/Account_Access/login_user.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ username: username_input.value, password: password_input.value }),
        });
        if (!response.ok) {
            throw new Error("Failed to sign in. Please try again later.");
        }
        const data = await response.json();
        if (data.query_fail) {
            throw new Error(data.query_fail);
        }
        display_message("signin_container", "success-message", data.query_success, "right-message");
        setTimeout(() => window.location.href = "./main_page.html", 1000);
    }
    catch (error) {
        display_message("signin_container", "error-message", error.message, "right-message");
    }
}
function validate_input(username, password) {
    if (username.trim() === "") {
        throw new Error("Please input a username");
    }
    if (password.trim() === "") {
        throw new Error("Please input a password");
    }
    if (password.length < 8) {
        throw new Error("A password must be at least 8 symbols long");
    }
    if (!Boolean(password.match(/[a-z]/))) {
        throw new Error("A password must contain a non-capital letter");
    }
    if (!Boolean(password.match(/[A-Z]/))) {
        throw new Error("A password must contain a capital letter");
    }
    if (!Boolean(password.match(/[0-9]/))) {
        throw new Error("A password must contain a number");
    }
    if (!Boolean(password.match(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/))) {
        throw new Error("A password must contain a special character");
    }
}
//
// The functions after this point only affect the UI
//
function change_form(shown_form_id, hidden_form_id, hidden_form_change_trigger_id, shown_form_appear_anim_class, shown_form_disappear_anim_class, hidden_form_appear_anim_class) {
    const shown_form = document.getElementById(shown_form_id);
    const hidden_form = document.getElementById(hidden_form_id);
    const hidden_form_change_trigger = document.getElementById(hidden_form_change_trigger_id);
    shown_form.classList.remove(shown_form_appear_anim_class);
    shown_form.classList.add(shown_form_disappear_anim_class);
    hidden_form.classList.add(hidden_form_appear_anim_class);
    hidden_form.style.display = "block";
    hidden_form_change_trigger.classList.add("click-disabled");
    shown_form.addEventListener("animationend", () => {
        shown_form.classList.remove(shown_form_disappear_anim_class);
        shown_form.style.display = "none";
        hidden_form_change_trigger.classList.remove("click-disabled");
    }, { once: true });
}
function toggle_password_visibility(trigger_id, triggered_input_id) {
    const trigger = document.getElementById(trigger_id);
    const triggeredInput = document.getElementById(triggered_input_id);
    trigger.textContent = trigger.textContent === "visibility_off" ? "visibility" : "visibility_off";
    triggeredInput.type = triggeredInput.type === "text" ? "password" : "text";
}
//# sourceMappingURL=account_access.js.map