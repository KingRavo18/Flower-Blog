import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";
import type { Retrieve_Class_Types, Ui_Change_Types } from "../Modules/interface_for_init_classes.js";

document.addEventListener("DOMContentLoaded", () => {
    new Search_For_Blogs().init();
    new Retrieve_Blogs("", []).init();
}, {once: true});

// SECTION 1 - SEARCH BARS


class Search_For_Blogs implements Ui_Change_Types{
    private tags: String[];
    private tag_index: number;

    constructor(){
        this.tags = [];
        this.tag_index = 0;
    }

    init(): void{
        (document.getElementById("find-btn") as HTMLButtonElement).addEventListener("click", () => {
            this.#submit_req();
        });
        (document.getElementById("add-tag-btn") as HTMLButtonElement).addEventListener("click", () => {
            this.#add_tag();
        });
    }

    #add_tag(): void{
        const tag_input = document.getElementById("find-by-tag-input") as HTMLInputElement;
        this.tags.push(tag_input.value);
        const displayed_tag = document.createElement("div");
        displayed_tag.innerHTML = `
            <div class="flex items-center displayed-tag gap-[1vw]">
                <p>${tag_input.value}</p>
                <button type="button" title="Delete Tag?"
                    class="delete-tag-btn material-symbols-outlined select-none cursor-pointer 
                    p-[0.25vw] rounded-[50%] duration-200
                    hover:bg-[rgb(255,51,85)] active:bg-[rgb(228,140,155)]"
                >
                    close
                </button>
            </div>
        `;
        const index = this.tag_index;
        const delete_tag_btn = displayed_tag.querySelector(".delete-tag-btn") as HTMLButtonElement;
        delete_tag_btn.addEventListener("click", () => {
            this.#remove_tag(index, displayed_tag);
        });
        tag_input.value = "";
        (document.getElementById("all-blog-tag-container") as HTMLElement).appendChild(displayed_tag);
        this.tag_index++;
    }

    #remove_tag(index: number, displayed_tag: HTMLDivElement){
        if(this.tags.length > 0){
            displayed_tag.remove();
            this.tags.splice(index, 1);
            this.tag_index--;
        }
    }

    #submit_req(): void{
        const title_input = document.getElementById("find-by-title-input") as HTMLInputElement;
        (document.getElementById("all-blog-container") as HTMLUListElement).innerHTML = "";
        new Retrieve_Blogs(title_input.value.trim(), this.tags).init();
    }
}


// SECTION 2 - ALL BLOG DISPLAY


type Blog = {
    id: number | string;
    title: string;
    description: string;
    username: string;
    like_count: number;
    dislike_count: number;
};

class Retrieve_Blogs implements Retrieve_Class_Types{
    constructor(
        private title_req: string,
        private tag_req: String[]
    ){}

    init(): void{
        this.#retireve_blog_data();
    }

    async #retireve_blog_data(): Promise<void>{
        try{
            const data = await fetch_data(
                "../backend/Blog_Managment/all_blogs_retrieve.php", 
                {
                    method: "POST", 
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
                    body: new URLSearchParams({ title_req: this.title_req, tag_req: JSON.stringify(this.tag_req)})
                }, 
                "Failed to load blogs. Please try again later");
            if(data.row_count === 0){
                this.#display_no_blogs_message();
            }
            else{
                (data.blogs as Blog[]).forEach((blog: Blog) => {
                    this.#create_blog_list_item(blog.id, blog.title, blog.description, blog.username, blog.like_count, blog.dislike_count);
                });
            }
        }
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "center-message");
        }
    }

    #create_blog_list_item(blog_id: number | string, title: string, description: string, author: string, like_count: number, dislike_count: number): void{
        const blog_list_item = document.createElement("li");
        blog_list_item.classList.add("blog-list-item", "w-[70vw]", "cursor-pointer", "container-appear-animation-below");
        blog_list_item.innerHTML = `
            <p>${title}</p>
            <p class="text-[rgb(228,140,155)] max-w-[60vw] basic-text-size mt-[0.1vw]">${description}</p>
            <div class="flex justify-between text-[rgb(228,140,155)] basic-text-size mt-[0.5vw]">
                <div class="flex justify-center items-center gap-[0.5vw]">
                    <p>${like_count}</p>
                    <span class="material-symbols-outlined">
                        thumb_up
                    </span>

                    <p>${dislike_count}</p>
                    <span class="material-symbols-outlined">
                        thumb_down
                    </span>
                </div>
                <p>By ${author}</p>
            </div>
        `;
        blog_list_item.addEventListener("click", () => {
            this.#transfer_to_read_page(blog_id);
        });
        (document.getElementById("all-blog-container") as HTMLUListElement).appendChild(blog_list_item);
    }

    async #transfer_to_read_page(blog_id: string | number): Promise<void>{
        try{
            await fetch_data(
                "../backend/Blog_Managment/Blog_Id_Transfer/blog_id_transfer.php",
                { 
                    method: "POST", 
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
                    body: new URLSearchParams({ blog_id: blog_id.toString() })
                },
                "Could not transfer user, please try again later."
            );
            window.location.href = "./read_blog.html";
        }
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "center-message");
        }
    }

    #display_no_blogs_message(): void{
        const no_blogs_message = document.createElement("p");
        no_blogs_message.classList.add("text-center", "basic-text-size");
        no_blogs_message.textContent = "There are no blogs... Create some?";
        (document.getElementById("all-blog-container") as HTMLElement).appendChild(no_blogs_message);
    }
}