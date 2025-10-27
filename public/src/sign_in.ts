document.addEventListener("DOMContentLoaded", () => {
    const {openLeftForm, openRightForm} = changeForm();
    (document.getElementById("change-form-trigger-signin") as HTMLElement).onclick = () => openLeftForm();
    (document.getElementById("change-form-trigger-register") as HTMLElement).onclick = () => openRightForm();
});

interface changeFormReturnTypes{
    openLeftForm: () => void;
    openRightForm: () => void;
}
function changeForm(): changeFormReturnTypes{
    const leftForm = document.getElementById("registration_container") as HTMLElement;
    const rightForm = document.getElementById("signin_container") as HTMLElement;

    function openLeftForm(): void{
        rightForm.classList.remove("right-form-appear-animation");
        rightForm.classList.add("right-form-disappear-animation");
        leftForm.classList.add("left-form-appear-animation");
        leftForm.style.display = "block";
        setTimeout(() => {
            rightForm.style.display = "none";
            rightForm.classList.remove("right-form-disappear-animation");
        }, 1900);
    }

    function openRightForm(): void{
        leftForm.classList.remove("left-form-appear-animation");
        leftForm.classList.add("left-form-disappear-animation");
        rightForm.classList.add("right-form-appear-animation");
        rightForm.style.display = "block";
        setTimeout(() => {
            leftForm.style.display = "none";
            leftForm.classList.remove("left-form-disappear-animation");
        }, 1900);
    }

    return {openLeftForm, openRightForm}
}