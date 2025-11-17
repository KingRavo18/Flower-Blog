export class No_Data_Paragraph_Display {
    empty_return_message;
    paragraph_parent_id;
    constructor(empty_return_message, paragraph_parent_id) {
        this.empty_return_message = empty_return_message;
        this.paragraph_parent_id = paragraph_parent_id;
    }
    init() {
        const no_blogs_message = document.createElement("p");
        no_blogs_message.classList.add("text-center", "basic-text-size");
        no_blogs_message.textContent = this.empty_return_message;
        document.getElementById(this.paragraph_parent_id).appendChild(no_blogs_message);
    }
}
//# sourceMappingURL=No_Data_Paragraph_Display.js.map