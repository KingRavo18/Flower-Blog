document.addEventListener("DOMContentLoaded", () => {
    checkSession();
    fetchNavbar();
}, {once: true});

async function checkSession(): Promise<void>{
    try{
        const response = await fetch("../backend/Session_Maintanance/check_session.php");
        if(!response.ok){
            throw new Error("Could not find the session check.");
        }
        const data = await response.json();
        if(data.session_validation === "Failed"){
            throw new Error("Session validation failed.");
        }
    }
    catch(error){
        window.location.replace("../backend/Session_Maintanance/logout.php");
    }
}

async function fetchNavbar(): Promise<void>{
    try{
        const response = await fetch("./assets/components/nav-bar.html");
        if(!response.ok){
            throw new Error("Could not find the navigation bar.");
        }
        const data = await response.text();
        document.body.innerHTML = data;

        toggleSidebar();
        toggleLogoutWindow();
    }
    catch(error){
        console.error((error as Error).message);
    }
}
function toggleSidebar(): void{
    const {openElement, closeElement} = toggleElement("toggleable-sidebar", "show-element-flex", "sidebar-disappear");
    (document.getElementById("menu-activate-btn") as HTMLElement).addEventListener("click", () => openElement());
    (document.getElementById("menu-deactivate-btn") as HTMLElement).addEventListener("click", () => closeElement());
}
function toggleLogoutWindow(): void{
    const {openElement, closeElement} = toggleElement("toggleable-logout-window", "show-element-block", "logout-window-disappear");
    (document.getElementById("logout-list-btn") as HTMLElement).addEventListener("click", () => openElement());
    (document.getElementById("logout-deny-btn") as HTMLElement).addEventListener("click", () => closeElement());
}

interface toggleElementReturnTypes {
    openElement: () => void;
    closeElement: () => void;
}
function toggleElement(elementId: string, showElementClass: string, hideElementAnimClass: string): toggleElementReturnTypes{
    const element = document.getElementById(elementId) as HTMLElement;
    function openElement(): void{
        element.classList.remove("hide-element");
        element.classList.add(showElementClass);
    }
    function closeElement(): void{
        element.classList.add(hideElementAnimClass);
        element.addEventListener("animationend", () => {
            element.classList.remove(hideElementAnimClass);
            element.classList.remove(showElementClass);
            element.classList.add("hide-element");
        }, { once: true });
    }
    return {openElement, closeElement};
}