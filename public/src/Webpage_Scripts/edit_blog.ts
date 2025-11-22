import { toggle_element_visibility } from "../Modules/element_toggle.js";
import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";
import { Blog_Data_Submission, allow_tab_indentation } from "../Modules/Blog_Creation.js";
import type { Retrieve_Class_Types, Submit_Class_Types } from "../Modules/interface_for_init_classes.js";

document.addEventListener("DOMContentLoaded", () => {
    new Check_Blog_Ownership().init();
    new Editable_Tag_Retrieval().init();
    new Submit_Blog_Tags().init();
    new Retrieve_Editable_Blog_Content().init();
    update_blog_content();
    allow_tab_indentation();
}, {once: true})


// SECTION 1 - OWNERSHIP CHECK


class Check_Blog_Ownership implements Retrieve_Class_Types{
    init(): void{
        this.#check_ownership();
    }

    async #check_ownership(): Promise<void>{
        try{
            await fetch_data("../backend/Blog_Managment/Blog_Editing/Blog_Check/ownership_check.php", {}, "Failed the ownership check.");
        }
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "center-message"); 
        }
    }
}


// SECTION 2 - TAG EDIT


class Create_Deleteable_Tag{
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
        const delete_tag_btn = displayed_tag.querySelector(".delete-tag-btn") as HTMLButtonElement;
        delete_tag_btn.addEventListener("click", () => {
            this.#delete_blog_tag(tag_id, displayed_tag);
        });
        (document.getElementById("deletable-tag-container") as HTMLElement).appendChild(displayed_tag);
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

type Deletable_Tag = {
    id: string | number;
    tag: string;
};

class Editable_Tag_Retrieval extends Create_Deleteable_Tag implements Retrieve_Class_Types{
    init(): void{
        this.#display_editable_tags();
    }

    async #display_editable_tags(): Promise<void>{
        try{
            const data = await fetch_data(
                "../backend/Data_Display/display_blog_tags.php", {}, "Failed to load tags for this blog."
            );
            if(data.row_count > 0){
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

class Submit_Blog_Tags extends Create_Deleteable_Tag implements Submit_Class_Types{
    init(): void{
        (document.getElementById("add-tag-form") as HTMLFormElement).addEventListener("submit", (event) => {
            this.#submit_tag(event);
        });
    }

    async #submit_tag(event: SubmitEvent): Promise<void>{
        event.preventDefault();
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


// SECTION 3 - MAIN CONTENT EDIT 


class Retrieve_Editable_Blog_Content implements Retrieve_Class_Types{
    init(): void{
        this.#retrieve_blog_data();
        (document.getElementById("reset-inputs-btn") as HTMLButtonElement).addEventListener("click", () => this.#undo_changes());
    }

    #undo_changes(): void{
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
}

function update_blog_content(): void{
    const blog_update = new Blog_Data_Submission("../backend/Blog_Managment/Blog_Editing/Blog_Contents/contents_update.php", true);
    (document.getElementById("blog-update-form") as HTMLFormElement).addEventListener("submit", (event) => {
        blog_update.init(event)
        setTimeout(() => window.location.replace("./profile.html"), 1000);
    });
}