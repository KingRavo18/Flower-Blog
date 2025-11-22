import { Blog_Data_Submission, allow_tab_indentation } from "../Modules/Blog_Creation.js";

document.addEventListener("DOMContentLoaded", () => {
    submit_blog_data();
    allow_tab_indentation();
}, {once: true});


function submit_blog_data(): void{
    const blog_creation = new Blog_Data_Submission("../backend/Blog_Managment/Blog_Creation/blog_submit.php", false);
    (document.getElementById("tag-btn") as HTMLElement).addEventListener("click", () => blog_creation.collect_tag());
    (document.getElementById("blog-creation-form") as HTMLFormElement).addEventListener("submit", (event) => {
        blog_creation.init(event)
    });
}