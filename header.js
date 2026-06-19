function initHeader(){
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll("nav a").forEach(link => {
        const href = link.getAttribute("href");
        if(!href) return;

        const cleanHref = href.split("?")[0];

        if(cleanHref === currentPage){
            link.classList.add("active-nav");
        }
    });
}

function loadAuth(){
    const script = document.createElement("script");
    script.type = "module";
    script.src = "auth.js";

    script.onload = function(){
        fetch("auth.html")
          .then(res => res.text())
          .then(data => {
              const authContainer = document.getElementById("auth-container");

              if(authContainer){
    authContainer.innerHTML = data;

    initAuth();

    const profileScript = document.createElement("script");
    profileScript.src = "profile.js";

    profileScript.onload = function(){
        if(typeof initProfile === "function"){
            initProfile();
        }
    };

    document.body.appendChild(profileScript);
}
          });
    };

    document.body.appendChild(script);
}

initHeader();
loadAuth();
