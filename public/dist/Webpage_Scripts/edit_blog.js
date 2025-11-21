import { toggle_element_visibility } from "../Modules/element_toggle.js";
import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";
import { Blog_Data_Submission, allow_tab_indentation } from "../Modules/Blog_Creation.js";
document.addEventListener("DOMContentLoaded", () => {
    display_deletable_tags();
    submit_tag();
    display_blog_content();
    update_blog_content();
    allow_tab_indentation();
}, { once: true });
// SECTION 1 - TAG EDIT
class Deletable_Tag_Creation {
    create_deletable_tags(tag_id, tag) {
        const displayed_tag = document.createElement("div");
        displayed_tag.innerHTML = `
            <div class="flex items-center displayed-tag gap-[1vw]">
                <p>${tag}</p>
                <button type="button" title="Delete Tag?"
                    class="delete-tag-btn material-symbols-outlined select-none cursor-pointer 
                    p-[0.25vw] rounded-[50%] duration-200
                    hover:bg-[rgb(255,51,85)] active:bg-[rgb(228,140,155)]"
                >
                    close
                </button>
            </div>
        `;
        const delete_tag_btn = displayed_tag.querySelector(".delete-tag-btn");
        delete_tag_btn.addEventListener("click", () => {
            this.#delete_blog_tag(tag_id, displayed_tag);
        });
        document.getElementById("deletable-tag-container").appendChild(displayed_tag);
    }
    async #delete_blog_tag(tag_id, displayed_tag) {
        try {
            const data = await fetch_data("../backend/Blog_Managment/Blog_Editing/Blog_Tags/tag_deletion.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ tag_id: tag_id.toString() })
            }, "Failed to delete this tag. Please try again later.");
            displayed_tag.remove();
            display_message("document-body", "success-message", data.query_success, "center-message");
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
}
function display_deletable_tags() {
    new Editable_Tag_Retrieval().init();
}
class Editable_Tag_Retrieval extends Deletable_Tag_Creation {
    init() {
        this.#display_editable_tags();
    }
    async #display_editable_tags() {
        try {
            const data = await fetch_data("../backend/Data_Display/display_blog_tags.php", {}, "Failed to load tags for this blog.");
            if (data.row_count > 0) {
                data.tags.forEach((tag) => {
                    this.create_deletable_tags(tag.id, tag.tag);
                });
            }
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
}
function submit_tag() {
    document.getElementById("add-tag-form").addEventListener("submit", (event) => {
        new Blog_Tag_Submission().init(event);
    });
}
class Blog_Tag_Submission extends Deletable_Tag_Creation {
    init(event) {
        event.preventDefault();
        this.#submit_tag();
    }
    async #submit_tag() {
        const add_tag_input = document.getElementById("blog-edit-tag-input");
        if (add_tag_input.value.trim() === "") {
            return;
        }
        try {
            const data = await fetch_data("../backend/Blog_Managment/Blog_Creation/blog_tag_submit.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ tag: add_tag_input.value })
            }, "Failed to add a new tag. Please try again later.");
            this.create_deletable_tags(data.tag_id, add_tag_input.value);
            add_tag_input.value = "";
            display_message("document-body", "success-message", data.query_success, "center-message");
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
}
// SECTION 2 - MAIN CONTENT EDIT 
function display_blog_content() {
    new Editable_Blog_Content_Retrieval().init();
    document.getElementById("reset-inputs-btn").addEventListener("click", () => new Editable_Blog_Content_Retrieval().undo_changes());
}
class Editable_Blog_Content_Retrieval {
    init() {
        this.#retrieve_blog_data();
    }
    undo_changes() {
        const { show_element, hide_element } = toggle_element_visibility("profile-popup-background", "show-element-block", "hide-popup-background-anim", "undo-changes-confirmation-popup", "show-element-flex", "hide-popup-anim");
        show_element();
        document.getElementById("change-undo-confirmation").addEventListener("click", async () => {
            this.init();
            hide_element();
        }, { once: true });
        document.getElementById("change-undo-denial").addEventListener("click", () => hide_element(), { once: true });
    }
    async #retrieve_blog_data() {
        const title_input = document.getElementById("blog-title-input");
        const description_area = document.getElementById("blog-desc-input");
        const contents_area = document.getElementById("blog-contents-input");
        try {
            const data = await fetch_data("../backend/Blog_Managment/Blog_Editing/Blog_Contents/contents_retrieval.php", {}, "Failed to retrieve the blog's data, please try again later.");
            title_input.value = data.blog.title;
            description_area.value = data.blog.description;
            contents_area.value = data.blog.contents;
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
}
function update_blog_content() {
    const blog_update = new Blog_Data_Submission("../backend/Blog_Managment/Blog_Editing/Blog_Contents/contents_update.php", true);
    document.getElementById("blog-update-form").addEventListener("submit", (event) => {
        blog_update.init(event);
        setTimeout(() => window.location.replace("./profile.html"), 1000);
    });
}
//# sourceMappingURL=edit_blog.js.map