document.addEventListener("DOMContentLoaded", () => {
    const { openLeftForm, openRightForm } = changeForm();
    document.getElementById("change-form-trigger-signin").onclick = () => openLeftForm();
    document.getElementById("change-form-trigger-register").onclick = () => openRightForm();
});
function changeForm() {
    const leftForm = document.getElementById("registration_container");
    const rightForm = document.getElementById("signin_container");
    function openLeftForm() {
        rightForm.classList.remove("right-form-appear-animation");
        rightForm.classList.add("right-form-disappear-animation");
        leftForm.classList.add("left-form-appear-animation");
        leftForm.style.display = "block";
        setTimeout(() => {
            rightForm.style.display = "none";
            rightForm.classList.remove("right-form-disappear-animation");
        }, 1900);
    }
    function openRightForm() {
        leftForm.classList.remove("left-form-appear-animation");
        leftForm.classList.add("left-form-disappear-animation");
        rightForm.classList.add("right-form-appear-animation");
        rightForm.style.display = "block";
        setTimeout(() => {
            leftForm.style.display = "none";
            leftForm.classList.remove("left-form-disappear-animation");
        }, 1900);
    }
    return { openLeftForm, openRightForm };
}
export {};
//# sourceMappingURL=sign_in.js.map