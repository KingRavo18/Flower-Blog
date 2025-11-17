import type { Ui_Change_Types } from "./interface_for_init_classes.js";

export class No_Data_Paragraph_Display implements Ui_Change_Types{
    constructor(
        private empty_return_message: string,
        private paragraph_parent_id: string
    ){}

    init(): void{
        const no_blogs_message = document.createElement("p");
        no_blogs_message.classList.add("text-center", "basic-text-size");
        no_blogs_message.textContent = this.empty_return_message;
        (document.getElementById(this.paragraph_parent_id) as HTMLElement).appendChild(no_blogs_message);
    }
}
