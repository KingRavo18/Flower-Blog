import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";

document.addEventListener("DOMContentLoaded", () => {
    sign_in();
    register();
    switch_form();
    toggle_password_visibility();
}, {once: true});


interface Input_Validation_Types{
    validate_input: (username: string, password: string) => void;
}

class Input_Validation implements Input_Validation_Types{
    validate_input(username: string, password: string): void{
        if(username.trim() === ""){
            throw new Error("Please input a username");
        }
        if(password.trim() === ""){
            throw new Error("Please input a password");
        }
        if(password.length < 8){
            throw new Error("A password must be at least 8 symbols long");
        }
        if(!Boolean(password.match(/[a-z]/))){
            throw new Error("A password must contain a non-capital letter");
        }
        if(!Boolean(password.match(/[A-Z]/))){
            throw new Error("A password must contain a capital letter");
        }
        if(!Boolean(password.match(/[0-9]/))){
            throw new Error("A password must contain a number");
        }
        if(!Boolean(password.match(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/))){
            throw new Error("A password must contain a special character");
        } 
    }
}


function sign_in(): void{
    (document.getElementById("sign-in-form") as HTMLFormElement).addEventListener("submit", (event) => new User_Sign_In().init(event));
}

interface User_Sign_In_Types{
    init: (event: SubmitEvent) => void;
}

class User_Sign_In extends Input_Validation implements User_Sign_In_Types{
    init(event: SubmitEvent): void{
        this.#sign_in_user(event);
    }

    async #sign_in_user(event: SubmitEvent): Promise<void>{
        event.preventDefault();
        const username_input = document.getElementById("sign-in-username") as HTMLInputElement;
        const password_input = document.getElementById("sign-in-password") as HTMLInputElement;
        try{
            this.validate_input(username_input.value, password_input.value);
            const data = await fetch_data(
                "../backend/Account_Access/sign_in_user.php",
                { 
                    method: "POST", 
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
                    body: new URLSearchParams({ username: username_input.value, password: password_input.value })
                },
                "Failed to sign in. Please try again later."
            );
            display_message("signin_container", "success-message", data.query_success, "right-message");
            window.location.href = "./main_page.html";
        }
        catch(error){
            display_message("signin_container", "error-message", (error as Error).message, "right-message"); 
        }
    }
}


function register(): void{
    (document.getElementById("registration-form") as HTMLFormElement).addEventListener("submit", (event) => new User_Registration().init(event));
}

interface User_Registration_Types{
    init: (event: SubmitEvent) => void;
}

class User_Registration extends Input_Validation implements User_Registration_Types{
    init(event: SubmitEvent): void{
        this.register_user(event);
    }

    async register_user(event: SubmitEvent): Promise<void>{
        event.preventDefault();
        const username_input = document.getElementById("register-username") as HTMLInputElement;
        const password_input = document.getElementById("register-password") as HTMLInputElement;
        try{
            this.validate_input(username_input.value, password_input.value);
            const data = await fetch_data(
                "../backend/Account_Access/register_user.php",
                { 
                    method: "POST", 
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
                    body: new URLSearchParams({ username: username_input.value, password: password_input.value })
                },
                "Could not register. Please try again later."
            );
            username_input.value = password_input.value = "";
            display_message("registration_container", "success-message", data.query_success, "left-message");
        }
        catch(error){
            display_message("registration_container", "error-message", (error as Error).message, "left-message");
        }
    }
}


function switch_form(): void{
    const switch_to_sign_in = new Current_Form_Switch(
        "registration_container", 
        "signin_container", 
        "change-form-trigger-signin",
        "left-form-appear-animation", 
        "left-form-disappear-animation", 
        "right-form-appear-animation"   
    );
    (document.getElementById("change-form-trigger-register") as HTMLElement).addEventListener("click", () => switch_to_sign_in.change_form());
    const switch_to_registration = new Current_Form_Switch(
        "signin_container", 
        "registration_container", 
        "change-form-trigger-register",
        "right-form-appear-animation", 
        "right-form-disappear-animation", 
        "left-form-appear-animation"
    );
    (document.getElementById("change-form-trigger-signin") as HTMLElement).addEventListener("click", () => switch_to_registration.change_form());
}

interface Current_Form_Switch_Types{
    change_form: () => void;
}

class Current_Form_Switch implements Current_Form_Switch_Types{
    constructor(
        private shown_form_id: string, 
        private hidden_form_id: string, 
        private hidden_form_change_trigger_id: string,
        private shown_form_appear_anim_class: string, 
        private shown_form_disappear_anim_class: string, 
        private hidden_form_appear_anim_class: string
    ){}

    change_form(): void{
        const shown_form = document.getElementById(this.shown_form_id) as HTMLElement;
        const hidden_form = document.getElementById(this.hidden_form_id) as HTMLElement;
        const hidden_form_change_trigger = document.getElementById(this.hidden_form_change_trigger_id) as HTMLElement;

        shown_form.classList.replace(this.shown_form_appear_anim_class, this.shown_form_disappear_anim_class);
        hidden_form.classList.replace("hide-element", this.hidden_form_appear_anim_class);
        hidden_form_change_trigger.classList.add("click-disabled"); 

        shown_form.addEventListener("animationend", () => {
            shown_form.classList.replace(this.shown_form_disappear_anim_class, "hide-element");
            hidden_form_change_trigger.classList.remove("click-disabled");
        }, {once: true});
    }
}


function toggle_password_visibility(): void{
    const sign_in_password_visibility = new Password_Visibility_Toggle("signin-password-visibility", "sign-in-password");
    const registration_password_visibility = new Password_Visibility_Toggle("register-password-visibility", "register-password");
    (document.getElementById("signin-password-visibility") as HTMLElement).addEventListener("click", () => sign_in_password_visibility.toggle_password());
    (document.getElementById("register-password-visibility") as HTMLElement).addEventListener("click", () => registration_password_visibility.toggle_password());
}

interface Password_Visibility_Toggle_Types{
    toggle_password: () => void;
}

class Password_Visibility_Toggle implements Password_Visibility_Toggle_Types{
    constructor(private trigger_id: string, private triggered_input_id: string){}

    toggle_password(): void{
        const trigger = document.getElementById(this.trigger_id) as HTMLElement;
        const triggeredInput = document.getElementById(this.triggered_input_id) as HTMLInputElement;
        trigger.textContent = trigger.textContent === "visibility_off" ? "visibility" : "visibility_off";
        triggeredInput.type = triggeredInput.type === "text" ? "password" : "text";
    }
}