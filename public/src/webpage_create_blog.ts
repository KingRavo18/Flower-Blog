import { display_message } from "./module_message_display.js";
document.addEventListener("DOMContentLoaded", () => {
    create_blog();
}, {once: true});

function create_blog(){
    const blog_creation = new Blog_Creation;
    (document.getElementById("tag-btn") as HTMLElement).addEventListener("click", () => blog_creation.collect_tags());
    blog_creation.init();
}

class Blog_Creation{
    tags: string[];
    tag_input: HTMLInputElement;
    tag_display: HTMLElement;

    constructor(){
        this.tags = [];
        this.tag_input = document.getElementById("blog-tag-input") as HTMLInputElement;
        this.tag_display = document.getElementById("tag-container") as HTMLElement;
    }

    init(){

    }

    collect_tags(){
        if(this.tag_input.value.trim() !== ""){
            this.tags.push(this.tag_input.value);
            this.tag_input.value = "";
            this.tags.forEach(tag => {
                const displayed_tag = document.createElement("p");
                this.tag_display.appendChild(displayed_tag);
            });
        }
    }

    async create_blog(){
        try{


            this.tags.length = 0;
        }
        catch(error){
            display_message("document-body", "error-message", (error as Error).message, "center-message");
        }
    }

    validate_inputs(){

    }
}

