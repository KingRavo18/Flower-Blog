import { Blog_Creation } from "../Modules/Blog_Creation.js";

document.addEventListener("DOMContentLoaded", () => {
    create_blog();
}, {once: true});

function create_blog(){
    const blog_creation = new Blog_Creation("../backend/Blog_Managment/Blog_Creation/blog_submit.php", false);
    (document.getElementById("tag-btn") as HTMLElement).addEventListener("click", () => blog_creation.collect_tags());
    (document.getElementById("blog-creation-form") as HTMLFormElement).addEventListener("submit", (event) => {
        blog_creation.init(event)
    });
    blog_creation.textarea_tab_indentation();
}