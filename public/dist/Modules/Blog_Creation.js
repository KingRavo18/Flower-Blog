import { display_message } from "./message_display.js";
import { fetch_data } from "./fetch_data.js";
export class Blog_Data_Submission {
    submit_url;
    is_blog_update;
    tags;
    tag_input;
    tag_display;
    constructor(submit_url, is_blog_update) {
        this.submit_url = submit_url;
        this.is_blog_update = is_blog_update;
        this.tags = [];
        this.tag_input = document.getElementById("blog-tag-input");
        this.tag_display = document.getElementById("tag-container");
    }
    init(event) {
        this.#submit_blog(event);
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
            const data = await fetch_data(this.submit_url, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ title: title_input.value, description: description_area.value, contents: contents_area.value })
            }, "Could not create blog, please try again later.");
            if (this.tags.length > 0) {
                this.#submit_tags(data.blog_id);
            }
            if (!this.is_blog_update) {
                this.#form_reset(title_input, description_area, contents_area);
            }
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
            await fetch_data("../backend/Blog_Managment/Blog_Creation/blog_tag_submit.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ blog_id: blog_id.toString(), tag: tag })
            }, "Could not assign tags. Please assign them in blog edit later.");
        });
    }
    #form_reset(title_input, description_area, contents_area) {
        title_input.value = description_area.value = this.tag_input.value = this.tag_display.innerHTML = contents_area.value = "";
        this.tags.length = 0;
    }
}
export function allow_tab_indentation() {
    const text_area_ids = ["blog-desc-input", "blog-contents-input"];
    for (let i = 0; i < text_area_ids.length; i++) {
        const textarea_id = text_area_ids[i];
        if (textarea_id === undefined) {
            return;
        }
        const textarea = document.getElementById(textarea_id);
        textarea.addEventListener('keydown', (event) => {
            if (event.key === "Tab") {
                event.preventDefault();
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                textarea.value = textarea.value.substring(0, start) + "\t" + textarea.value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + 1;
            }
        });
    }
}
//# sourceMappingURL=Blog_Creation.js.map