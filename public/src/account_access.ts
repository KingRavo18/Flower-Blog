async function registerUser(event: SubmitEvent): Promise<void>{
    event.preventDefault();
    const usernameInput = document.getElementById("register-username") as HTMLInputElement;
    const passwordInput = document.getElementById("register-password") as HTMLInputElement;
    const message = document.getElementById("registration-message") as HTMLElement;
    const username = usernameInput.value;
    const password = passwordInput.value;

    try{
        validateInput(username, password);
        const response = await fetch("../../backend/Account_Access/register_user.php", {
            method: "POST",
            //finish this later
        });
        if(!response.ok){
            throw new Error("Could not register. Plese try again later.");
        }
    }
    catch(error){
        message.classList.add("error-message");
        message.textContent = (error as Error).message;
    }

    function validateInput(username: string, password: string): void{

    }
}
(document.getElementById("registration-form") as HTMLFormElement).addEventListener("submit", registerUser, {once: true});

function signinUser(): void{

}

function changeForm(
    currentFormId: string, 
    nextFormId: string, 
    nextFormTriggerId: string,
    currentFormAppearClass: string, 
    currentFormDisappearClass: string, 
    nextFormAppearClass: string
): void{
    const currentForm = document.getElementById(currentFormId) as HTMLElement;
    const nextForm = document.getElementById(nextFormId) as HTMLElement;
    const nextFormTrigger = document.getElementById(nextFormTriggerId) as HTMLElement;

    currentForm.classList.remove(currentFormAppearClass);
    currentForm.classList.add(currentFormDisappearClass);
    nextForm.classList.add(nextFormAppearClass);
    nextForm.style.display = "block";
    nextFormTrigger.classList.add("click-disabled"); 
    currentForm.addEventListener("animationend", () => {
        currentForm.classList.remove(currentFormDisappearClass);
        currentForm.style.display = "none";
        nextFormTrigger.classList.remove("click-disabled");
    }, {once: true});
    
}
(document.getElementById("change-form-trigger-signin") as HTMLElement).onclick = () => changeForm(
    "signin_container", 
    "registration_container", 
    "change-form-trigger-register",
    "right-form-appear-animation", 
    "right-form-disappear-animation", 
    "left-form-appear-animation"
);
(document.getElementById("change-form-trigger-register") as HTMLElement).onclick = () => changeForm(
    "registration_container", 
    "signin_container", 
    "change-form-trigger-signin",
    "left-form-appear-animation", 
    "left-form-disappear-animation", 
    "right-form-appear-animation"    
);
//replace the onclick

function togglePasswordVisibility(
    trigger_id: string, 
    triggered_input_id: string
): void{
    const trigger = document.getElementById(trigger_id) as HTMLElement;
    const triggeredInput = document.getElementById(triggered_input_id) as HTMLInputElement;
    trigger.textContent = trigger.textContent === "visibility_off" ? "visibility" : "visibility_off";
    triggeredInput.type = triggeredInput.type === "text" ? "password" : "text";
}
(document.getElementById("signin-password-visibility") as HTMLElement).addEventListener("click", () => togglePasswordVisibility(
    "signin-password-visibility", 
    "sign-in-password"
), {once: true});
(document.getElementById("register-password-visibility") as HTMLElement).addEventListener("click", () => togglePasswordVisibility(
    "register-password-visibility", 
    "register-password"
), {once: true}); 