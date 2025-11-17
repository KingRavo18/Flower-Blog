export function display_message(parent_id, message_status_class, contents, message_position) {
    const element = document.getElementById(parent_id);
    const message = document.createElement("p");
    message.classList.add(message_status_class, "message-appear", message_position);
    message.textContent = contents;
    element.appendChild(message);
    setTimeout(() => {
        message.classList.replace("message-appear", "message-disappear");
        message.addEventListener("animationend", () => element.removeChild(message), { once: true });
    }, 3000);
}
//# sourceMappingURL=message_display.js.map