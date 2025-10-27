function changeForm(
    currentFormId: string, 
    nextFormId: string, 
    currentFormAppearClass: string, 
    currentFormDisappearClass: string, 
    nextFormAppearClass: string
): void{
    const currentForm = document.getElementById(currentFormId) as HTMLElement;
    const nextForm = document.getElementById(nextFormId) as HTMLElement;

    currentForm.classList.remove(currentFormAppearClass);
    currentForm.classList.add(currentFormDisappearClass);
    nextForm.classList.add(nextFormAppearClass);
    nextForm.style.display = "block";
    currentForm.addEventListener("animationend", () => {
        currentForm.classList.remove(currentFormDisappearClass);
        currentForm.style.display = "none";
    }, {once: true});
    
}
(document.getElementById("change-form-trigger-signin") as HTMLElement).onclick = () => changeForm(
    "signin_container", 
    "registration_container", 
    "right-form-appear-animation", 
    "right-form-disappear-animation", 
    "left-form-appear-animation"
);
(document.getElementById("change-form-trigger-register") as HTMLElement).onclick = () => changeForm(
    "registration_container", 
    "signin_container", 
    "left-form-appear-animation", 
    "left-form-disappear-animation", 
    "right-form-appear-animation"
);

function togglePasswordVisibility(
    trigger_id: string, 
    triggered_input_id: string
): void{
    const trigger = document.getElementById(trigger_id) as HTMLElement;
    const triggeredInput = document.getElementById(triggered_input_id) as HTMLInputElement;
    trigger.textContent = trigger.textContent === "visibility_off" ? "visibility" : "visibility_off";
    triggeredInput.type = triggeredInput.type === "text" ? "password" : "text";
}
(document.getElementById("signin-password-visibility") as HTMLElement).onclick = () => togglePasswordVisibility(
    "signin-password-visibility", 
    "sign-in-password"
);
(document.getElementById("register-password-visibility") as HTMLElement).onclick = () => togglePasswordVisibility(
    "register-password-visibility", 
    "register-password"
);