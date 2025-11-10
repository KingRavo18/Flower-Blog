import { display_message } from "./module_message_display.js";
document.addEventListener("DOMContentLoaded", () => {
    create_blog();
}, {once: true});

function create_blog(){
    const blog_creation = new Blog_Creation;
    (document.getElementById("tag-btn") as HTMLElement).addEventListener("click", () => blog_creation.collect_tags());
    (document.getElementById("blog-creaton-form") as HTMLFormElement).addEventListener("submit", (event) => blog_creation.init(event));
}

class Blog_Creation{
    tags: string[];
    tag_input: HTMLInputElement;
    tag_display: HTMLElement;

    constructor(){
        this.tags = [];
        this.tag_input = document.getElementById("blog-tag-input") as HTMLInputElement;
        this.tag_display = document.getElementById("tag-container") as HTMLElement;
    }

    async init(event: SubmitEvent): Promise<void>{
        await this.#create_blog(event);
    }

    collect_tags(): void{
        if(this.tag_input.value.trim() !== ""){
            this.tags.push(this.tag_input.value);
            this.#display_tag();
            this.tag_input.value = "";
        }
    }

    #display_tag(): void{
        const displayed_tag = document.createElement("p");
        displayed_tag.classList.add("displayed-tag");
        displayed_tag.textContent = this.tag_input.value;
        this.tag_display.appendChild(displayed_tag);
    }

    async #create_blog(event: SubmitEvent): Promise<void>{
        event.preventDefault();
        const title_input = document.getElementById("blog-title-input") as HTMLInputElement;
        const description_area = document.getElementById("blog-desc-input") as HTMLTextAreaElement;
        const contents_area = document.getElementById("blog-contents-input") as HTMLTextAreaElement;
        try{
            this.#validate_inputs(title_input.value, description_area.value, contents_area.value);
            const response = await fetch("../backend/Blog_Managment/user_blog_submit.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ title: title_input.value, description: description_area.value, contents: contents_area.value}),
            });
            if(!response.ok){
                throw new Error("Could not create blog, please try again later.");
            }
            const data = await response.json();
            if(data.query_fail){
                throw new Error(data.query_fail);
            }
            if(this.tags.length > 0){
                this.#submit_tags(data.blog_id);
            }
            this.#form_reset(title_input, description_area, contents_area);
            display_message("document-body", "success-message", data.query_success, "center-message");
        }
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "center-message");
        }
    }

    #validate_inputs(title: string, description: string, contents: string): void{
        if(title.trim() === ""){
            throw new Error("A blog must have a title.");
        }
        if(description.trim() === ""){
            throw new Error("A blog must have a description.");
        }
        if(contents.trim() === ""){
            throw new Error("A blog must have at least some sort of contents.");
        }
    }

    #submit_tags(blog_id: string): void{
        this.tags.forEach(async tag => {
            const response = await fetch("../backend/Blog_Managment/user_blog_submit_tag.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ blog_id: blog_id, tag: tag }),
            });
            if(!response.ok){
                throw new Error("Could not assign tags. Please assign them in blog edit later.");
            }
            const data = await response.json();
            if(data.query_fail){
                throw new Error(data.query_fail);
            }
        });
    }

    #form_reset(title_input: HTMLInputElement, description_area: HTMLTextAreaElement, contents_area: HTMLTextAreaElement): void{
        title_input.value = "";
        description_area.value = "";
        contents_area.value = ""; 
        this.tags.length = 0;
        this.tag_display.innerHTML = "";
    }
}

