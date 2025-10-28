async function registerUser(event) {
    event.preventDefault();
    const usernameInput = document.getElementById("register-username");
    const passwordInput = document.getElementById("register-password");
    const message = document.getElementById("registration-message");
    const username = usernameInput.value;
    const password = passwordInput.value;
    try {
        validateInput(username, password);
        const response = await fetch("../../backend/Account_Access/register_user.php", {
            method: "POST",
            //finish this later
        });
        if (!response.ok) {
            throw new Error("Could not register. Plese try again later.");
        }
    }
    catch (error) {
        message.classList.add("error-message");
        message.textContent = error.message;
    }
    function validateInput(username, password) {
    }
}
document.getElementById("registration-form").addEventListener("submit", registerUser, { once: true });
function signinUser() {
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
document.getElementById("change-form-trigger-signin").onclick = () => changeForm("signin_container", "registration_container", "change-form-trigger-register", "right-form-appear-animation", "right-form-disappear-animation", "left-form-appear-animation");
document.getElementById("change-form-trigger-register").onclick = () => changeForm("registration_container", "signin_container", "change-form-trigger-signin", "left-form-appear-animation", "left-form-disappear-animation", "right-form-appear-animation");
//replace the onclick
function togglePasswordVisibility(trigger_id, triggered_input_id) {
    const trigger = document.getElementById(trigger_id);
    const triggeredInput = document.getElementById(triggered_input_id);
    trigger.textContent = trigger.textContent === "visibility_off" ? "visibility" : "visibility_off";
    triggeredInput.type = triggeredInput.type === "text" ? "password" : "text";
}
document.getElementById("signin-password-visibility").addEventListener("click", () => togglePasswordVisibility("signin-password-visibility", "sign-in-password"), { once: true });
document.getElementById("register-password-visibility").addEventListener("click", () => togglePasswordVisibility("register-password-visibility", "register-password"), { once: true });
export {};
//# sourceMappingURL=account_access.js.map