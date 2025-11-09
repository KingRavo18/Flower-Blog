import { display_message } from "./module_message_display.js";
document.addEventListener("DOMContentLoaded", () => {
    create_blog();
}, { once: true });
function create_blog() {
    const blog_creation = new Blog_Creation;
    document.getElementById("tag-btn").addEventListener("click", () => blog_creation.collect_tags());
    document.getElementById("blog-creaton-form").addEventListener("submit", (event) => blog_creation.init(event));
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
        await this.#create_blog(event);
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
    async #create_blog(event) {
        try {
            this.tags.length = 0;
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
    validate_inputs() {
    }
}
//# sourceMappingURL=webpage_create_blog.js.map