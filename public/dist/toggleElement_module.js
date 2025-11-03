export function toggleElement(elementId, showElementClass, hideElementAnimClass, belongingElementsId, belongingElementDisappearAnimClass) {
    const element = document.getElementById(elementId);
    const secondElement_OrElementAgain = belongingElementsId === "none" ? element : document.getElementById(belongingElementsId);
    function openElement() {
        element.classList.remove("hide-element");
        if (belongingElementsId !== "none") {
            secondElement_OrElementAgain.classList.remove("hide-element");
        }
        element.classList.add(showElementClass);
    }
    function closeElement() {
        secondElement_OrElementAgain.classList.add(hideElementAnimClass);
        if (belongingElementsId !== "none") {
            element.classList.add(belongingElementDisappearAnimClass);
        }
        element.addEventListener("animationend", () => {
            secondElement_OrElementAgain.classList.remove(hideElementAnimClass);
            if (belongingElementsId !== "none") {
                element.classList.remove(belongingElementDisappearAnimClass);
                secondElement_OrElementAgain.classList.add("hide-element");
            }
            element.classList.remove(showElementClass);
            element.classList.add("hide-element");
        }, { once: true });
    }
    return { openElement, closeElement };
}
//# sourceMappingURL=toggleElement_module.js.map