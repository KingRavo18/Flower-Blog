import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";
document.addEventListener("DOMContentLoaded", () => {
    display_title();
    display_description();
    display_contents();
    display_comments();
}, { once: true });
function display_title() {
    new Blog_Title_Display("read-blog-title", "title").init();
}
function display_description() {
    new Blog_Title_Display("read-blog-description", "description").init();
}
function display_contents() {
    new Blog_Title_Display("read-blog-content", "contents").init();
}
class Blog_Title_Display {
    display_id;
    content_type;
    constructor(display_id, content_type) {
        this.display_id = display_id;
        this.content_type = content_type;
    }
    init() {
        this.#display_blog_content();
    }
    async #display_blog_content() {
        const blog_contents_display = document.getElementById(this.display_id);
        try {
            const data = await fetch_data("../backend/Data_Display/display_blog_contents.php", {}, "Failed to retrieve the blog's contents.");
            blog_contents_display.textContent = data.content[this.content_type];
            if (this.content_type === "title") {
                document.title = data.content.title;
            }
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "right-message");
        }
    }
}
function display_comments() {
    new Comments_Display().init();
}
class Comments_Display {
    init() {
    }
}
//# sourceMappingURL=read_blog.js.map