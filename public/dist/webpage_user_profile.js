import { toggle_element_visibility } from "./module_element_toggle.js";
import { display_message } from "./module_message_display.js";
document.addEventListener("DOMContentLoaded", () => {
    display_title();
    change_username();
    change_password();
    delete_account();
    display_blogs();
}, { once: true });
// SECTION 1 - DISPLAY THE PROFILE PAGE'S TITLE 
function display_title() {
    const title_display = new Title_Display;
    title_display.display_profile_page_title();
}
class Title_Display {
    async display_profile_page_title() {
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
}
// SECTION 2 - CHANGE THE USER'S DATA
function change_username() {
    const username_change_popup = new Profile_Popup_Toggle("username-change-popup", "show-username-change-popup-btn", "hide-username-change-popup-btn");
    const username_change = new Username_Change;
    username_change_popup.init();
    document.getElementById("username-change-form").addEventListener("submit", (event) => username_change.init(event));
}
class Username_Change extends Title_Display {
    async init(event) {
        await this.#change_username(event);
    }
    async #change_username(event) {
        event.preventDefault();
        const password_input = document.getElementById("username-change-password-input");
        const new_username_input = document.getElementById("username-change-new-username-input");
        try {
            this.#validate_username_change_inputs(password_input.value, new_username_input.value);
            const response = await fetch("../backend/Update_Profile/change_username.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ password: password_input.value, new_username: new_username_input.value }),
            });
            if (!response.ok) {
                throw new Error("Could not change username. Plese try again later.");
            }
            const data = await response.json();
            if (data.query_fail) {
                throw new Error(data.query_fail);
            }
            password_input.value = "";
            new_username_input.value = "";
            display_message("profile-popup-background", "success-message", data.query_success, "center-message");
            this.display_profile_page_title();
        }
        catch (error) {
            display_message("profile-popup-background", "error-message", error.message, "center-message");
        }
    }
    #validate_username_change_inputs(password, new_username) {
        if (password.trim() === "") {
            throw new Error("Please input your password.");
        }
        if (new_username.trim() === "") {
            throw new Error("Please input your new username.");
        }
    }
}
function change_password() {
    const password_change_popup = new Profile_Popup_Toggle("password-change-popup", "show-password-change-popup-btn", "hide-password-change-popup-btn");
    const password_change = new Password_Change;
    password_change_popup.init();
    document.getElementById("password-change-form").addEventListener("submit", (event) => password_change.init(event));
}
class Password_Change {
    async init(event) {
        await this.#change_password(event);
    }
    async #change_password(event) {
        event.preventDefault();
        const current_password_input = document.getElementById("password-change-current-password-input");
        const new_password_input = document.getElementById("password-change-new-password-input");
        try {
            this.#validate_password_change_inputs(current_password_input.value, new_password_input.value);
            const response = await fetch("../backend/Update_Profile/change_password.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ current_password: current_password_input.value, new_password: new_password_input.value }),
            });
            if (!response.ok) {
                throw new Error("Could not change password. Plese try again later.");
            }
            const data = await response.json();
            if (data.query_fail) {
                throw new Error(data.query_fail);
            }
            current_password_input.value = "";
            new_password_input.value = "";
            display_message("profile-popup-background", "success-message", data.query_success, "center-message");
        }
        catch (error) {
            display_message("profile-popup-background", "error-message", error.message, "center-message");
        }
    }
    #validate_password_change_inputs(current_password, new_password) {
        if (current_password.trim() === "") {
            throw new Error("Please input your current password.");
        }
        if (new_password.trim() === "") {
            throw new Error("Please input your new password.");
        }
        if (new_password.length < 8) {
            throw new Error("A password must be at least 8 symbols long.");
        }
        if (!Boolean(new_password.match(/[a-z]/))) {
            throw new Error("A password must contain a non-capital letter.");
        }
        if (!Boolean(new_password.match(/[A-Z]/))) {
            throw new Error("A password must contain a capital letter.");
        }
        if (!Boolean(new_password.match(/[0-9]/))) {
            throw new Error("A password must contain a number.");
        }
        if (!Boolean(new_password.match(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/))) {
            throw new Error("A password must contain a special character.");
        }
        if (current_password.trim() === new_password.trim()) {
            throw new Error("Both input fields cannot contain the same password.");
        }
    }
}
function delete_account() {
    const account_deletion_popup = new Profile_Popup_Toggle("account-deletion-popup", "show-account-deletion-popup-btn", "hide-account-deletion-popup-btn");
    const account_deletion = new Account_Deletion;
    account_deletion_popup.init();
    document.getElementById("acccount-deletion-form").addEventListener("submit", (event) => account_deletion.init(event));
}
class Account_Deletion {
    async init(event) {
        await this.#delete_account(event);
    }
    async #delete_account(event) {
        event.preventDefault();
        const username_input = document.getElementById("account-deletion-username-input");
        const password_input = document.getElementById("account-deletion-password-input");
        try {
            this.#validate_account_deletion_inputs(username_input.value, password_input.value);
            const response = await fetch("../backend/Account_Termination/delete_account.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ username: username_input.value, password: password_input.value }),
            });
            if (!response.ok) {
                throw new Error("Could not delete account. Plese try again later.");
            }
            const data = await response.json();
            if (data.query_fail) {
                throw new Error(data.query_fail);
            }
            display_message("profile-popup-background", "success-message", data.query_success, "center-message");
            setTimeout(() => window.location.replace("../backend/Session_Maintanance/logout.php"), 1000);
        }
        catch (error) {
            display_message("profile-popup-background", "error-message", error.message, "center-message");
        }
    }
    #validate_account_deletion_inputs(username, password) {
        if (username.trim() === "") {
            throw new Error("Please input your username.");
        }
        if (password.trim() === "") {
            throw new Error("Please input your password.");
        }
    }
}
class Profile_Popup_Toggle {
    popup_id;
    show_popup_btn_id;
    hide_popup_btn_id;
    constructor(popup_id, show_popup_btn_id, hide_popup_btn_id) {
        this.popup_id = popup_id;
        this.show_popup_btn_id = show_popup_btn_id;
        this.hide_popup_btn_id = hide_popup_btn_id;
    }
    init() {
        this.#toggle_user_profile_popup();
    }
    #toggle_user_profile_popup() {
        const { show_element, hide_element } = toggle_element_visibility("profile-popup-background", "show-element-block", "hide-popup-background-anim", this.popup_id, "show-element-flex", "hide-popup-anim");
        document.getElementById(this.show_popup_btn_id).addEventListener("click", () => show_element());
        document.getElementById(this.hide_popup_btn_id).addEventListener("click", () => hide_element());
    }
}
// SECTION 3 - DISPLAY AND MANAGE THE USER'S PERSONAL BLOGS 
function display_blogs() {
    const blog_display = new Blog_Display;
    blog_display.init();
}
class Blog_Display {
    list_container;
    constructor() {
        this.list_container = document.getElementById("user-blog-container");
    }
    async init() {
        await this.#display_personal_blogs();
    }
    async #display_personal_blogs() {
        try {
            const response = await fetch("../backend/Blog_Managment/user_blogs_retrive.php");
            if (!response.ok) {
                throw new Error("Could not fetch your blogs. Please try again later.");
            }
            const data = await response.json();
            if (data.query_fail) {
                throw new Error(data.query_fail);
            }
            data.blogs.forEach((blog) => {
                this.#create_blog_list_item(blog.id, blog.title, blog.description);
            });
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
    #create_blog_list_item(id, title, description) {
        const blog_list_item = document.createElement("li");
        blog_list_item.innerHTML = `
            <div class="blog-list-item-top-row">
                <h3>${title}</h3>
                <div>
                    <button title="Edit this blog?" 
                            class="common-btn edit-blog-btn basic-text-size"
                    >
                        Edit
                    </button>
                    <button title="Delete this blog?" 
                            class="common-btn delete-blog-btn basic-text-size"
                    >
                        Delete
                    </button>
                </div>
            </div>
            <p class="description basic-text-size">${description}</p>
        `;
        const edit_btn = blog_list_item.querySelector(".edit-blog-btn");
        edit_btn.addEventListener("click", () => {
        });
        const delete_btn = blog_list_item.querySelector(".delete-blog-btn");
        delete_btn.addEventListener("click", () => {
            blog_list_item.remove();
            this.#show_popup(id);
        });
        this.list_container.appendChild(blog_list_item);
    }
    async #edit_blog() {
    }
    #show_popup(blog_id) {
        const { show_element, hide_element } = toggle_element_visibility("profile-popup-background", "show-element-block", "hide-popup-background-anim", "delete-blog-confirmation-popup", "show-element-flex", "hide-popup-anim");
        show_element();
        document.getElementById("").addEventListener("click", () => this.#delete_blog(blog_id));
    }
    async #delete_blog(blog_id) {
        try {
            const response = await fetch("../backend/Blog_Managment/user_blog_delete.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ blg_id: blog_id.toString() }),
            });
            if (!response.ok) {
                throw new Error("Could not delete the blog. Please try again later.");
            }
            const data = await response.json();
            if (data.query_fail) {
                throw new Error(data.query_fail);
            }
            display_message("profile-popup-background", "success-message", data.query_success, "center-message");
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
}
//# sourceMappingURL=webpage_user_profile.js.map