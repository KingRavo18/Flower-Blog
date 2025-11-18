import { toggle_element_visibility } from "../Modules/element_toggle.js";
import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";
import { No_Data_Paragraph_Display } from "../Modules/No_Data_Paragraph_Display.js";
import { Blog_Creation, allow_tab_indentation } from "../Modules/Blog_Creation.js";
document.addEventListener("DOMContentLoaded", () => {
    retrieve_deletable_tags();
    retrieve_blog_data();
    update_blog_contents();
    allow_tab_indentation();
}, { once: true });
// SECTION 2 - TAG EDIT
function retrieve_deletable_tags() {
    new Editable_Tag_Retrieval().init();
}
class Editable_Tag_Retrieval {
    init() {
        this.#display_editable_tags();
    }
    async #display_editable_tags() {
        try {
            const data = await fetch_data("../backend/Data_Display/display_blog_tags.php", {}, "Failed to load tags for this blog.");
            if (data.row_count === 0) {
                new No_Data_Paragraph_Display("There are no tags for this blog.", "read-blog-tags").init();
            }
            else {
                data.tags.forEach((tag) => {
                    this.#create_deletable_tags(tag.id, tag.tag);
                });
            }
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
    #create_deletable_tags(tag_id, tag) {
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
        this.#set_tag_delete_btn(tag_id, displayed_tag);
        document.getElementById("deletable-tag-container").appendChild(displayed_tag);
    }
    #set_tag_delete_btn(tag_id, displayed_tag) {
        const delete_tag_btn = displayed_tag.querySelector(".delete-tag-btn");
        delete_tag_btn.addEventListener("click", () => {
            new Blog_Tag_Deletion().init(tag_id, displayed_tag);
        });
    }
}
class Blog_Tag_Deletion {
    async init(tag_id, display_tag) {
        await this.#delete_blog_tag(tag_id);
        display_tag.remove();
    }
    async #delete_blog_tag(tag_id) {
        try {
            const data = await fetch_data("../backend/Blog_Managment/Blog_Editing/Blog_Tags/tag_deletion.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ tag_id: tag_id.toString() })
            }, "Failed to delete this tag. Please try again later.");
            display_message("document-body", "success-message", data.query_success, "center-message");
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
}
function add_new_blog_tag() {
}
class New_Blog_Tag_Addition {
}
// SECTION 2 - MAIN CONTENT EDIT 
function retrieve_blog_data() {
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
    async retrieve_blog_tags() {
    }
}
function update_blog_contents() {
    const blog_update = new Blog_Creation("../backend/Blog_Managment/Blog_Editing/Blog_Contents/contents_update.php", true);
    document.getElementById("blog-update-form").addEventListener("submit", (event) => {
        blog_update.init(event);
        setTimeout(() => window.location.replace("./profile.html"), 1000);
    });
}
//# sourceMappingURL=edit_blog.js.map