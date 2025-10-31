document.addEventListener("DOMContentLoaded", () => {
    fetchNavbar();
}, {once: true});

async function fetchNavbar(){
    const header = document.getElementById("navigation-bar") as HTMLElement;
    if(!header){
        return;
    }
    try{
        const response = await fetch("./assets/components/nav-bar.html");
        if(!response.ok){
            throw new Error("Could not find the navigation bar.");
        }
        const data = await response.text();
        header.innerHTML = data;
    }
    catch(error){
        console.error((error as Error).message);
    }
}