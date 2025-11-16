import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";
document.addEventListener("DOMContentLoaded", () => {
    display_title();
    display_description();
    display_contents();
    display_comments();
}, { once: true });
// SECTION 1 - DISPLAY THE BLOG'S CONTENT
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
            const data = await fetch_data("../backend/Data_Display/display_blog_contents.php", {}, "Failed to load the content's of this blog.");
            blog_contents_display.textContent = data.content[this.content_type];
            if (this.content_type === "title") {
                document.title = data.content.title;
            }
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
}
// SECTION 2 - DISPLAY COMMENTS FOR THIS BLOG
function display_comments() {
    new Comments_Display().init();
}
class Comments_Display {
    init() {
        this.#display_comments();
    }
    async #display_comments() {
        try {
            const data = await fetch_data("../backend/Comment_Managment/Comment_Display/comments_retrieve.php", {}, "Failed to load comments to this blog.");
            if (data.row_count === 0) {
                this.#display_no_comments_message();
            }
            else {
                data.comments.forEach((comment) => {
                    this.#create_comment(comment.id, comment.user_id, comment.blog_id, comment.comment);
                });
            }
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
    #display_no_comments_message() {
        const no_comments_message = document.createElement("p");
        no_comments_message.classList.add("no-blog-message", "basic-text-size");
        no_comments_message.textContent = "There are no comments for this blog.";
        document.getElementById("read-blog-comments").appendChild(no_comments_message);
    }
    #create_comment(comment_id, user_id, blog_id, comment) {
    }
}
//# sourceMappingURL=read_blog.js.map