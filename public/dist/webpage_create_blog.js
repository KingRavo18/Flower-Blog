import { display_message } from "./module_message_display.js";
document.addEventListener("DOMContentLoaded", () => {
    create_blog();
}, { once: true });
function create_blog() {
    const blog_creation = new Blog_Creation;
    document.getElementById("tag-btn").addEventListener("click", () => blog_creation.collect_tags());
    blog_creation.init();
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
    init() {
    }
    collect_tags() {
        if (this.tag_input.value.trim() !== "") {
            this.tags.push(this.tag_input.value);
            this.tag_input.value = "";
            this.tags.forEach(tag => {
                const displayed_tag = document.createElement("p");
                this.tag_display.appendChild(displayed_tag);
            });
        }
    }
    async create_blog() {
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