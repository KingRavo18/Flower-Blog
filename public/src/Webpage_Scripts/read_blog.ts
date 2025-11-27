import { toggle_element_visibility } from "../Modules/element_toggle.js";
import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";
import type { Retrieve_Class_Types, Managment_Class_Types } from "../Modules/interface_for_init_classes.js";

document.addEventListener("DOMContentLoaded", () => {
    new Retrieve_Blog_Content("read-blog-title", "title").init();
    new Retrieve_Blog_Content("read-blog-author", "username").init();
    new Retrieve_Blog_Content("read-blog-description", "description").init();
    new Retrieve_Blog_Content("read-blog-contents", "contents").init();
    new Manage_Blog_Likes_or_Dislikes().init();
    new Tags_Retrieval().init();
    new Manage_Comments().init();
}, {once: true});


// SECTION 1 - DISPLAY THE BLOG'S CONTENT


type content_type = "title" | "username" | "description" | "contents";

class Retrieve_Blog_Content implements Retrieve_Class_Types{
    #fetch_url: string;

    constructor(
        private display_id: string, 
        private content_type: content_type
    ){
        this.#fetch_url = content_type === "username" ? "../backend/Data_Display/display_blog_author.php" : "../backend/Data_Display/display_blog_content.php";
    }

    init(): void{
        this.#retrieve_blog_content();
    }

    async #retrieve_blog_content(): Promise<void>{
        const blog_contents_display = document.getElementById(this.display_id) as HTMLElement;
        try{
            const data = await fetch_data(
                this.#fetch_url, {}, "Failed to load the contents of this blog."
            );
            blog_contents_display.textContent = this.content_type === "username" ? `By ${data.content[this.content_type]}` : data.content[this.content_type];
            if(this.content_type === "title"){
                document.title = data.content.title;
            }
        }
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "center-message"); 
        }
    }
}


// SECTION 2 - LIKES AND DISLIKES


class Manage_Blog_Likes_or_Dislikes implements Retrieve_Class_Types{
    private like_btn: HTMLButtonElement;
    private dislike_btn: HTMLButtonElement;

    constructor(){
        this.like_btn = document.getElementById("like-blog-btn") as HTMLButtonElement;
        this.dislike_btn = document.getElementById("dislike-blog-btn") as HTMLButtonElement;
    }

    init(): void{
        this.#retrieve_blog_likes();
        this.like_btn.addEventListener("click", () => this.#submit_like_entry(true));
        this.dislike_btn.addEventListener("click", () => this.#submit_like_entry(false));
    }

    async #retrieve_blog_likes(){
        try{
            const data = await fetch_data(
                    "../backend/Blog_Managment/Blog_Likes_Dislikes/retrieve_likes.php", 
                    {}, 
                    "Failed to like/dislike this blog. Please try again later."
            );
            (document.getElementById("like-counter") as HTMLParagraphElement).textContent = data.likes;
            (document.getElementById("dislike-counter") as HTMLParagraphElement).textContent = data.dislikes; 

            switch(data.is_liked){
                case "dislike":
                    this.like_btn.classList.remove("clicked_like");
                    this.dislike_btn.classList.add("clicked_dislike");
                    break;
                case "like":
                    this.like_btn.classList.add("clicked_like");
                    this.dislike_btn.classList.remove("clicked_dislike");
                    break;
                default:
                    this.like_btn.classList.remove("clicked_like");
                    this.dislike_btn.classList.remove("clicked_dislike");
            }
        } 
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "center-message"); 
        }
    }

    async #submit_like_entry(is_liked: boolean): Promise<void>{
        try{
            const data = await fetch_data(
                    "../backend/Blog_Managment/Blog_Likes_Dislikes/add_entry.php", 
                    {
                        method: "POST", 
                        headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
                        body: new URLSearchParams({ is_liked: is_liked.toString() })
                    }, 
                    "Failed to like/dislike this blog. Please try again later."
            );
            this.#retrieve_blog_likes();
        } 
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "center-message"); 
        }
    }   
}


// SECTION 3 - DISPLAY TAGS


type Tag = {
    tag: string;
};

class Tags_Retrieval implements Retrieve_Class_Types{
    init(): void{
        this.#retrieve_tags();
    }

    async #retrieve_tags(): Promise<void>{
        try{
            const data = await fetch_data(
                "../backend/Data_Display/display_blog_tags.php", {}, "Failed to load tags for this blog."
            );
            if(data.row_count === 0){
                const no_tags_message = document.createElement("p");
                no_tags_message.classList.add("text-center", "basic-text-size");
                no_tags_message.textContent = "There are no tags for this blog.";
                (document.getElementById("read-blog-tags") as HTMLElement).appendChild(no_tags_message);
            }
            else{
                (data.tags as Tag[]).forEach((tag: Tag) => {
                    this.#create_tag(tag.tag);
                });
            }
        }
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "center-message"); 
        }
    }

    #create_tag(tag: string): void{
        const displayed_tag = document.createElement("p");
        displayed_tag.classList.add("displayed-tag");
        displayed_tag.textContent = tag;
        (document.getElementById("read-blog-tags") as HTMLElement).appendChild(displayed_tag);
    }
}


// SECTION 4 - COMMENT MANAGMENT


type Comment = {
    id: string | number;
    comment: string;
    creation_date: string;
    username: string;
    is_users: boolean;
};

