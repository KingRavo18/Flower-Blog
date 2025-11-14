import { toggle_element_visibility } from "../Modules/element_toggle.js";
import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";
import { Blog_Creation } from "../Modules/Blog_Creation.js";
document.addEventListener("DOMContentLoaded", () => {
    retrieve_blog_data();
}, { once: true });
function retrieve_blog_data() {
    new Blog_Contents_Retrieval().init();
    document.getElementById("reset-inputs-btn").addEventListener("click", () => new Blog_Contents_Retrieval().undo_changes());
}
class Blog_Contents_Retrieval {
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
        const title_input = document.getElementById("blog-edit-title-input");
        const description_area = document.getElementById("blog-edit-desc-input");
        const contents_area = document.getElementById("blog-edit-contents-input");
        try {
            const data = await fetch_data("../backend/Blog_Managment/Blog_Editing/Blog_Contents/contents_retrieval.php", {}, "Failed to retrieve the blog's data, please try again later.");
            console.log(data.blog);
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
}
//# sourceMappingURL=edit_blog.js.map