import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";
import type { Retrieve_Class_Types } from "../Modules/interface_for_init_classes.js";

document.addEventListener("DOMContentLoaded", () => {
    display_title();
    display_description();
    display_contents();
    display_comments();
}, {once: true});

// SECTION 1 - DISPLAY THE BLOG'S CONTENT

function display_title(): void{
    new Blog_Title_Display("read-blog-title", "title").init();
}

function display_description(): void{
    new Blog_Title_Display("read-blog-description", "description").init();
}

function display_contents(): void{
    new Blog_Title_Display("read-blog-content", "contents").init();
}

type content_type = "title" | "description" | "contents";

class Blog_Title_Display implements Retrieve_Class_Types{
    constructor(
        private display_id: string, 
        private content_type: content_type
    ){}

    init(): void{
        this.#display_blog_content();
    }

    async #display_blog_content(): Promise<void>{
        const blog_contents_display = document.getElementById(this.display_id) as HTMLElement;
        try{
            const data = await fetch_data(
                "../backend/Data_Display/display_blog_contents.php", {}, "Failed to load the content's of this blog."
            );
            blog_contents_display.textContent = data.content[this.content_type];
            if(this.content_type === "title"){
                document.title = data.content.title;
            }
        }
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "center-message"); 
        }
    }
}

// SECTION 2 - DISPLAY COMMENTS FOR THIS BLOG

function display_comments(): void{
    new Comments_Display().init();
}

type Comment = {
    id: string | number;
    user_id: string | number;
    blog_id: string | number;
    comment: string;
};

class Comments_Display implements Retrieve_Class_Types{
    init(): void{
        this.#display_comments();
    }

    async #display_comments(): Promise<void>{
        try{
            const data = await fetch_data(
                "../backend/Comment_Managment/Comment_Display/comments_retrieve.php", {}, "Failed to load comments to this blog."
            );
            if(data.row_count === 0){
                this.#display_no_comments_message();
            }
            else{
                (data.comments as Comment[]).forEach((comment: Comment) => {
                    this.#create_comment(comment.id, comment.user_id, comment.blog_id, comment.comment);
                });
            }
        }
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "center-message"); 
        }
    }

    #display_no_comments_message(): void{
        const no_comments_message = document.createElement("p");
        no_comments_message.classList.add("no-blog-message", "basic-text-size");
        no_comments_message.textContent = "There are no comments for this blog.";
        (document.getElementById("read-blog-comments") as HTMLElement).appendChild(no_comments_message);
    }

    #create_comment(comment_id: number | string, user_id: number | string, blog_id: number | string, comment: string): void{

    }
}