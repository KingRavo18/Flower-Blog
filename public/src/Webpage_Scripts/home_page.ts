import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";
import type { Retrieve_Class_Types } from "../Modules/interface_for_init_classes.js";

document.addEventListener("DOMContentLoaded", () => {
    display_all_blogs();
}, {once: true});


function display_all_blogs(): void{
    new Blog_Retrieval().init();
}

type Blog = {
    id: number | string;
    title: string;
    description: string;
};

class Blog_Retrieval implements Retrieve_Class_Types{
    init(): void{
        this.#retireve_blog_data();
    }

    async #retireve_blog_data(): Promise<void>{
        try{
            const data = await fetch_data("../backend/Data_Managment/all_blogs_retrieve.php", {}, "Failed to load blogs. Please try again later");
            if(data.row_count === 0){
                this.#display_no_blogs_message();
            }
            else{
                (data.blogs as Blog[]).forEach((blog: Blog) => {
                    this.#create_blog_list_item();
                });
            }
        }
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "center-message");
        }
    }

    #create_blog_list_item(): void{

    }

    async #transfer_to_read_page(): Promise<void>{

    }

    #display_no_blogs_message(): void{
        const no_blogs_message = document.createElement("p");
        no_blogs_message.classList.add("text-center", "basic-text-size");
        no_blogs_message.textContent = "There are no blogs... Create some?";
        (document.getElementById("all-blog-container") as HTMLElement).appendChild(no_blogs_message);
    }
}