document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("registration-form").addEventListener("submit", registerUser);
    document.getElementById("sign-in-form").addEventListener("submit", signinUser);
    document.getElementById("change-form-trigger-signin").addEventListener("click", () => changeForm("signin_container", "registration_container", "change-form-trigger-register", "right-form-appear-animation", "right-form-disappear-animation", "left-form-appear-animation"));
    document.getElementById("change-form-trigger-register").addEventListener("click", () => changeForm("registration_container", "signin_container", "change-form-trigger-signin", "left-form-appear-animation", "left-form-disappear-animation", "right-form-appear-animation"));
    document.getElementById("signin-password-visibility").addEventListener("click", () => togglePasswordVisibility("signin-password-visibility", "sign-in-password"));
    document.getElementById("register-password-visibility").addEventListener("click", () => togglePasswordVisibility("register-password-visibility", "register-password"));
}, { once: true });
async function registerUser(event) {
    event.preventDefault();
    const usernameInput = document.getElementById("register-username");
    const passwordInput = document.getElementById("register-password");
    const message = document.getElementById("registration-message");
    try {
        validateInput(usernameInput.value, passwordInput.value);
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
        displayMessage("registration_container", "success-message", data.query_success);
    }
    catch (error) {
        displayMessage("registration_container", "error-message", error.message);
    }
}
async function signinUser(event) {
    event.preventDefault();
}
function validateInput(username, password) {
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
function displayMessage(current_container_id, message_class, contents) {
    const container = document.getElementById(current_container_id);
    const message = document.createElement("p");
    message.classList.add(message_class);
    message.classList.add("message-appear");
    message.textContent = contents;
    container.appendChild(message);
    setTimeout(() => {
        message.classList.remove("message-appear");
        message.classList.add("message-disappear");
        message.addEventListener("animationend", () => container.removeChild(message), { once: true });
    }, 3000);
}
function changeForm(currentFormId, nextFormId, nextFormTriggerId, currentFormAppearClass, currentFormDisappearClass, nextFormAppearClass) {
    const currentForm = document.getElementById(currentFormId);
    const nextForm = document.getElementById(nextFormId);
    const nextFormTrigger = document.getElementById(nextFormTriggerId);
    currentForm.classList.remove(currentFormAppearClass);
    currentForm.classList.add(currentFormDisappearClass);
    nextForm.classList.add(nextFormAppearClass);
    nextForm.style.display = "block";
    nextFormTrigger.classList.add("click-disabled");
    currentForm.addEventListener("animationend", () => {
        currentForm.classList.remove(currentFormDisappearClass);
        currentForm.style.display = "none";
        nextFormTrigger.classList.remove("click-disabled");
    }, { once: true });
}
function togglePasswordVisibility(trigger_id, triggered_input_id) {
    const trigger = document.getElementById(trigger_id);
    const triggeredInput = document.getElementById(triggered_input_id);
    trigger.textContent = trigger.textContent === "visibility_off" ? "visibility" : "visibility_off";
    triggeredInput.type = triggeredInput.type === "text" ? "password" : "text";
}
export {};
//# sourceMappingURL=account_access.js.map