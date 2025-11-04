export function toggle_element_visibility(element_id, element_show_class, hide_element_anim_class, 
// Attached Element
attached_element_id, attached_element_show_class, hide_attached_element_anim_class) {
    const element = document.getElementById(element_id);
    const attached_element = document.getElementById(attached_element_id);
    function show_element() {
        element.classList.remove("hide-element");
        element.classList.add(element_show_class);
        // Attached Element
        if (attached_element_id !== "none") {
            attached_element.classList.remove("hide-element");
            attached_element.classList.add(attached_element_show_class);
        }
    }
    function hide_element() {
        element.classList.add(hide_element_anim_class);
        // Attached Element
        if (attached_element_id !== "none") {
            attached_element.classList.add(hide_attached_element_anim_class);
        }
        element.addEventListener("animationend", () => {
            element.classList.remove(hide_element_anim_class);
            element.classList.remove(element_show_class);
            element.classList.add("hide-element");
            // Attached Element
            if (attached_element_id !== "none") {
                attached_element.classList.remove(hide_attached_element_anim_class);
                attached_element.classList.remove(attached_element_show_class);
                attached_element.classList.add("hide-element");
            }
        }, { once: true });
    }
    return { show_element, hide_element };
}
//# sourceMappingURL=toggleElement_module.js.map