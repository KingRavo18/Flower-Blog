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
    }
    catch(error){
        console.error((error as Error).message);
    }
}