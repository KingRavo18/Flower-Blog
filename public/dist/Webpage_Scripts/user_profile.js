import { toggle_element_visibility } from "../Modules/element_toggle.js";
import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";
document.addEventListener("DOMContentLoaded", () => {
    new Display_Title().init();
    new Update_Username().init();
    new Update_Password().init();
    new Delete_Account().init();
    new Find_Blog_By_Title().init();
    new Manage_User_Blogs().init();
}, { once: true });
// SECTION 1 - DISPLAY THE PROFILE PAGE'S TITLE 
class Display_Title {
    init() {
        this.#display_profile_page_title();
    }
    async #display_profile_page_title() {
        const profile_title = document.getElementById("profile-title");
        try {
            const data = await fetch_data("../backend/Data_Display/display_username.php", {}, "Failed to retrieve username.");
            profile_title.textContent = `${data.username}'s Profile`;
        }
        catch (error) {
            window.location.replace("../backend/Session_Maintanance/logout.php");
        }
    }
}
// SECTION 2 - UPDATE THE USER'S PROFILE
class Update_Username {
    init() {
        const username_change_popup = new Profile_Popup_Toggle("username-change-popup", "show-username-change-popup-btn", "hide-username-change-popup-btn");
        username_change_popup.init();
        document.getElementById("username-change-form").addEventListener("submit", (event) => this.#update_username(event));
    }
    async #update_username(event) {
        event.preventDefault();
        const password_input = document.getElementById("username-change-password-input");
        const new_username_input = document.getElementById("username-change-new-username-input");
        try {
            this.#validate_username_change_inputs(password_input.value, new_username_input.value);
            const data = await fetch_data("../backend/Update_Profile/change_username.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ password: password_input.value, new_username: new_username_input.value }),
            }, "Could not change username. Plese try again later.");
            password_input.value = new_username_input.value = "";
            display_message("profile-popup-background", "success-message", data.query_success, "center-message");
            new Display_Title().init();
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
class Update_Password {
    init() {
        const password_change_popup = new Profile_Popup_Toggle("password-change-popup", "show-password-change-popup-btn", "hide-password-change-popup-btn");
        password_change_popup.init();
        document.getElementById("password-change-form").addEventListener("submit", (event) => this.#change_password(event));
    }
    async #change_password(event) {
        event.preventDefault();
        const current_password_input = document.getElementById("password-change-current-password-input");
        const new_password_input = document.getElementById("password-change-new-password-input");
        try {
            this.#validate_password_change_inputs(current_password_input.value, new_password_input.value);
            const data = await fetch_data("../backend/Update_Profile/change_password.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ current_password: current_password_input.value, new_password: new_password_input.value })
            }, "Could not change password. Plese try again later.");
            current_password_input.value = new_password_input.value = "";
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
class Delete_Account {
    init() {
        const account_deletion_popup = new Profile_Popup_Toggle("account-deletion-popup", "show-account-deletion-popup-btn", "hide-account-deletion-popup-btn");
        account_deletion_popup.init();
        document.getElementById("acccount-deletion-form").addEventListener("submit", (event) => this.#delete_account(event));
    }
    async #delete_account(event) {
        event.preventDefault();
        const username_input = document.getElementById("account-deletion-username-input");
        const password_input = document.getElementById("account-deletion-password-input");
        try {
            this.#validate_account_deletion_inputs(username_input.value, password_input.value);
            const data = await fetch_data("../backend/Account_Termination/delete_account.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ username: username_input.value, password: password_input.value }),
            }, "Could not delete account. Plese try again later.");
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
// SECTION 3 - SORT/FIND THE DISPLAYED BLOGS
class Find_Blog_By_Title {
    init() {
        document.getElementById("find-by-title-input").addEventListener("input", () => this.#find_by_title());
    }
    #find_by_title() {
        const title_input = document.getElementById("find-by-title-input");
        const title = title_input.value.trim().toLowerCase();
        const blog_parent = document.getElementById("user-blog-container");
        const all_blogs = blog_parent.querySelectorAll(".blog-list-item");
        all_blogs.forEach(blog => {
            const blog_title = blog.querySelector(".blog-title").textContent.trim().toLowerCase();
            if (!blog_title.includes(title)) {
                blog.classList.remove("show-element-block");
                blog.classList.add("hide-element");
            }
            else {
                blog.classList.replace("hide-element", "show-element-block");
            }
        });
    }
}
class Manage_User_Blogs {
    init() {
        this.#retrieve_personal_blogs();
    }
    async #retrieve_personal_blogs() {
        try {
            const data = await fetch_data("../backend/Blog_Managment/user_blogs_retrive.php", {}, "Could not fetch your blogs. Please try again later.");
            if (data.row_count === 0) {
                this.#display_no_blogs_message();
            }
            else {
                data.blogs.forEach((blog) => {
                    this.#create_blog_list_item(blog.id, blog.title, blog.description);
                });
            }
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
    #create_blog_list_item(blog_id, title, description) {
        const blog_list_item = document.createElement("li");
        blog_list_item.classList.add("blog-list-item", "w-[70vw]", "cursor-pointer");
        blog_list_item.innerHTML = `
            <div class="blog-list-item-top-row">
                <h3 class="blog-title">${title}</h3>
                <div>
                    <button title="Edit this blog?" class="common-btn edit-blog-btn basic-text-size flex justify-center items-center">
                        <span class="material-symbols-outlined">
                            edit
                        </span>
                    </button>
                    <button title="Delete this blog?" class="common-btn delete-blog-btn basic-text-size flex justify-center items-center">
                        <span class="material-symbols-outlined">
                            delete
                        </span>
                    </button>
                </div>
            </div>
            <p class="text-[rgb(228,140,155)] max-w-[60vw] basic-text-size">${description}</p>
        `;
        this.#set_blog_click_event(blog_id, blog_list_item);
        this.#set_blog_edit_btn(blog_id, blog_list_item);
        this.#set_blog_deletion_btn(blog_id, blog_list_item);
        document.getElementById("user-blog-container").appendChild(blog_list_item);
    }
    #set_blog_click_event(blog_id, blog_list_item) {
        blog_list_item.addEventListener("click", () => {
            this.#transfer_user(blog_id, "./read_blog.html");
        });
    }
    #set_blog_edit_btn(blog_id, blog_list_item) {
        const edit_btn = blog_list_item.querySelector(".edit-blog-btn");
        edit_btn.addEventListener("click", (event) => {
            event.stopPropagation();
            this.#transfer_user(blog_id, "./edit_blog.html");
        });
    }
    async #transfer_user(blog_id, transfer_destination) {
        try {
            await fetch_data("../backend/Blog_Managment/Blog_Id_Transfer/blog_id_transfer.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ blog_id: blog_id.toString() })
            }, "Could not transfer user, please try again later.");
            window.location.href = transfer_destination;
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
    #set_blog_deletion_btn(blog_id, blog_list_item) {
        const delete_btn = blog_list_item.querySelector(".delete-blog-btn");
        delete_btn.addEventListener("click", (event) => {
            event.stopPropagation();
            this.#toggle_blog_deletion_confirmation_popup(blog_id, blog_list_item);
        });
    }
    #toggle_blog_deletion_confirmation_popup(blog_id, blog_list_item) {
        const { show_element, hide_element } = toggle_element_visibility("profile-popup-background", "show-element-block", "hide-popup-background-anim", "delete-blog-confirmation-popup", "show-element-flex", "hide-popup-anim");
        show_element();
        document.getElementById("blog-deletion-confirmation").addEventListener("click", async () => {
            await this.#delete_blog(blog_id);
            this.#set_new_profile_page(blog_list_item);
            hide_element();
        }, { once: true });
        document.getElementById("blog-deletion-denial").addEventListener("click", () => hide_element(), { once: true });
    }
    async #delete_blog(blog_id) {
        try {
            const data = await fetch_data("../backend/Blog_Managment/Blog_Deletion/blog_deletion.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ blog_id: blog_id.toString() })
            }, "Could not delete the blog. Please try again later.");
            display_message("document-body", "success-message", data.query_success, "center-message");
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
    #set_new_profile_page(blog_list_item) {
        blog_list_item.remove();
        if (document.querySelectorAll("#user-blog-container li").length === 0) {
            this.#display_no_blogs_message();
        }
    }
    #display_no_blogs_message() {
        const no_blogs_message = document.createElement("p");
        no_blogs_message.classList.add("text-center", "basic-text-size");
        no_blogs_message.textContent = "You have created no blogs. Begin now!";
        document.getElementById("user-blog-container").appendChild(no_blogs_message);
    }
}
//# sourceMappingURL=user_profile.js.map