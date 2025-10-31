document.addEventListener("DOMContentLoaded", () => {
    fetchNavbar();
}, {once: true});

async function fetchNavbar(){
    try{
        const response = await fetch("./assets/components/nav-bar.html");
        if(!response.ok){
            throw new Error("Could not find the navigation bar.");
        }
        const data = await response.text();
        (document.getElementById("navigation-bar") as HTMLElement).innerHTML = data;
    }
    catch(error){
        console.error((error as Error).message);
    }
}