class Manage_Comments implements Managment_Class_Types{
    private comments_container: HTMLUListElement;
    private comment_amount: number;
    private no_blogs_message: HTMLParagraphElement;
    
    constructor(){
        this.comments_container = document.getElementById("read-blog-comments") as HTMLUListElement;
        this.comment_amount = 0;
        this.no_blogs_message = document.createElement("p");
    }

    init(): void{
        this.#retrieve_comments();
        (document.getElementById("blog-comment-addition-form") as HTMLFormElement).addEventListener("submit", (event) => {
            this.#submit_comment(event);
        });
    }

    async #retrieve_comments(): Promise<void>{
        try{
            const data = await fetch_data(
                "../backend/Comment_Managment/Comment_Display/comment_data_retrieve.php", {}, "Failed to load comments for this blog. Please try again later."
            );
            this.comment_amount = data.row_count;
            if(this.comment_amount === 0){
                this.no_blogs_message.classList.add("text-center", "basic-text-size");
                this.no_blogs_message.textContent = "There are no comments for this blog.";
                this.comments_container.appendChild(this.no_blogs_message);
            }
            else{
                (data.comments as Comment[]).forEach((comment: Comment) => {
                    this.#create_comment_element(comment.id, comment.comment, comment.creation_date, comment.username, comment.is_users);
                });
            }
        }
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "center-message"); 
        }
    }

    async #submit_comment(event: SubmitEvent): Promise<void>{
        event.preventDefault();
        const comment_area = document.getElementById("user_comment_area") as HTMLTextAreaElement;
        try{
            if(comment_area.value.trim() === ""){
                return;
            }
            const data = await fetch_data(
                "../backend/Comment_Managment/Comment_Creation/comment_create.php", 
                {
                    method: "POST", 
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
                    body: new URLSearchParams({ comment: comment_area.value })
                }, 
                "Failed to add your comment to this blog. Please try again later."
            );
            this.#create_comment_element(data.comment_id, comment_area.value, data.comment.creation_date, data.comment.username, data.comment.is_users);
            comment_area.value = "";
            display_message("document-body", "success-message", data.query_success, "center-message"); 

            this.comment_amount++;
            if(this.comment_amount === 1){
                this.comments_container.removeChild(this.no_blogs_message);
            }
        }
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "center-message"); 
        }
    }

    async #create_comment_element(comment_id: number | string, comment_content: string, comment_date: string, comment_author: string, is_users: boolean): Promise<void>{
        const comment_list_item = document.createElement("li");
        comment_list_item.classList.add("pointer-events-none", "w-[52vw]");
        comment_list_item.innerHTML = `
            <div class="flex justify-between py-[0.25vw]">
                <p>${comment_content}</p>
                <div class="flex comment_extra_btns gap-[0.5vw]"></div>
            </div>
            <p class="text-[rgb(228,140,155)] text-right">By ${comment_author}, ${comment_date}</p>
        `;
        if(is_users){
            new Manage_Users_Personal_Comments(comment_list_item, comment_id).init();
        }
        this.comments_container.insertBefore(comment_list_item, this.comments_container.firstChild);
    }
}

class Manage_Users_Personal_Comments implements Managment_Class_Types{
    constructor(
        private list_item: HTMLLIElement,
        private comment_id: string | number,
    ){}

    init(): void{
        this.#assign_buttons();
    }

    #assign_buttons(): void{
        const edit_btn = document.createElement("button");
        edit_btn.classList.add("pointer-events-auto", "common-btn", "material-symbols-outlined");
        edit_btn.textContent = "edit";
        edit_btn.addEventListener("click", () => {

        });
        (this.list_item.querySelector(".comment_extra_btns") as HTMLDivElement).appendChild(edit_btn);

        const delete_btn = document.createElement("button");
        delete_btn.classList.add("pointer-events-auto", "common-btn", "material-symbols-outlined");
        delete_btn.textContent = "delete";
        delete_btn.addEventListener("click", () => this.#toggle_comment_deletion_confirmation_popup());
        (this.list_item.querySelector(".comment_extra_btns") as HTMLDivElement).appendChild(delete_btn);
    }

    async #edit_comment(): Promise<void>{

    }

    #toggle_comment_deletion_confirmation_popup(): void{
        const {show_element, hide_element} = toggle_element_visibility(
            "read-popup-background", 
            "show-element-block", 
            "hide-popup-background-anim",
            "delete-comment-confirmation-popup",
            "show-element-flex", 
            "hide-popup-anim"
        );
        show_element();
        (document.getElementById("comment-deletion-confirmation") as HTMLElement).addEventListener("click", async () => {
            await this.#delete_comment();
            this.list_item.remove();
            hide_element();
        }, { once: true });
        (document.getElementById("comment-deletion-denial") as HTMLElement).addEventListener("click", () => hide_element(), { once: true });
    }

    async #delete_comment(): Promise<void>{
        try{
            const data = await fetch_data(
                "../backend/Comment_Managment/Comment_Deletion/comment_delete.php",
                { 
                    method: "POST", 
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
                    body: new URLSearchParams({ comment_id: this.comment_id.toString() })
                },
                "Could not delete this comment. Please try again later."
            );
            display_message("document-body", "success-message", data.query_success, "center-message");
        }
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "center-message");
        }
    }
}