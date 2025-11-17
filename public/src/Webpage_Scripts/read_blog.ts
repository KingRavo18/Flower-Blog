import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";
import { No_Data_Paragraph_Display } from "../Modules/No_Data_Paragraph_Display.js";
import type { Retrieve_Class_Types } from "../Modules/interface_for_init_classes.js";

document.addEventListener("DOMContentLoaded", () => {
    display_content("read-blog-title", "title");
    display_content("read-blog-author", "username");
    display_content("read-blog-description", "description");
    display_content("read-blog-contents", "contents");
    display_tags();
    display_comments();
}, {once: true});

// SECTION 1 - DISPLAY THE BLOG'S CONTENT

type content_type = "title" | "username" | "description" | "contents";

function display_content(element_id: string, content_type: content_type): void{
    new Blog_Content_Display(element_id, content_type).init();
}

class Blog_Content_Display implements Retrieve_Class_Types{
    #fetch_url: string;

    constructor(
        private display_id: string, 
        private content_type: content_type
    ){
        this.#fetch_url = content_type === "username" ? "../backend/Data_Display/display_blog_author.php" : "../backend/Data_Display/display_blog_content.php";
    }

    init(): void{
        this.#display_blog_content();
    }

    async #display_blog_content(): Promise<void>{
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


function display_tags(): void{
    new Tags_Display().init();
}

type Tag = {
    tag: string;
};

class Tags_Display implements Retrieve_Class_Types{
    init(): void{
        this.#display_tags();
    }

    async #display_tags(): Promise<void>{
        try{
            const data = await fetch_data(
                "../backend/Data_Display/display_blog_tags.php", {}, "Failed to load tags for this blog."
            );
            if(data.row_count === 0){
                new No_Data_Paragraph_Display("There are no tags for this blog.", "read-blog-tags").init();
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


// SECTION 3 - DISPLAY COMMENTS FOR THIS BLOG


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
                "../backend/Comment_Managment/Comment_Display/comments_retrieve.php", {}, "Failed to load comments for this blog."
            );
            if(data.row_count === 0){
                new No_Data_Paragraph_Display("There are no comments for this blog.", "read-blog-comments").init();
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

    #create_comment(comment_id: number | string, user_id: number | string, blog_id: number | string, comment: string): void{

    }
}