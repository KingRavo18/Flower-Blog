import { toggle_element_visibility } from "../Modules/element_toggle.js";
import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";
import { No_Data_Paragraph_Display } from "../Modules/No_Data_Paragraph_Display.js";
import { Blog_Creation, allow_tab_indentation } from "../Modules/Blog_Creation.js";
import type { Retrieve_Class_Types, Submit_Class_Types } from "../Modules/interface_for_init_classes.js";

document.addEventListener("DOMContentLoaded", () => {
    display_deletable_tags();
    submit_new_tag();

    display_blog_content();
    update_blog_content();
    allow_tab_indentation();
}, {once: true})


// SECTION 1 - TAG EDIT


class Deletable_Tag_Div_Creation{
    protected create_deletable_tags(tag_id: string | number, tag: string): void{
        const displayed_tag = document.createElement("div");
        displayed_tag.innerHTML = `
            <div class="flex items-center displayed-tag gap-[1vw]">
                <p>${tag}</p>
                <button type="button" title="Delete Tag?"
                    class="delete-tag-btn material-symbols-outlined select-none cursor-pointer 
                    p-[0.25vw] rounded-[50%] duration-200
                    hover:bg-[rgb(255,51,85)] active:bg-[rgb(228,140,155)]"
                >
                    close
                </button>
            </div>
        `;
        this.#set_tag_delete_btn(tag_id, displayed_tag);
        (document.getElementById("deletable-tag-container") as HTMLElement).appendChild(displayed_tag);
    }

    #set_tag_delete_btn(tag_id: string | number, displayed_tag: HTMLDivElement): void{
        const delete_tag_btn = displayed_tag.querySelector(".delete-tag-btn") as HTMLButtonElement;
        delete_tag_btn.addEventListener("click", () => {
            this.#delete_blog_tag(tag_id, displayed_tag);
        });
    }

    async #delete_blog_tag(tag_id: string | number, displayed_tag: HTMLDivElement): Promise<void>{
        try{
            const data = await fetch_data(
                "../backend/Blog_Managment/Blog_Editing/Blog_Tags/tag_deletion.php",
                { 
                    method: "POST", 
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
                    body: new URLSearchParams({ tag_id: tag_id.toString() })
                },
                "Failed to delete this tag. Please try again later."
            );
            displayed_tag.remove();
            display_message("document-body", "success-message", data.query_success, "center-message");
        }
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "center-message");
        }
    }
}


function display_deletable_tags(): void{
    new Editable_Tag_Retrieval().init();
}

type Deletable_Tag = {
    id: string | number;
    tag: string;
};

class Editable_Tag_Retrieval extends Deletable_Tag_Div_Creation implements Retrieve_Class_Types{
    init(): void{
        this.#display_editable_tags();
    }

    async #display_editable_tags(): Promise<void>{
        try{
            const data = await fetch_data(
                "../backend/Data_Display/display_blog_tags.php", {}, "Failed to load tags for this blog."
            );
            if(data.row_count === 0){
                new No_Data_Paragraph_Display("There are no tags for this blog.", "read-blog-tags").init();
            }
            else{
                (data.tags as Deletable_Tag[]).forEach((tag: Deletable_Tag) => {
                    this.create_deletable_tags(tag.id, tag.tag);
                });
            }
        }
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "center-message"); 
        }
    }
}


function submit_new_tag(): void{
    (document.getElementById("add-tag-form") as HTMLFormElement).addEventListener("submit", (event) => {
        new New_Blog_Tag_Addition().init(event);
    });
}

class New_Blog_Tag_Addition extends Deletable_Tag_Div_Creation implements Submit_Class_Types{
    init(event: SubmitEvent): void{
        event.preventDefault();
        this.#add_new_tag();
    }

    async #add_new_tag(): Promise<void>{
        const add_tag_input = document.getElementById("blog-edit-tag-input") as HTMLInputElement;
        if(add_tag_input.value.trim() === ""){
            return;
        }
        try{
            const data = await fetch_data(
                "../backend/Blog_Managment/Blog_Creation/blog_tag_submit.php",
                { 
                    method: "POST", 
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
                    body: new URLSearchParams({ tag: add_tag_input.value })
                },
                "Failed to add a new tag. Please try again later."
            );
            this.create_deletable_tags(data.tag_id, add_tag_input.value);
            add_tag_input.value = "";
            display_message("document-body", "success-message", data.query_success, "center-message");
        }
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "center-message");
        }
    }
}


// SECTION 2 - MAIN CONTENT EDIT 


function display_blog_content(): void{
    new Editable_Blog_Content_Retrieval().init();
    (document.getElementById("reset-inputs-btn") as HTMLButtonElement).addEventListener("click", () => new Editable_Blog_Content_Retrieval().undo_changes());
}

interface Blog_Content_Retrieval_Types{
    init: () => void;
    undo_changes: () => void;
}

class Editable_Blog_Content_Retrieval implements Blog_Content_Retrieval_Types{
    init(): void{
        this.#retrieve_blog_data();
    }

    undo_changes(): void{
        const {show_element, hide_element} = toggle_element_visibility(
            "profile-popup-background", 
            "show-element-block", 
            "hide-popup-background-anim",
            "undo-changes-confirmation-popup",
            "show-element-flex", 
            "hide-popup-anim"
        );
        show_element();
        (document.getElementById("change-undo-confirmation") as HTMLElement).addEventListener("click", async () => {
            this.init();
            hide_element();
        }, { once: true });
        (document.getElementById("change-undo-denial") as HTMLElement).addEventListener("click", () => hide_element(), { once: true });
    }

    async #retrieve_blog_data(): Promise<void>{
        const title_input = document.getElementById("blog-title-input") as HTMLInputElement;
        const description_area = document.getElementById("blog-desc-input") as HTMLTextAreaElement;
        const contents_area = document.getElementById("blog-contents-input") as HTMLTextAreaElement;
        try{
            const data = await fetch_data(
                "../backend/Blog_Managment/Blog_Editing/Blog_Contents/contents_retrieval.php", {}, "Failed to retrieve the blog's data, please try again later."
            );
            title_input.value = data.blog.title;
            description_area.value = data.blog.description;
            contents_area.value = data.blog.contents;
        }
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "center-message"); 
        }
    }

    async retrieve_blog_tags(): Promise<void>{

    }
}

function update_blog_content(): void{
    const blog_update = new Blog_Creation("../backend/Blog_Managment/Blog_Editing/Blog_Contents/contents_update.php", true);
    (document.getElementById("blog-update-form") as HTMLFormElement).addEventListener("submit", (event) => {
        blog_update.init(event)
        setTimeout(() => window.location.replace("./profile.html"), 1000);
    });
}