export function display_message(element_id, message_class, contents, message_position) {
    const element = document.getElementById(element_id);
    const message = document.createElement("p");
    message.classList.add(message_class, "message-appear", message_position);
    message.textContent = contents;
    element.appendChild(message);
    setTimeout(() => {
        message.classList.remove("message-appear");
        message.classList.add("message-disappear");
        message.addEventListener("animationend", () => element.removeChild(message), { once: true });
    }, 3000);
}
//# sourceMappingURL=displayMessage_module.js.map