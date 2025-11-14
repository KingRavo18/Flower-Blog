import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";
document.addEventListener("DOMContentLoaded", () => {
    retrieve_blog_data();
}, { once: true });
function retrieve_blog_data() {
    new Blog_Data_Retrieval().init();
}
class Blog_Data_Retrieval {
    init() {
        this.#retrieve_blog_data();
    }
    async #retrieve_blog_data() {
        const title_input = document.getElementById("blog-edit-title-input");
        const description_area = document.getElementById("blog-edit-desc-input");
        const contents_area = document.getElementById("blog-edit-contents-input");
        try {
            const data = await fetch_data("../backend/Blog_Managment/Blog_Editing/blog_data_retrieval.php", {}, "Failed to retrieve the blog's data, please try again later.");
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
function update_blog() {
    new Blog_Update().init();
}
class Blog_Update {
    init() {
    }
}
//# sourceMappingURL=edit_blog.js.map