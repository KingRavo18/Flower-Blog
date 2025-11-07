import { display_message } from "./displayMessage_module.js";
document.addEventListener("DOMContentLoaded", () => {
    sign_in();
    register();
    switch_form();
    toggle_password_visibility();
}, { once: true });
function sign_in() {
    const user_sign_in = new User_Sign_In;
    document.getElementById("sign-in-form").addEventListener("submit", (event) => user_sign_in.init(event));
}
function register() {
    const user_registration = new User_Registration;
    document.getElementById("registration-form").addEventListener("submit", (event) => user_registration.init(event));
}
function switch_form() {
    const switch_to_signin = new Current_Form_Switch("registration_container", "signin_container", "change-form-trigger-signin", "left-form-appear-animation", "left-form-disappear-animation", "right-form-appear-animation");
    document.getElementById("change-form-trigger-register").addEventListener("click", () => switch_to_signin.init());
    const switch_to_registration = new Current_Form_Switch("signin_container", "registration_container", "change-form-trigger-register", "right-form-appear-animation", "right-form-disappear-animation", "left-form-appear-animation");
    document.getElementById("change-form-trigger-signin").addEventListener("click", () => switch_to_registration.init());
}
function toggle_password_visibility() {
    const sign_in_password_visibility = new Password_Visibility_Toggle("signin-password-visibility", "sign-in-password");
    const registration_password_visibility = new Password_Visibility_Toggle("register-password-visibility", "register-password");
    document.getElementById("signin-password-visibility").addEventListener("click", () => sign_in_password_visibility.init());
    document.getElementById("register-password-visibility").addEventListener("click", () => registration_password_visibility.init());
}
class Input_Validation {
    validate_input(username, password) {
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
}
class User_Sign_In extends Input_Validation {
    async init(event) {
        await this.#sign_in_user(event);
    }
    async #sign_in_user(event) {
        event.preventDefault();
        const username_input = document.getElementById("sign-in-username");
        const password_input = document.getElementById("sign-in-password");
        try {
            this.validate_input(username_input.value, password_input.value);
            const response = await fetch("../backend/Account_Access/sign_in_user.php", {
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
}
class User_Registration extends Input_Validation {
    async init(event) {
        await this.register_user(event);
    }
    async register_user(event) {
        event.preventDefault();
        const usernameInput = document.getElementById("register-username");
        const passwordInput = document.getElementById("register-password");
        try {
            this.validate_input(usernameInput.value, passwordInput.value);
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
}
class Current_Form_Switch {
    shown_form_id;
    hidden_form_id;
    hidden_form_change_trigger_id;
    shown_form_appear_anim_class;
    shown_form_disappear_anim_class;
    hidden_form_appear_anim_class;
    constructor(shown_form_id, hidden_form_id, hidden_form_change_trigger_id, shown_form_appear_anim_class, shown_form_disappear_anim_class, hidden_form_appear_anim_class) {
        this.shown_form_id = shown_form_id;
        this.hidden_form_id = hidden_form_id;
        this.hidden_form_change_trigger_id = hidden_form_change_trigger_id;
        this.shown_form_appear_anim_class = shown_form_appear_anim_class;
        this.shown_form_disappear_anim_class = shown_form_disappear_anim_class;
        this.hidden_form_appear_anim_class = hidden_form_appear_anim_class;
    }
    init() {
        this.#change_form();
    }
    #change_form() {
        const shown_form = document.getElementById(this.shown_form_id);
        const hidden_form = document.getElementById(this.hidden_form_id);
        const hidden_form_change_trigger = document.getElementById(this.hidden_form_change_trigger_id);
        shown_form.classList.remove(this.shown_form_appear_anim_class);
        shown_form.classList.add(this.shown_form_disappear_anim_class);
        hidden_form.classList.add(this.hidden_form_appear_anim_class);
        hidden_form.style.display = "block";
        hidden_form_change_trigger.classList.add("click-disabled");
        shown_form.addEventListener("animationend", () => {
            shown_form.classList.remove(this.shown_form_disappear_anim_class);
            shown_form.style.display = "none";
            hidden_form_change_trigger.classList.remove("click-disabled");
        }, { once: true });
    }
}
class Password_Visibility_Toggle {
    trigger_id;
    triggered_input_id;
    constructor(trigger_id, triggered_input_id) {
        this.trigger_id = trigger_id;
        this.triggered_input_id = triggered_input_id;
    }
    init() {
        this.toggle_password();
    }
    toggle_password() {
        const trigger = document.getElementById(this.trigger_id);
        const triggeredInput = document.getElementById(this.triggered_input_id);
        trigger.textContent = trigger.textContent === "visibility_off" ? "visibility" : "visibility_off";
        triggeredInput.type = triggeredInput.type === "text" ? "password" : "text";
    }
}
//# sourceMappingURL=account_access.js.map