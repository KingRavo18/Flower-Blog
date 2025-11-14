import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";

document.addEventListener("DOMContentLoaded", () => {
    retrieve_blog_data();
}, {once: true})

function retrieve_blog_data(){
    new Blog_Data_Retrieval().init();
}

class Blog_Data_Retrieval{
    init(): void{
        this.#retrieve_blog_data();
    }

    async #retrieve_blog_data(): Promise<void>{
        const title_input = document.getElementById("blog-edit-title-input") as HTMLInputElement;
        const description_area = document.getElementById("blog-edit-desc-input") as HTMLTextAreaElement;
        const contents_area = document.getElementById("blog-edit-contents-input") as HTMLTextAreaElement;
        try{
            const data = await fetch_data(
                "../backend/Blog_Managment/Blog_Editing/blog_data_retrieval.php", {}, "Failed to retrieve the blog's data, please try again later."
            );
            title_input.value = data.title;
            description_area.value = data.description;
            contents_area.value = data.contents;
        }
        catch(error){
            display_message("signin_container", "error-message", (error as Error).message, "right-message"); 
        }
    }

    async retrieve_blog_tags(): Promise<void>{

    }
}

function update_blog(){
    new Blog_Update().init();
}

class Blog_Update{
    init(): void{

    }
}