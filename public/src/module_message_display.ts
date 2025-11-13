export function display_message(element_id: string, message_class: string, contents: string, message_position: string): void{
    const element = document.getElementById(element_id) as HTMLElement;
    const message = document.createElement("p");
    message.classList.add(message_class, "message-appear", message_position);
    message.textContent = contents;
    element.appendChild(message);
    setTimeout(() => {
        message.classList.replace("message-appear", "message-disappear");
        message.addEventListener("animationend", () => element.removeChild(message), {once: true});
    }, 3000);
}