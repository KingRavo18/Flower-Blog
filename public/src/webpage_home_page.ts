import { display_message } from "./module_message_display.js";
document.addEventListener("DOMContentLoaded", () => {

}, {once: true});

async function display_blogs(): Promise<void>{
    try{

    }
    catch(error){
        display_message("document-body", "error-message", (error as Error).message, "center-message");
    }
}