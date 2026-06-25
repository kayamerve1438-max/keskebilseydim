document.addEventListener("keydown", function(e){

    if(e.key !== "Enter") return;

    const target = e.target;

    if(!target) return;

    const tag = target.tagName.toLowerCase();

    // Textarea ise: Enter gönderir, Shift+Enter alt satır yapar
    if(tag === "textarea"){
        if(e.shiftKey) return;

        e.preventDefault();

        const form = target.closest("form");
        if(form){
            const submitBtn = form.querySelector("button[type='submit'], button:not([type])");
            if(submitBtn) submitBtn.click();
            return;
        }

        const sendBtn =
            document.getElementById("sendCommentBtn") ||
            document.getElementById("sendMessageBtn") ||
            document.getElementById("sendReplyBtn");

        if(sendBtn) sendBtn.click();

        return;
    }

    // Input ise Enter ilgili ana butona bassın
    if(tag === "input"){
        const modal = target.closest(".auth-modal, .auth-box, .message-modal, .profile-page");

        if(modal){
            const mainBtn =
                modal.querySelector("#loginBtn") ||
                modal.querySelector("#registerBtn") ||
                modal.querySelector("#sendMessageBtn") ||
                modal.querySelector("button[type='submit']");

            if(mainBtn){
                e.preventDefault();
                mainBtn.click();
            }
        }
    }

    // ESC açık modalları kapatsın
    if(e.key === "Escape"){
        document.querySelectorAll(".active").forEach(el => {
            if(
                el.classList.contains("auth-modal") ||
                el.classList.contains("message-modal") ||
                el.classList.contains("success-modal") ||
                el.classList.contains("delete-confirm-modal") ||
                el.classList.contains("auth-required-modal")
            ){
                el.classList.remove("active");
            }
        });
    }
});