interface toggleElementReturnTypes {
    openElement: () => void;
    closeElement: () => void;
}
export function toggleElement(
    elementId: string, 
    showElementClass: string, 
    hideElementAnimClass: string, 
    belongingElementsId: string, 
    belongingElementDisappearAnimClass: string
): toggleElementReturnTypes{
    const element = document.getElementById(elementId) as HTMLElement;
    const secondElement_OrElementAgain = belongingElementsId === "none" ? element : document.getElementById(belongingElementsId) as HTMLElement;
    function openElement(): void{
        element.classList.remove("hide-element");
        element.classList.add(showElementClass);
    }
    function closeElement(): void{
        secondElement_OrElementAgain.classList.add(hideElementAnimClass);
        if(belongingElementsId !== "none"){
            element.classList.add(belongingElementDisappearAnimClass);
        }
        element.addEventListener("animationend", () => {
            secondElement_OrElementAgain.classList.remove(hideElementAnimClass);
            if(belongingElementsId !== "none"){
                element.classList.remove(belongingElementDisappearAnimClass);
            }
            element.classList.remove(showElementClass);
            element.classList.add("hide-element");
        }, { once: true });
    }
    return {openElement, closeElement};
}