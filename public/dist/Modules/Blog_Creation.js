import { display_message } from "./message_display.js";
import { fetch_data } from "./fetch_data.js";
export class Blog_Data_Submission {
    submit_url;
    is_blog_update;
    tags;
    tag_input;
    tag_display;
    tag_index;
    constructor(submit_url, is_blog_update) {
        this.submit_url = submit_url;
        this.is_blog_update = is_blog_update;
        this.tags = [];
        this.tag_input = document.getElementById("blog-tag-input");
        this.tag_display = document.getElementById("tag-container");
        this.tag_index = 0;
    }
    init(event) {
        this.#submit_blog(event);
    }
    collect_tag() {
        if (this.tag_input.value.trim() === "") {
            return;
        }
        this.tags.push(this.tag_input.value);
        const displayed_tag = document.createElement("div");
        displayed_tag.innerHTML = `
            <div class="flex items-center displayed-tag gap-[1vw]">
                <p>${this.tag_input.value}</p>
                <button type="button" title="Delete Tag?"
                    class="delete-tag-btn material-symbols-outlined select-none cursor-pointer 
                    p-[0.25vw] rounded-[50%] duration-200
                    hover:bg-[rgb(255,51,85)] active:bg-[rgb(228,140,155)]"
                >
                    close
                </button>
            </div>
        `;
        const index = this.tag_index;
        const delete_tag_btn = displayed_tag.querySelector(".delete-tag-btn");
        delete_tag_btn.addEventListener("click", () => {
            this.#remove_tag(index, displayed_tag);
        });
        this.tag_input.value = "";
        document.getElementById("tag-container").appendChild(displayed_tag);
        this.tag_index++;
    }
    #remove_tag(index, displayed_tag) {
        if (this.tags.length > 0) {
            displayed_tag.remove();
            this.tags.splice(index, 1);
            this.tag_index--;
        }
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