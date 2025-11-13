import { display_message } from "./module_message_display.js";
import { fetch_data } from "./module_fetch_data.js";
document.addEventListener("DOMContentLoaded", () => {
    create_blog();
}, { once: true });
function create_blog() {
    const blog_creation = new Blog_Creation;
    document.getElementById("tag-btn").addEventListener("click", () => blog_creation.collect_tags());
    document.getElementById("blog-creaton-form").addEventListener("submit", (event) => {
        blog_creation.init(event);
    });
}
class Blog_Creation {
    tags;
    tag_input;
    tag_display;
    constructor() {
        this.tags = [];
        this.tag_input = document.getElementById("blog-tag-input");
        this.tag_display = document.getElementById("tag-container");
    }
    async init(event) {
        await this.#submit_blog(event);
    }
    collect_tags() {
        if (this.tag_input.value.trim() !== "") {
            this.tags.push(this.tag_input.value);
            this.#display_tag();
            this.tag_input.value = "";
        }
    }
    #display_tag() {
        const displayed_tag = document.createElement("p");
        displayed_tag.classList.add("displayed-tag");
        displayed_tag.textContent = this.tag_input.value;
        this.tag_display.appendChild(displayed_tag);
    }
    async #submit_blog(event) {
        event.preventDefault();
        const title_input = document.getElementById("blog-title-input");
        const description_area = document.getElementById("blog-desc-input");
        const contents_area = document.getElementById("blog-contents-input");
        try {
            this.#validate_inputs(title_input.value, description_area.value, contents_area.value);
            const response = await fetch("../backend/Blog_Managment/Blog_Creation/blog_submit.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ title: title_input.value, description: description_area.value, contents: contents_area.value }),
            });
            if (!response.ok) {
                throw new Error("Could not create blog, please try again later.");
            }
            const data = await response.json();
            if (data.query_fail) {
                throw new Error(data.query_fail);
            }
            if (this.tags.length > 0) {
                this.#submit_tags(data.blog_id);
            }
            this.#form_reset(title_input, description_area, contents_area);
            display_message("document-body", "success-message", data.query_success, "center-message");
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
    #validate_inputs(title, description, contents) {
        if (title.trim() === "") {
            throw new Error("A blog must have a title.");
        }
        if (description.trim() === "") {
            throw new Error("A blog must have a description.");
        }
        if (contents.trim() === "") {
            throw new Error("A blog must have at least some sort of contents.");
        }
    }
    #submit_tags(blog_id) {
        this.tags.forEach(async (tag) => {
            const response = await fetch("../backend/Blog_Managment/Blog_Creation/blog_tag_submit.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ blog_id: blog_id.toString(), tag: tag }),
            });
            if (!response.ok) {
                throw new Error("Could not assign tags. Please assign them in blog edit later.");
            }
            const data = await response.json();
            if (data.query_fail) {
                throw new Error(data.query_fail);
            }
        });
    }
    #form_reset(title_input, description_area, contents_area) {
        title_input.value = description_area.value = this.tag_input.value = this.tag_display.innerHTML = contents_area.value = "";
        this.tags.length = 0;
    }
}
//# sourceMappingURL=webpage_create_blog.js.map