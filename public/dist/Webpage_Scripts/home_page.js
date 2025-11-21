import { display_message } from "../Modules/message_display.js";
import { fetch_data } from "../Modules/fetch_data.js";
document.addEventListener("DOMContentLoaded", () => {
    display_all_blogs();
}, { once: true });
function display_all_blogs() {
    new Blog_Retrieval().init();
}
class Blog_Retrieval {
    init() {
        this.#retireve_blog_data();
    }
    async #retireve_blog_data() {
        try {
            const data = await fetch_data("../backend/Blog_Managment/all_blogs_retrieve.php", {}, "Failed to load blogs. Please try again later");
            console.log(data);
            if (data.row_count === 0) {
                this.#display_no_blogs_message();
            }
            else {
                data.blogs.forEach((blog) => {
                    this.#create_blog_list_item(blog.id, blog.title, blog.description, blog.username, blog.like_count, blog.dislike_count);
                });
            }
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
    #create_blog_list_item(blog_id, title, description, author, like_count, dislike_count) {
        const blog_list_item = document.createElement("li");
        blog_list_item.classList.add("blog-list-item", "w-[70vw]", "cursor-pointer");
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
        document.getElementById("all-blog-container").appendChild(blog_list_item);
    }
    async #transfer_to_read_page(blog_id) {
        try {
            await fetch_data("../backend/Blog_Managment/Blog_Id_Transfer/blog_id_transfer.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ blog_id: blog_id.toString() })
            }, "Could not transfer user, please try again later.");
            window.location.href = "./read_blog.html";
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
    #display_no_blogs_message() {
        const no_blogs_message = document.createElement("p");
        no_blogs_message.classList.add("text-center", "basic-text-size");
        no_blogs_message.textContent = "There are no blogs... Create some?";
        document.getElementById("all-blog-container").appendChild(no_blogs_message);
    }
}
//# sourceMappingURL=home_page.js.map