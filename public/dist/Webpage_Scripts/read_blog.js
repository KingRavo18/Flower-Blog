import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";
document.addEventListener("DOMContentLoaded", () => {
    display_blog_content("read-blog-title", "title");
    display_blog_content("read-blog-author", "username");
    display_blog_content("read-blog-description", "description");
    display_blog_content("read-blog-contents", "contents");
    display_blog_tags();
    manage_comments();
}, { once: true });
function display_blog_content(element_id, content_type) {
    new Blog_Content_Retrieval(element_id, content_type).init();
}
class Blog_Content_Retrieval {
    display_id;
    content_type;
    #fetch_url;
    constructor(display_id, content_type) {
        this.display_id = display_id;
        this.content_type = content_type;
        this.#fetch_url = content_type === "username" ? "../backend/Data_Display/display_blog_author.php" : "../backend/Data_Display/display_blog_content.php";
    }
    init() {
        this.#retrieve_blog_content();
    }
    async #retrieve_blog_content() {
        const blog_contents_display = document.getElementById(this.display_id);
        try {
            const data = await fetch_data(this.#fetch_url, {}, "Failed to load the contents of this blog.");
            blog_contents_display.textContent = this.content_type === "username" ? `By ${data.content[this.content_type]}` : data.content[this.content_type];
            if (this.content_type === "title") {
                document.title = data.content.title;
            }
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
}
// SECTION 2 - DISPLAY TAGS
function display_blog_tags() {
    new Tags_Retrieval().init();
}
class Tags_Retrieval {
    init() {
        this.#retrieve_tags();
    }
    async #retrieve_tags() {
        try {
            const data = await fetch_data("../backend/Data_Display/display_blog_tags.php", {}, "Failed to load tags for this blog.");
            if (data.row_count === 0) {
                const no_tags_message = document.createElement("p");
                no_tags_message.classList.add("text-center", "basic-text-size");
                no_tags_message.textContent = "There are no tags for this blog.";
                document.getElementById("read-blog-tags").appendChild(no_tags_message);
            }
            else {
                data.tags.forEach((tag) => {
                    this.#create_tag(tag.tag);
                });
            }
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
    #create_tag(tag) {
        const displayed_tag = document.createElement("p");
        displayed_tag.classList.add("displayed-tag");
        displayed_tag.textContent = tag;
        document.getElementById("read-blog-tags").appendChild(displayed_tag);
    }
}
// SECTION 3 - COMMENT MANAGMENT
function manage_comments() {
    new Comment_Managment().init();
}
class Comment_Managment {
    comments_container;
    comment_amount;
    no_blogs_message;
    constructor() {
        this.comments_container = document.getElementById("read-blog-comments");
        this.comment_amount = 0;
        this.no_blogs_message = document.createElement("p");
    }
    init() {
        this.#retrieve_comments();
        document.getElementById("blog-comment-addition-form").addEventListener("submit", (event) => {
            this.#submit_comment(event);
        });
    }
    async #retrieve_comments() {
        try {
            const data = await fetch_data("../backend/Comment_Managment/Comment_Display/comment_ids_retrieve.php", {}, "Failed to load comments for this blog. Please try again later.");
            this.comment_amount = data.row_count;
            if (this.comment_amount === 0) {
                this.no_blogs_message.classList.add("text-center", "basic-text-size");
                this.no_blogs_message.textContent = "There are no comments for this blog.";
                this.comments_container.appendChild(this.no_blogs_message);
            }
            else {
                data.comments.forEach((comment) => {
                    this.#create_comment_element(comment.id);
                });
            }
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
    async #submit_comment(event) {
        event.preventDefault();
        const comment_area = document.getElementById("user_comment_area");
        try {
            if (comment_area.value.trim() === "") {
                return;
            }
            const data = await fetch_data("../backend/Comment_Managment/Comment_Creation/comment_create.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ comment: comment_area.value })
            }, "Failed to add your comment to this blog. Please try again later.");
            this.#create_comment_element(data.comment_id);
            comment_area.value = "";
            display_message("document-body", "success-message", data.query_success, "center-message");
            this.comment_amount++;
            if (this.comment_amount === 1) {
                this.comments_container.removeChild(this.no_blogs_message);
            }
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
    async #create_comment_element(comment_id) {
        try {
            const data = await fetch_data("../backend/Comment_Managment/Comment_Display/comment_content_retrieval.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ comment_id: comment_id.toString() })
            }, "Failed to load comments for this blog. Please try again later.");
            const comment_list_item = document.createElement("li");
            comment_list_item.classList.add("pointer-events-none", "w-[52vw]");
            comment_list_item.innerHTML = `
                <p>${data.comment_content}</p>
                <p class="text-[rgb(228,140,155)] text-right">By ${data.comment_author.username}, ${data.comment_date}</p>
            `;
            this.comments_container.insertBefore(comment_list_item, this.comments_container.firstChild);
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
}
//# sourceMappingURL=read_blog.js.map