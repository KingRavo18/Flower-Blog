type Message_Class = "error-message" | "success-message";
type Message_Position = "left-message" | "right-message" | "center-message";

export function display_message(parent_id: string, message_status_class: Message_Class, contents: string, message_position: Message_Position): void{
    const element = document.getElementById(parent_id) as HTMLElement;
    const message = document.createElement("p");
    message.classList.add(message_status_class, "message-appear", message_position);
    message.textContent = contents;
    element.appendChild(message);
    setTimeout(() => {
        message.classList.replace("message-appear", "message-disappear");
        message.addEventListener("animationend", () => element.removeChild(message), {once: true});
    }, 3000);
}