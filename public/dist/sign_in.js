function changeForm(currentFormId, nextFormId, currentFormAppearClass, currentFormDisappearClass, nextFormAppearClass) {
    const currentForm = document.getElementById(currentFormId);
    const nextForm = document.getElementById(nextFormId);
    currentForm.classList.remove(currentFormAppearClass);
    currentForm.classList.add(currentFormDisappearClass);
    nextForm.classList.add(nextFormAppearClass);
    nextForm.style.display = "block";
    currentForm.addEventListener("animationend", () => {
        currentForm.classList.remove(currentFormDisappearClass);
        currentForm.style.display = "none";
    }, { once: true });
}
document.getElementById("change-form-trigger-signin").onclick = () => changeForm("signin_container", "registration_container", "right-form-appear-animation", "right-form-disappear-animation", "left-form-appear-animation");
document.getElementById("change-form-trigger-register").onclick = () => changeForm("registration_container", "signin_container", "left-form-appear-animation", "left-form-disappear-animation", "right-form-appear-animation");
function togglePasswordVisibility(trigger_id, triggered_input_id) {
    const trigger = document.getElementById(trigger_id);
    const triggeredInput = document.getElementById(triggered_input_id);
    trigger.textContent = trigger.textContent === "visibility_off" ? "visibility" : "visibility_off";
    triggeredInput.type = triggeredInput.type === "text" ? "password" : "text";
}
document.getElementById("signin-password-visibility").onclick = () => togglePasswordVisibility("signin-password-visibility", "sign-in-password");
document.getElementById("register-password-visibility").onclick = () => togglePasswordVisibility("register-password-visibility", "register-password");
export {};
//# sourceMappingURL=sign_in.js.map