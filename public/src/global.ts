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

        const {openSidebar, closeSidebar} = toggleSidebar();
        (document.getElementById("menu-activate-btn") as HTMLElement).addEventListener("click", () => openSidebar());
        (document.getElementById("menu-deactivate-btn") as HTMLElement).addEventListener("click", () => closeSidebar());
    }
    catch(error){
        console.error((error as Error).message);
    }
}

interface toggleSidebarReturnTypes {
    openSidebar: () => void;
    closeSidebar: () => void;
}
function toggleSidebar(): toggleSidebarReturnTypes{
    const sidebar = document.getElementById("toggleable-sidebar") as HTMLElement;
    function openSidebar(): void{
        sidebar.classList.remove("hide-sidebar");
    }
    function closeSidebar(): void{
        sidebar.classList.add("hide-sidebar");
    }
    return {openSidebar, closeSidebar};
}
