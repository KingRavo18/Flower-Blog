import { Blog_Creation, allow_tab_indentation } from "../Modules/Blog_Creation.js";
document.addEventListener("DOMContentLoaded", () => {
    create_blog();
    allow_tab_indentation();
}, { once: true });
function create_blog() {
    const blog_creation = new Blog_Creation("../backend/Blog_Managment/Blog_Creation/blog_submit.php", false);
    document.getElementById("tag-btn").addEventListener("click", () => blog_creation.collect_tags());
    document.getElementById("blog-creation-form").addEventListener("submit", (event) => {
        blog_creation.init(event);
    });
}
//# sourceMappingURL=create_blog.js.map