import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";
import type { Retrieve_Class_Types, Managment_Class_Types } from "../Modules/interface_for_init_classes.js";

document.addEventListener("DOMContentLoaded", () => {
    display_blog_content("read-blog-title", "title");
    display_blog_content("read-blog-author", "username");
    display_blog_content("read-blog-description", "description");
    display_blog_content("read-blog-contents", "contents");
    display_blog_tags();

    manage_comments()
}, {once: true});

// SECTION 1 - DISPLAY THE BLOG'S CONTENT

type content_type = "title" | "username" | "description" | "contents";

function display_blog_content(element_id: string, content_type: content_type): void{
    new Blog_Content_Retrieval(element_id, content_type).init();
}

class Blog_Content_Retrieval implements Retrieve_Class_Types{
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


// SECTION 2 - DISPLAY TAGS


function display_blog_tags(): void{
    new Tags_Retrieval().init();
}

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


// SECTION 3 - COMMENT MANAGMENT

function manage_comments(): void{
    new Comment_Managment().init();
}

type Comment = {
    id: string | number;
    user_id: string | number;
    blog_id: string | number;
    comment: string;
};

class Comment_Managment implements Managment_Class_Types{
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
                "../backend/Comment_Managment/Comment_Display/comment_ids_retrieve.php", {}, "Failed to load comments for this blog. Please try again later."
            );
            this.comment_amount = data.row_count;
            if(this.comment_amount === 0){
                this.no_blogs_message.classList.add("text-center", "basic-text-size");
                this.no_blogs_message.textContent = "There are no comments for this blog.";
                this.comments_container.appendChild(this.no_blogs_message);
            }
            else{
                (data.comments as Comment[]).forEach((comment: Comment) => {
                    this.#create_comment_element(comment.id);
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
            this.#create_comment_element(data.comment_id);
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

    async #create_comment_element(comment_id: number | string): Promise<void>{
        try{
            const data = await fetch_data(
                    "../backend/Comment_Managment/Comment_Display/comment_content_retrieval.php", 
                    {
                        method: "POST", 
                        headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
                        body: new URLSearchParams({ comment_id: comment_id.toString() })
                    }, 
                    "Failed to load comments for this blog. Please try again later."
                );
            const comment_list_item = document.createElement("li");
            comment_list_item.classList.add("pointer-events-none", "w-[52vw]");
            comment_list_item.innerHTML = `
                <p>${data.comment_content}</p>
                <p class="text-[rgb(228,140,155)] text-right">By ${data.comment_author.username}, ${data.comment_date}</p>
            `;
            this.comments_container.insertBefore(comment_list_item, this.comments_container.firstChild);
        }
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "center-message"); 
        }
    }
}