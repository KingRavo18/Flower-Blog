import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";

document.addEventListener("DOMContentLoaded", () => {
    display_title();
    display_description();
    display_contents();
    display_comments();
}, {once: true});


function display_title(): void{
    new Blog_Title_Display("read-blog-title", "title").init();
}

function display_description(): void{
    new Blog_Title_Display("read-blog-description", "description").init();
}

function display_contents(): void{
    new Blog_Title_Display("read-blog-content", "contents").init();
}

interface Blog_Title_Display_Types{
    init: () => void;
}

type content_type = "title" | "description" | "contents";

class Blog_Title_Display implements Blog_Title_Display_Types{
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
                "../backend/Data_Display/display_blog_contents.php", {}, "Failed to retrieve the blog's contents."
            );
            blog_contents_display.textContent = data.content[this.content_type];
            if(this.content_type === "title"){
                document.title = data.content.title;
            }
        }
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "right-message"); 
        }
    }
}


function display_comments(): void{
    new Comments_Display().init();
}

class Comments_Display{
    init(): void{

    }
}