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
            const data = await fetch_data("../backend/Data_Managment/all_blogs_retrieve.php", {}, "Failed to load blogs. Please try again later");
            if (data.row_count === 0) {
                this.#display_no_blogs_message();
            }
            else {
                data.blogs.forEach((blog) => {
                    this.#create_blog_list_item();
                });
            }
        }
        catch (error) {
            display_message("document-body", "error-message", error.message, "center-message");
        }
    }
    #create_blog_list_item() {
    }
    async #transfer_to_read_page() {
    }
    #display_no_blogs_message() {
        const no_blogs_message = document.createElement("p");
        no_blogs_message.classList.add("text-center", "basic-text-size");
        no_blogs_message.textContent = "There are no blogs... Create some?";
        document.getElementById("all-blog-container").appendChild(no_blogs_message);
    }
}
//# sourceMappingURL=home_page.js.map